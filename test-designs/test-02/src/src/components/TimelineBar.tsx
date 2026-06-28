import React from 'react';
import { Play, Pause } from 'lucide-react';
interface TimelineBarProps {
  currentYear: number;
  setCurrentYear: (year: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
}
export const TimelineBar: React.FC<TimelineBarProps> = ({
  currentYear,
  setCurrentYear,
  isPlaying,
  togglePlay
}) => {
  return (
    <div className="flex items-center gap-5 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-100 px-5 py-3.5 w-full">
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause timeline' : 'Play timeline'}
        className="shrink-0 w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
        
        {isPlaying ?
        <Pause size={18} fill="currentColor" /> :

        <Play size={18} fill="currentColor" className="ml-0.5" />
        }
      </button>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Year
          </span>
          <span className="text-base font-bold text-gray-900 tabular-nums">
            {Math.abs(currentYear)} {currentYear < 0 ? 'BCE' : 'CE'}
          </span>
        </div>
        <input
          type="range"
          min="-4500"
          max="1000"
          step="100"
          value={currentYear}
          onChange={(e) => setCurrentYear(parseInt(e.target.value))}
          aria-label="Year"
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
        
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 tabular-nums">
          <span>4500 BCE</span>
          <span>1000 CE</span>
        </div>
      </div>
    </div>);

};