export type MetricType = 'speakers' | 'devTime' | 'spread';

export interface Branch {
  id: string;
  name: string;
  color: string;
  lat: number;
  lng: number;
  speakers: number; // in millions
  devTime: number; // arbitrary metric for mockup
  spread: number; // arbitrary metric for mockup
  startYear: number; // divergence begins (BCE negative, CE positive)
  endYear: number; // migration completes at destination
  distKm: number; // geographic spread radius after arrival
  extinct?: boolean;
}

export const REGIONAL_SPREAD_DURATION = 800;

export const HOMELAND = {
  name: 'Proto-Indo-European homeland',
  lat: 48.0,
  lng: 40.0
};

export const BRANCHES: Branch[] = [
{
  id: 'anatolian',
  name: 'Anatolian †',
  color: '#666666',
  lat: 39.0,
  lng: 35.0,
  speakers: 0,
  devTime: 80,
  spread: 40,
  startYear: -3000,
  endYear: -2500,
  distKm: 1100,
  extinct: true
},
{
  id: 'tocharian',
  name: 'Tocharian †',
  color: '#999999',
  lat: 41.0,
  lng: 82.0,
  speakers: 0,
  devTime: 30,
  spread: 50,
  startYear: -2500,
  endYear: -1800,
  distKm: 3000,
  extinct: true
},
{
  id: 'hellenic',
  name: 'Hellenic',
  color: '#377eb8',
  lat: 39.0,
  lng: 22.0,
  speakers: 13,
  devTime: 90,
  spread: 30,
  startYear: -1800,
  endYear: -1400,
  distKm: 1900
},
{
  id: 'indo-aryan',
  name: 'Indo-Aryan',
  color: '#d95f02',
  lat: 22.0,
  lng: 79.0,
  speakers: 1100,
  devTime: 80,
  spread: 90,
  startYear: -2200,
  endYear: -1500,
  distKm: 1500
},
{
  id: 'armenian',
  name: 'Armenian',
  color: '#e7298a',
  lat: 40.0,
  lng: 45.0,
  speakers: 7,
  devTime: 75,
  spread: 25,
  startYear: -1500,
  endYear: -1000,
  distKm: 900
},
{
  id: 'iranian',
  name: 'Iranian',
  color: '#a6761d',
  lat: 32.0,
  lng: 53.0,
  speakers: 300,
  devTime: 85,
  spread: 70,
  startYear: -2200,
  endYear: -1500,
  distKm: 1200
},
{
  id: 'latino-faliscan',
  name: 'Latino-Faliscan',
  color: '#b30000',
  lat: 41.9,
  lng: 12.5,
  speakers: 900,
  devTime: 70,
  spread: 85,
  startYear: -1400,
  endYear: -900,
  distKm: 2000
},
{
  id: 'baltic',
  name: 'Baltic',
  color: '#b2df8a',
  lat: 55.0,
  lng: 25.0,
  speakers: 6,
  devTime: 45,
  spread: 35,
  startYear: -1500,
  endYear: -900,
  distKm: 400
},
{
  id: 'celtic',
  name: 'Celtic',
  color: '#33a02c',
  lat: 47.0,
  lng: 2.0,
  speakers: 2,
  devTime: 55,
  spread: 60,
  startYear: -1300,
  endYear: -700,
  distKm: 1000
},
{
  id: 'west-germanic',
  name: 'West Germanic',
  color: '#1b9e77',
  lat: 51.0,
  lng: 10.0,
  speakers: 500,
  devTime: 65,
  spread: 75,
  startYear: -1200,
  endYear: -700,
  distKm: 600
},
{
  id: 'albanian',
  name: 'Albanian',
  color: '#a6cee3',
  lat: 41.0,
  lng: 20.0,
  speakers: 8,
  devTime: 40,
  spread: 20,
  startYear: -1000,
  endYear: -500,
  distKm: 2100
},
{
  id: 'north-germanic',
  name: 'North Germanic',
  color: '#1f78b4',
  lat: 60.0,
  lng: 15.0,
  speakers: 20,
  devTime: 50,
  spread: 40,
  startYear: -1200,
  endYear: -500,
  distKm: 800
},
{
  id: 'slavic',
  name: 'Slavic',
  color: '#7570b3',
  lat: 55.0,
  lng: 35.0,
  speakers: 314,
  devTime: 60,
  spread: 80,
  startYear: -1500,
  endYear: -900,
  distKm: 1200
}];

export const formatMetric = (value: number, metric: MetricType) => {
  if (metric === 'speakers') {
    if (value === 0) return '0';
    if (value >= 1000) return `${(value / 1000).toFixed(1)}B`;
    return `${value}M`;
  }
  return `${value}`;
};

export const getMetricMax = (metric: MetricType) => {
  if (metric === 'speakers') return 1100;
  if (metric === 'devTime') return 100;
  if (metric === 'spread') return 100;
  return 100;
};

export function getRegionalSpreadRadius(branch: Branch, currentYear: number) {
  if (currentYear <= branch.endYear) return 0;

  const maxRadius = Math.max(30, branch.distKm / 22);
  let t = (currentYear - branch.endYear) / REGIONAL_SPREAD_DURATION;
  if (t > 1) t = 1;
  const easeOut = 1 - Math.pow(1 - t, 3);
  return easeOut * maxRadius;
}

export function getSpreadState(
  branch: Branch,
  currentYear: number,
  pathLength: number
) {
  if (currentYear < branch.startYear) {
    return { arcOffset: pathLength, nodeOpacity: 0, showArc: false };
  }

  if (currentYear >= branch.endYear) {
    return { arcOffset: 0, nodeOpacity: 1, showArc: true };
  }

  const span = branch.endYear - branch.startYear;
  const t = span === 0 ? 1 : (currentYear - branch.startYear) / span;
  const nodeOpacity = t > 0.8 ? (t - 0.8) / 0.2 : 0;

  return {
    arcOffset: branch.extinct ? 0 : pathLength * (1 - t),
    nodeOpacity,
    showArc: true
  };
}
