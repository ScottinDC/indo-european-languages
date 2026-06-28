import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  useMap } from
'react-leaflet';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import { BRANCHES, HOMELAND, Branch, getRegionalSpreadRadius, getSpreadState } from '../data';

const EUROPE_BOUNDS: L.LatLngBoundsExpression = [
  [35, -12],
  [62, 42]
];

interface MapPadding {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface MapCanvasProps {
  currentYear: number;
  fitPadding?: MapPadding;
}

const FitRegion: React.FC<{ padding: MapPadding }> = ({ padding }) => {
  const map = useMap();

  useEffect(() => {
    const fit = () => {
      map.invalidateSize({ animate: false });

      map.fitBounds(EUROPE_BOUNDS, {
        paddingTopLeft: [padding.left ?? 0, padding.top ?? 0],
        paddingBottomRight: [padding.right ?? 0, padding.bottom ?? 0],
        animate: false
      });

      const { x: width, y: height } = map.getSize();
      map.panBy(L.point(width * 0.05, height * 0.05), { animate: false });
    };

    map.whenReady(fit);
    map.on('resize', fit);
    return () => {
      map.off('resize', fit);
    };
  }, [map, padding.bottom, padding.left, padding.right, padding.top]);

  return null;
};
const ArcOverlay: React.FC<{
  currentYear: number;
}> = ({ currentYear }) => {
  const map = useMap();
  const pathRefs = useRef<Map<string, SVGPathElement>>(new Map());
  const [pathLengths, setPathLengths] = useState<Map<string, number>>(new Map());
  const [points, setPoints] = useState<{
    homeland: L.Point | null;
    branches: (Branch & {
      pt: L.Point;
    })[];
  }>({
    homeland: null,
    branches: []
  });

  useEffect(() => {
    const updatePoints = () => {
      const hl = map.latLngToContainerPoint([HOMELAND.lat, HOMELAND.lng]);
      const br = BRANCHES.map((b) => ({
        ...b,
        pt: map.latLngToContainerPoint([b.lat, b.lng])
      }));
      setPoints({
        homeland: hl,
        branches: br
      });
    };
    updatePoints();
    map.on('move', updatePoints);
    map.on('zoom', updatePoints);
    map.on('resize', updatePoints);
    return () => {
      map.off('move', updatePoints);
      map.off('zoom', updatePoints);
      map.off('resize', updatePoints);
    };
  }, [map]);

  useLayoutEffect(() => {
    const lengths = new Map<string, number>();
    pathRefs.current.forEach((el, id) => {
      lengths.set(id, el.getTotalLength());
    });
    setPathLengths(lengths);
  }, [points, currentYear]);

  if (!points.homeland) return null;

  const arcPath = (start: L.Point, end: L.Point) => {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const offset = dist * 0.2;
    const perpX = -dy / dist;
    const perpY = dx / dist;
    const cx = midX + perpX * offset;
    const cy = midY + perpY * offset;
    return `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
  };

  return createPortal(
    <svg
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{
        zIndex: 400
      }}>
      
      {points.branches.map((branch) => {
        const pathLength = pathLengths.get(branch.id) ?? 1000;
        const { arcOffset, nodeOpacity, showArc } = getSpreadState(
          branch,
          currentYear,
          pathLength
        );
        const regionalRadius = getRegionalSpreadRadius(branch, currentYear);
        if (!showArc) return null;

        const start = points.homeland!;
        const end = branch.pt;
        const pathData = arcPath(start, end);

        return (
          <g key={branch.id}>
            <path
              ref={(el) => {
                if (el) pathRefs.current.set(branch.id, el);
              }}
              d={pathData}
              fill="none"
              stroke={branch.color}
              strokeWidth={branch.extinct ? 1.5 : 2.2}
              strokeOpacity={branch.extinct ? 0.5 : 0.85}
              strokeLinecap="round"
              strokeDasharray={branch.extinct ? '1 5' : pathLength}
              strokeDashoffset={branch.extinct ? 0 : arcOffset} />

            {regionalRadius > 0 &&
            <circle
              cx={end.x}
              cy={end.y}
              r={regionalRadius}
              fill={branch.color}
              fillOpacity={0.12}
              stroke={branch.color}
              strokeWidth={1}
              strokeOpacity={0.3} />
            }
            
            <circle
              cx={end.x}
              cy={end.y}
              r="5"
              fill={branch.color}
              fillOpacity={branch.extinct ? 0.6 : 1}
              stroke="white"
              strokeWidth="2"
              opacity={nodeOpacity} />
            
            <text
              x={end.x}
              y={end.y - 10}
              textAnchor="middle"
              className="text-[11px] font-medium fill-gray-800"
              opacity={nodeOpacity}
              style={{
                textShadow:
                '0 1px 2px white, 0 -1px 2px white, 1px 0 2px white, -1px 0 2px white'
              }}>
              
              {branch.name}
            </text>
          </g>);

      })}

      {/* Homeland Marker */}
      <circle
        cx={points.homeland.x}
        cy={points.homeland.y}
        r="24"
        fill="#312e81"
        fillOpacity="0.14"
        className="animate-pulse-slow" />
      
      <circle
        cx={points.homeland.x}
        cy={points.homeland.y}
        r="6"
        fill="#312e81"
        stroke="white"
        strokeWidth="2" />
      
      <text
        x={points.homeland.x}
        y={points.homeland.y - 14}
        textAnchor="middle"
        className="text-xs font-semibold fill-indigo-950"
        style={{
          textShadow:
          '0 1px 2px white, 0 -1px 2px white, 1px 0 2px white, -1px 0 2px white'
        }}>
        
        {HOMELAND.name}
      </text>
    </svg>,
    map.getContainer()
  );
};
export const MapCanvas: React.FC<MapCanvasProps> = ({
  currentYear,
  fitPadding = { top: 14, bottom: 16, left: 16, right: 16 }
}) => {
  return (
    <div className="w-full h-full bg-[#e5e5e5] relative">
      <MapContainer
        center={[47, 35]}
        zoom={4}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        className="w-full h-full"
        style={{
          background: 'transparent'
        }}>
        
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' />
        
        <FitRegion padding={fitPadding} />
        <ArcOverlay currentYear={currentYear} />
      </MapContainer>

      {/* Homeland pulse */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes pulseSlow {
          0%, 100% { opacity: 0.14; transform: scale(1); }
          50% { opacity: 0.22; transform: scale(1.08); }
        }
        .animate-pulse-slow {
          animation: pulseSlow 3.4s ease-in-out infinite;
          transform-origin: center;
          transform-box: fill-box;
        }
      `
        }} />
      
    </div>);

};