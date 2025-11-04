import React from 'react'
import ScoreGauge from './scoreGauge'
import { TrendingUp, TrendingDown, AlertCircle, Bell, ChevronRight, Activity, Flame, Target, Clock, Zap, DollarSign, BarChart3, Award, Calendar, Users, GitBranch, Radio, Moon, Sun, Sparkles } from 'lucide-react';
import MoonshotFactorMini from './Moonshot';
import CryptoNews from './CryptoNews'
import EntryRecommendation from './Entry';
import Alert from './Alert';
import SkeletonLoader from './Skeleton';
import { useTheme } from "../context/ThemeContext";
const formatNumber = (num) => {
  // Remove $ sign and commas if present
  const cleanNum = typeof num === 'string'
    ? parseFloat(num.replace(/[$,]/g, ''))
    : num;

  if (isNaN(cleanNum)) return '$0';

  const absNum = Math.abs(cleanNum);

  if (absNum >= 1e12) {
    return '$' + (cleanNum / 1e12).toFixed(2) + 'T';
  } else if (absNum >= 1e9) {
    return '$' + (cleanNum / 1e9).toFixed(2) + 'B';
  } else if (absNum >= 1e6) {
    return '$' + (cleanNum / 1e6).toFixed(2) + 'M';
  } else if (absNum >= 1e3) {
    return '$' + (cleanNum / 1e3).toFixed(2) + 'K';
  } else {
    return '$' + cleanNum.toFixed(2);
  }
};

const RightSide = ({ selectedCoin, topCoinsData, isLoading = false }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`w-96 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border-l overflow-y-auto custom-scrollbar`}>
      <div className="p-4 space-y-4">
        {/* Selected Coin Detail */}
        {isLoading ? (
          <SkeletonLoader rows={1} height="h-64" />
        ) : (
          <div className={` items-center ${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-4 border shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-fit h-fit rounded-full  flex items-center justify-center text-white font-bold text-xl shadow-lg ">
                  <span>{selectedCoin?.icon}</span>
                </div>
                <div className="flex flex-row gap-1 items-center">
                  <div className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCoin?.symbol}</div>
                </div>
              </div>
              <div className="text-right ">
                <div className={`text-md font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCoin?.price}</div>
                <div
                  className={` ${parseFloat(selectedCoin?.change) >= 0 ? 'text-green-400' : 'text-red-700'}
                  text-sm font-semibold`}
                >
                  {selectedCoin?.change}
                </div>

              </div>
            </div>

            <div className="space-y-2 mb-4">
              {[
                { label: "Market Cap", value: formatNumber(selectedCoin?.mcap) },
                { label: "24h Volume", value: formatNumber(selectedCoin?.volume) },
                { label: "Moonshot Factor ", value: selectedCoin?.moonshot.toFixed(2) || 0 },
                { label: "Coin Quality Score", value: selectedCoin?.cqs ? `${selectedCoin.cqs.toLocaleString()}` : '$0' },

              ].map((item, idx) => (
                <div key={idx} className={`flex justify-between items-center text-sm p-2 rounded-lg ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'} transition-all`}>
                  <span className={isDarkMode ? 'text-zinc-400' : 'text-gray-600'}>{item.label}</span>
                  <span className={`font-semibold items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
                </div>
              ))}
            </div>

            <EntryRecommendation
              average={selectedCoin?.average ?? 0}
              isDarkMode={isDarkMode}
            />
            
          </div>
        )}

        {/* Alert
        {isLoading ? (
          <SkeletonLoader rows={1} height="h-32" />
        ) : (
          <Alert isDarkMode={isDarkMode} />
        )} */}

        {/* Moonshot Factor Mini */}
        {isLoading ? (
          <SkeletonLoader rows={1} height="h-40" />
        ) : (
          <MoonshotFactorMini isDarkMode={isDarkMode} coins={topCoinsData} analyzeCoin={selectedCoin} />
        )}

        {/* Crypto News */}
        {isLoading ? (
          <SkeletonLoader rows={1} height="h-48" />
        ) : (
          <CryptoNews isDarkMode={isDarkMode} />
        )}

      </div>
    </div>
  )
}

export default RightSide