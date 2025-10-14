import { TrendingUp, TrendingDown, AlertCircle, Bell, ChevronRight, Activity, Flame, Target, Clock, Zap, DollarSign, BarChart3, Award, TrendingUp as TrendUp, Calendar, Users, GitBranch, Radio, Moon, Sun, Sparkles } from 'lucide-react';

const FearGreedGauge = ({ value ,isDarkMode}) => {
    const getLabel = () => {
      if (value <= 20) return 'Extreme Fear';
      if (value <= 40) return 'Fear';
      if (value <= 60) return 'Neutral';
      if (value <= 80) return 'Greed';
      return 'Extreme Greed';
    };
    
    const getColor = () => {
  if (value <= 50) return '#B91C1C';  // light pastel yellow
  // bright yellow
  if (value >= 51) return '#22C55D';  // golden yellow
  return '#d0b345';                   // dark mustard yellow
};



    return (
      <div className={`${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'} rounded-xl p-4 border shadow-lg`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Fear & Greed Index</h3>
          <AlertCircle size={16} className={isDarkMode ? 'text-zinc-500' : 'text-gray-400'} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold" style={{ color: getColor() }}>{value}</div>
            <div className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>{getLabel()}</div>
            <div className={`text-xs ${value > 50 ? 'text-green-500' : 'text-red-700'}`} mt-2 flex items-center gap-1>
              <Sparkles size={15} />
              Buy Signal Active
            </div>
          </div>
          <div className="relative w-16 h-16">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke={isDarkMode ? "#27272a" : "#e5e7eb"} strokeWidth="4"/>
              <circle 
                cx="32" cy="32" r="28" fill="none" 
                stroke={getColor()} 
                strokeWidth="4"
                strokeDasharray={`${value * 1.75} 175`}
                strokeLinecap="round"
                transform="rotate(-90 32 32)"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  };
export default FearGreedGauge;