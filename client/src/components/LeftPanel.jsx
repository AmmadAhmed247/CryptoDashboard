import React from 'react';
import FearGreedGauge from './fearAndreed';
import { TrendingUp, TrendingDown, AlertCircle, Bell, ChevronRight, Activity, Flame, Target, Clock, Zap, DollarSign, BarChart3, Award, TrendingUp as TrendUp, Calendar, Users, GitBranch, Radio, Moon, Sun, Sparkles } from 'lucide-react';

const LeftPanel = ({ isDarkMode, fearGreedIndex, bitcoinHalving, altSeasonIndex, marketMetrics, topGainers }) => {
  return (
    <div className={`w-80 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border-r overflow-y-auto custom-scrollbar`}>
      <div className="p-4 space-y-4">
        {/* Fear & Greed */}
        <FearGreedGauge value={fearGreedIndex} isDarkMode={isDarkMode} />

        {/* Bitcoin Halving */}
        {/* Bitcoin Halving */}
<div
  className={`${
    isDarkMode
      ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700'
      : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
  } rounded-xl p-4 border shadow-lg hover:shadow-xl transition-all`}
>
  <div className="flex items-center gap-2 mb-3">
    <Clock className="text-[#d0b345]" size={18} />
    <h3
      className={`text-sm font-semibold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}
    >
      Bitcoin Halving
    </h3>
  </div>

  {bitcoinHalving ? (
    <div className="space-y-2">
      {/* Days Remaining */}
      <div className="flex justify-between items-center">
        <span
          className={`text-xs ${
            isDarkMode ? 'text-zinc-400' : 'text-gray-600'
          }`}
        >
          Days Remaining
        </span>
        <span className="text-2xl font-bold text-[#d0b345] bg-clip-text">
          {bitcoinHalving.daysRemaining}
        </span>
      </div>

      {/* Blocks Remaining */}
      <div
        className={`flex justify-between items-center text-xs ${
          isDarkMode ? 'text-zinc-300' : 'text-gray-700'
        }`}
      >
        <span
          className={isDarkMode ? 'text-zinc-400' : 'text-gray-600'}
        >
          Blocks Remaining
        </span>
        <span>
          {bitcoinHalving.blocksRemaining?.toLocaleString() ?? '...'}
        </span>
      </div>

      {/* Estimated Date */}
      <div
        className={`flex justify-between items-center text-xs ${
          isDarkMode ? 'text-zinc-300' : 'text-gray-700'
        }`}
      >
        <span
          className={isDarkMode ? 'text-zinc-400' : 'text-gray-600'}
        >
          Est. Date
        </span>
        <span>{bitcoinHalving.estimatedDate || '...'}</span>
      </div>

      {/* Progress Bar */}
      <div
        className={`w-full ${
          isDarkMode ? 'bg-zinc-700' : 'bg-gray-200'
        } rounded-full h-2 mt-3 overflow-hidden`}
      >
        <div
          className="bg-[#d0b345] h-2 rounded-full shadow-lg"
          style={{
            width: `${
              100 -
              ((bitcoinHalving.blocksRemaining / 210000) * 100).toFixed(2)
            }%`,
          }}
        ></div>
      </div>
    </div>
  ) : (
    <div className="text-xs text-gray-500">Loading halving data...</div>
  )}
</div>


        {/* Alt Season Index */}
        <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-4 border shadow-lg hover:shadow-xl transition-all`}>
          <div className="flex items-center gap-2 mb-3">
            <Zap className={`${altSeasonIndex >= 75 ? 'text-green-600' : 'text-red-700'}`} size={18} />
            <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Alt Season Index</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div
                className={`text-3xl font-bold ${altSeasonIndex >= 75 ? 'text-green-600' : 'text-red-700'
                  }`}
              >
                {altSeasonIndex}
              </div>

              <div className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>Bitcoin Season</div>
              <div className={`text-xs mt-2 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>Alt season at 75+</div>
            </div>
            <div className="relative w-20 h-20">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="35" fill="none" stroke={isDarkMode ? "#27272a" : "#e5e7eb"} strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="35" fill="none"
                  stroke={altSeasonIndex >= 75 ? "#22C55D" : "#B91C1C"}
                  strokeWidth="6"
                  strokeDasharray={`${altSeasonIndex * 2.2} 220`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Award className={`${altSeasonIndex >= 75 ? 'text-green-600' : 'text-red-700'}`} size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Market Metrics */}
       <div className="space-y-2">
  {marketMetrics.map((metric, idx) => {
    const changeValue = parseFloat(metric.change);
    return (
      <div
        key={idx}
        className={`${
          isDarkMode
            ? 'bg-gradient-to-r from-zinc-800 to-zinc-850 border-zinc-700'
            : 'bg-gradient-to-r from-white to-gray-50 border-gray-200'
        } rounded-lg p-3 border shadow-md hover:shadow-lg transition-all hover:scale-105`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#d0b345] rounded-lg">
              <metric.icon size={16} className="text-white" />
            </div>
            <span
              className={`text-xs ${
                isDarkMode ? 'text-zinc-400' : 'text-gray-600'
              }`}
            >
              {metric.label}
            </span>
          </div>

          {/* Dynamically color change value */}
          <span
            className={`text-xs font-semibold ${
              changeValue > 0
                ? 'text-green-400'
                : changeValue < 0
                ? 'text-red-400'
                : isDarkMode
                ? 'text-zinc-300'
                : 'text-gray-700'
            }`}
          >
            {metric.change}
          </span>
        </div>

        <div
          className={`text-lg font-bold mt-1 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          {metric.value}
        </div>
      </div>
    );
  })}
</div>


        {/* Top Gainers */}
        <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-4 border shadow-lg`}>
          <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <TrendingUp size={16} className="text-green-400" />
            Top Gainers 24h
          </h3>
          <div className="space-y-2">
            {topGainers.map((coin, idx) => (
              <div key={idx} className={`flex items-center justify-between p-2 rounded-lg ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'} transition-all cursor-pointer`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg">
                    {coin.icon}
                  </div>
                  <div>
                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{coin.name}</span>
                    <div className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{coin.price}</div>
                  </div>
                </div>
                <span className={`${coin.change > 0 ? 'text-green-400' : 'text-red-400'} text-sm font-semibold`}>{coin.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
