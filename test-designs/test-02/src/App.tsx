import React, { useEffect, useState } from 'react';
import { MapCanvas } from './src/components/MapCanvas';
import { ControlPanel } from './src/components/ControlPanel';
import { TimelineBar } from './src/components/TimelineBar';

export function App() {
  const [currentYear, setCurrentYear] = useState(-4500);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentYear((prev) => {
          if (prev >= 1000) {
            setIsPlaying(false);
            return 1000;
          }
          return prev + 50;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => {
    if (currentYear >= 1000) {
      setCurrentYear(-4500);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-screen bg-gray-100 overflow-hidden relative font-sans">
      <div className="w-full h-full bg-damask p-4 sm:p-6 lg:p-8">
        <div className="w-full h-full relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10">
          <MapCanvas
            currentYear={currentYear}
            fitPadding={{ top: 20, bottom: 100, left: 380, right: 40 }} />

          <div className="absolute top-5 left-5 bottom-5 z-[500] flex pointer-events-none">
            <div className="pointer-events-auto">
              <ControlPanel
                currentYear={currentYear}
                setCurrentYear={setCurrentYear}
                isPlaying={isPlaying}
                togglePlay={togglePlay}
                showTimeline={false} />
            </div>
          </div>

          <div className="absolute bottom-5 left-[380px] right-5 z-[500] flex justify-center pointer-events-none">
            <div className="pointer-events-auto w-full max-w-[640px]">
              <TimelineBar
                currentYear={currentYear}
                setCurrentYear={setCurrentYear}
                isPlaying={isPlaying}
                togglePlay={togglePlay} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
