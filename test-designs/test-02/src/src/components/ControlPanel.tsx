import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';
import { BRANCHES, MetricType, formatMetric, getMetricMax } from '../data';
import { cn } from '../utils';
interface ControlPanelProps {
  currentYear: number;
  setCurrentYear: (year: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  className?: string;
  showTimeline?: boolean;
}
export const ControlPanel: React.FC<ControlPanelProps> = ({
  currentYear,
  setCurrentYear,
  isPlaying,
  togglePlay,
  className,
  showTimeline = true
}) => {
  const [metric, setMetric] = useState<MetricType>('speakers');
  const totalSpeakers = 3.4; // Hardcoded for mockup to match 3.4B
  return (
    <div
      className={cn(
        'flex flex-col bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-6 w-[340px] max-h-full overflow-hidden border border-gray-100',
        className
      )}>
      
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1">
          Indo-European Language Family
        </h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Branches, speakers, and spread from the PIE homeland
        </p>
      </div>

      {/* Big Stat */}
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-600 mb-1">
          Estimated speakers today
        </p>
        <div className="text-4xl font-black tracking-tight text-gray-900">
          {totalSpeakers}B
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Across Indo-European languages
        </p>
      </div>

      {/* Segmented Control */}
      <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
        {(['speakers', 'devTime', 'spread'] as MetricType[]).map((m) =>
        <button
          key={m}
          onClick={() => setMetric(m)}
          className={cn(
            'flex-1 text-xs font-medium py-1.5 rounded-md transition-all',
            metric === m ?
            'bg-white text-indigo-600 shadow-sm' :
            'text-gray-500 hover:text-gray-700'
          )}>
          
            {m === 'speakers' ?
          'Speakers' :
          m === 'devTime' ?
          'Dev. time' :
          'Spread'}
          </button>
        )}
      </div>

      {/* Legend List */}
      <div
        className={cn(
          'flex-1 overflow-y-auto pr-2 -mr-2 space-y-2.5 custom-scrollbar',
          showTimeline ? 'mb-6' : 'mb-0'
        )}>
        
        {BRANCHES.map((branch) => {
          const val = branch[metric];
          const max = getMetricMax(metric);
          const widthPct = Math.max(2, val / max * 100);
          return (
            <div key={branch.id} className="flex items-center text-xs">
              <div className="w-24 truncate font-medium text-gray-700 pr-2">
                {branch.name}
              </div>
              <div className="flex-1 flex items-center h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: branch.color
                  }} />
                
              </div>
              <div className="w-12 text-right text-gray-400 font-medium tabular-nums">
                {formatMetric(val, metric)}
              </div>
            </div>);

        })}
      </div>

      {/* Timeline Controls */}
      {showTimeline &&
      <div className="pt-4 mt-6 border-t border-gray-100">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs font-medium text-gray-500">Year</span>
            <span className="text-lg font-bold text-gray-900 tabular-nums">
              {Math.abs(currentYear)} {currentYear < 0 ? 'BCE' : 'CE'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <input
            type="range"
            min="-4500"
            max="1000"
            step="100"
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          
            <button
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
            
              {isPlaying ?
            <Pause size={16} fill="currentColor" /> :

            <Play size={16} fill="currentColor" className="ml-0.5" />
            }
            </button>
          </div>
        </div>
      }
    </div>);

};