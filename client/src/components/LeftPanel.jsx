import React from 'react';
import FearGreedGauge from './fearAndreed';
import SkeletonLoader from './Skeleton.jsx';
import { TrendingUp, Clock, Zap } from 'lucide-react';
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from 'react-i18next';

const LeftPanel = ({ 
  fearGreedIndex, 
  bitcoinHalving, 
  altSeasonIndex, 
  marketMetrics, 
  topGainers,
  isLoading = true
}) => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      className={`w-80 ${
        isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'
      } border-r overflow-y-auto custom-scrollbar`}
    >
      <div className="p-4 space-y-4">

        {/* ---------------- Fear & Greed Index ---------------- */}
        {isLoading ? (
          <SkeletonLoader rows={1} height="h-24" />
        ) : (
          <FearGreedGauge value={fearGreedIndex} isDarkMode={isDarkMode} />
        )}

        {/* ---------------- Alt Season Index ---------------- */}
        {isLoading ? (
          <SkeletonLoader rows={1} height="h-32" />
        ) : (
          <div
            className={`${
              isDarkMode
                ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700'
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            } rounded-xl p-4 border shadow-lg hover:shadow-xl transition-all`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap
                className={`${altSeasonIndex >= 75 ? 'text-green-500' : 'text-red-600'}`}
                size={18}
              />
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('altSeasonIndex')}
              </h3>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold ${altSeasonIndex >= 75 ? 'text-green-500' : 'text-red-600'}`}>
                  {altSeasonIndex}
                </div>
                <div className={`text-xs mt-1 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                  {t('bitcoinSeason')}
                </div>
                <div className={`text-xs mt-2 ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                  {t('allSeasonStarts')} 75+
                </div>
              </div>

              {/* Circle Gauge */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    className={`stroke-[3] ${isDarkMode ? 'stroke-zinc-700' : 'stroke-gray-300'}`}
                    fill="none"
                    cx="18"
                    cy="18"
                    r="15.9155"
                  />
                  <circle
                    className={`stroke-[3] ${altSeasonIndex >= 75 ? 'stroke-green-500' : 'stroke-red-600'} transition-all duration-700`}
                    fill="none"
                    strokeDasharray={`${Math.min(altSeasonIndex, 100)}, 100`}
                    strokeLinecap="round"
                    cx="18"
                    cy="18"
                    r="15.9155"
                  />
                </svg>

                <div
                  className={`absolute w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    isDarkMode ? 'bg-zinc-800 border border-zinc-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <Zap size={20} className={`${altSeasonIndex >= 75 ? 'text-green-500' : 'text-red-600'}`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- Bitcoin Halving ---------------- */}
        {isLoading ? (
          <SkeletonLoader rows={1} height="h-48" />
        ) : (
          <div
            className={`${
              isDarkMode
                ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700'
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            } rounded-xl p-4 border shadow-lg hover:shadow-xl transition-all`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="text-[#d0b345]" size={18} />
              <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('bitcoinHalving')}
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{t('daysRemaining')}</span>
                <span className="text-2xl font-bold text-[#d0b345]">{bitcoinHalving.daysRemaining}</span>
              </div>
              <div className={`flex justify-between items-center text-xs ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
                <span className={isDarkMode ? 'text-zinc-400' : 'text-gray-600'}>{t('blocksRemaining')}</span>
                <span>{bitcoinHalving.blocksRemaining?.toLocaleString() ?? '...'}</span>
              </div>
              <div className={`flex justify-between items-center text-xs ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>
                <span className={isDarkMode ? 'text-zinc-400' : 'text-gray-600'}>{t('estDate')}</span>
                <span>{bitcoinHalving.estimatedDate || '...'}</span>
              </div>
              <div className={`w-full ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-200'} rounded-full h-2 mt-3 overflow-hidden`}>
                <div
                  className="bg-[#d0b345] h-2 rounded-full shadow-lg"
                  style={{ width: `${100 - ((bitcoinHalving.blocksRemaining / 210000) * 100).toFixed(2)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- Market Metrics ---------------- */}
        {isLoading ? (
          <SkeletonLoader rows={3} height="h-20" />
        ) : (
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
                      <span className={`text-xs  ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                        {t(metric.label)}
                      </span>
                    </div>
                    <span className={`text-xs font-semibold ${
                      changeValue > 0
                        ? 'text-green-400'
                        : changeValue < 0
                        ? 'text-red-600'
                        : isDarkMode
                        ? 'text-zinc-300'
                        : 'text-gray-700'
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                  <div className={`text-lg font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {metric.value}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---------------- Top Gainers ---------------- */}
        {isLoading ? (
          <SkeletonLoader rows={3} height="h-12" />
        ) : (
          <div
            className={`${
              isDarkMode
                ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700'
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            } rounded-xl p-4 border shadow-lg`}
          >
            <h3 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <TrendingUp size={16} className="text-green-400" />
              {t('topGainers24h')}
            </h3>
            <div className="space-y-2">
              {topGainers.map((coin, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'} transition-all cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg">
                      {coin.icon}
                    </div>
                    <div>
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {coin.name}
                      </span>
                      <div className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>
                        {coin.price}
                      </div>
                    </div>
                  </div>
                  <span className={`${
                    parseFloat(coin.change) > 0
                      ? 'text-green-400'
                      : parseFloat(coin.change) < 0
                      ? 'text-red-600'
                      : 'text-gray-400'
                  } text-sm font-semibold`}>
                    {parseFloat(coin.change).toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
