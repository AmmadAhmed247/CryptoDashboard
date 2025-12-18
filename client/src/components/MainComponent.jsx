import React from 'react';
import { TrendingUp, TrendingDown, Activity, Flame, Target, Award, Zap, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import CryptoMarketCycle from './bitcoinCycle';
import Liveliquidation from "./LiveLiquidation.jsx";
import SkeletonLoader from './Skeleton.jsx';
import { useTheme } from "../context/ThemeContext.jsx";
import { useTranslation } from 'react-i18next';

function getColor(value) {
  return value < 50 ? 'bg-red-800' : 'bg-green-700';
}

const MainContent = ({ demoCoins, narrativeTrends, ScoreCard, onSelectCoin, selectedCoins, onAddToAnalysis, onClearAnalysis }) => {
  const { isDarkMode } = useTheme();
  const [loading, setLoading] = React.useState(true);
  const { t } = useTranslation();

  // Track previous raw prices for accurate change detection
  const prevRawPricesRef = React.useRef({});

  const [coins, setCoins] = React.useState([]);

  React.useEffect(() => {
    if (!demoCoins || demoCoins.length === 0) {
      setLoading(true);
      return;
    }

    const currentRawPrices = {};
    const updatedCoins = demoCoins.map(coin => {
      const id = coin.id || coin.symbol;
      const rawPrice = parseFloat(coin.price.replace(/[$,]/g, '')); // raw numeric price
      currentRawPrices[id] = rawPrice;

      const prevRawPrice = prevRawPricesRef.current[id];
      let priceChanged = false;
      let priceDirection = null;

      if (prevRawPrice !== undefined && prevRawPrice !== rawPrice) {
        priceChanged = true;
        priceDirection = rawPrice > prevRawPrice ? 'up' : 'down';
      }

      return {
        ...coin,
        priceChanged,
        priceDirection,
      };
    });

    // Sort by average (as before)
    const sortedCoins = [...updatedCoins].sort((a, b) => b.average - a.average);

    setCoins(sortedCoins);
    prevRawPricesRef.current = currentRawPrices;

    // Clear flash after 1100ms
    const timer = setTimeout(() => {
      setCoins(prev => prev.map(c => ({ ...c, priceChanged: false })));
    }, 1100);

    // Stop loading
    setLoading(false);

    return () => clearTimeout(timer);
  }, [demoCoins]);

  const aggregatedScores = React.useMemo(() => {
    if (selectedCoins.length === 0) return null;

    const total = selectedCoins.reduce(
      (acc, c) => ({
        cqs: acc.cqs + (Number(c.cqs) || 0),
        ts: acc.ts + (Number(c.ts) || 0),
        ci: acc.ci + (Number(c.ci) || 0),
        ri: acc.ri + (Number(c.ri) || 0),
      }),
      { cqs: 0, ts: 0, ci: 0, ri: 0 }
    );

    const count = selectedCoins.length;
    return {
      cqs: (total.cqs / count).toFixed(0),
      ts: (total.ts / count).toFixed(0),
      ci: (total.ci / count).toFixed(0),
      ri: (total.ri / count).toFixed(0),
    };
  }, [selectedCoins]);

  return (
    <div className={`flex-1 overflow-y-auto custom-scrollbar ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}>
      <div className="p-6 space-y-2">
        {/* Score Cards - Always show single coin (selectedCoin) or fallback to ScoreCard */}
{loading && coins.length === 0 ? (
  <SkeletonLoader rows={1} height="h-32" />
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {/* Use ScoreCard from CryptoDashboard if no selectedCoins, otherwise use last selected coin */}
    {(selectedCoins.length > 0 
      ? [
          {
            label: "CQS",
            value: Number(selectedCoins[selectedCoins.length - 1].cqs || 0).toFixed(0),
            icon: Activity,
            status: "Composite Quality Score"
          },
          {
            label: "TS",
            value: Number(selectedCoins[selectedCoins.length - 1].ts || 0).toFixed(0),
            icon: Target,
            status: "Technical Strength"
          },
          {
            label: "CI",
            value: Number(selectedCoins[selectedCoins.length - 1].ci || 0).toFixed(0),
            icon: Award,
            status: "Confidence Index"
          },
          {
            label: "RI",
            value: Number(selectedCoins[selectedCoins.length - 1].ri || 0).toFixed(0),
            icon: Flame,
            status: "Risk Index"
          },
        ]
      : ScoreCard
    ).map((card, idx) => (
      <div
        key={idx}
        className={`${isDarkMode
          ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700'
          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
          } rounded-xl p-6 border shadow-lg hover:shadow-2xl transition-all hover:scale-105 group`}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className={`text-sm mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              {t(card.label)}
            </div>
            <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{card.value}</div>
          </div>
          <div className={`p-2 ${isDarkMode ? "bg-zinc-800" : "bg-white"} border-2 border-[#d0b345] rounded-xl shadow-lg group-hover:scale-110 transition-all hidden md:block`}>
            <card.icon size={22} className="text-[#d0b345]" />
          </div>
        </div>
        <div className={`w-full ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-200'} rounded-full h-2 mb-2 overflow-hidden`}>
          <div
            className={`bg-gradient-to-r ${getColor(card.value)} h-2 rounded-full shadow-lg transition-all duration-1000`}
            style={{ width: `${card.value}%` }}
          ></div>
        </div>
        <div className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{card.status}</div>
      </div>
    ))}
  </div>
)}

        <div className="flex flex-col md:flex-row w-full gap-2 rounded-3xl items-stretch">
          <div className="hidden [@media(min-width:1660px)]:block flex-[0.3]">
            {loading ? <SkeletonLoader rows={1} height="h-64" /> : <Liveliquidation />}
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {loading ? <SkeletonLoader rows={1} height="h-64" /> : <CryptoMarketCycle />}
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-6 border shadow-lg`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Flame className="text-[#d0b345]" />
              {t("Hot Coins")}
            </h2>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            {loading ? (
              <SkeletonLoader rows={10} height="h-8" />
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-zinc-700 border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">{t('topCoins')}</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">{t('price')}</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">{t('change24h')}</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">{t('volume24h')}</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">{t('CQS')}</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">{t('TS')}</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">{t('CI')}</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">{t('RI')}</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">{t('CMS')}</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">{t('moonshot')}</th>
                    <th className="text-middle w-12 py-3 px-4 text-sm font-semibold text-zinc-400">{t('Analyse')}</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.slice(0, 10).map((coin) => {
                    const isUp = coin.priceChanged && coin.priceDirection === 'up';
                    const isDown = coin.priceChanged && coin.priceDirection === 'down';

                    return (
                      <tr
                        key={coin.id || coin.symbol}
                        className={`${isDarkMode
                          ? "border-zinc-700 hover:bg-zinc-700/50"
                          : "border-gray-200 hover:bg-gray-100"
                          } border-b text-left transition-all cursor-pointer group`}
                        onClick={() => {
                          // Only update selectedCoin if not in analysis mode
                          if (selectedCoins.length === 0) {
                            onSelectCoin(coin);
                          }
                        }}
                      >
                        <td className="py-4 px-4">
                          <Link
                            to={`https://coinmarketcap.com/currencies/${coin.id || coin.name.toLowerCase().replace(/\s+/g, "-")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-all">
                              {coin.icon}
                            </div>
                            <div>
                              <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                {coin.name}
                              </div>
                              <div className={`text-xs ${isDarkMode ? "text-zinc-500" : "text-gray-500"}`}>
                                {coin.narrative}
                              </div>
                            </div>
                          </Link>
                        </td>

                        {/* Price - glowing flash */}
                        <td className="text-right py-4 px-4">
                          <span
                            className={`font-semibold transition-all duration-300 inline-block ${
                              isUp
                                ? "!text-green-500 drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]"
                                : isDown
                                  ? "!text-red-700 drop-shadow-[0_0_12px_rgba(248,113,113,0.8)]"
                                  : isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {coin.price}
                          </span>
                        </td>

                        {/* 24h Change - subtle glow */}
                        <td className="text-right py-4 px-4">
                          <span
                            className={`font-semibold transition-all duration-300 ${
                              parseFloat(coin.change) >= 0 ? "text-green-400" : "text-red-600"
                            } ${
                              isUp
                                ? "drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]"
                                : isDown
                                  ? "drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]"
                                  : ""
                            }`}
                          >
                            {coin.change}
                          </span>
                        </td>

                        {/* Volume - subtle flash */}
                        <td className={`text-right py-4 px-4 transition-all duration-300 ${isDarkMode ? "text-zinc-400" : "text-gray-600"} ${
                          isUp ? "!text-green-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.5)]" :
                          isDown ? "!text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.5)]" : ""
                        }`}>
                          {coin.volume}
                        </td>

                        {["cqs", "ts", "ci", "ri", "cms"].map((metric, i) => {
                          const value = Number(coin[metric] ?? 0);
                          const getColorClass = () => {
                            if (metric === "ri") {
                              return value < 50 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400";
                            }
                            return value >= 50 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400";
                          };
                          return (
                            <td key={i} className="text-right py-4 px-4">
                              <span className={`px-2 py-1 rounded-lg text-xs font-semibold shadow-md ${getColorClass()}`}>
                                {value.toFixed(0)}
                              </span>
                            </td>
                          );
                        })}

                        <td className="text-right py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <div className={`w-16 ${isDarkMode ? "bg-zinc-700" : "bg-gray-200"} rounded-full h-2 overflow-hidden`}>
                              <div
                                className="bg-[#d0b345] h-2 rounded-full shadow-md"
                                style={{ width: `${coin.moonshot}%` }}
                              ></div>
                            </div>
                            <span className="text-xs bg-[#d0b345] bg-clip-text text-transparent font-bold">
                              {coin.moonshot?.toFixed(0) || 0}
                            </span>
                          </div>
                        </td>

                        <td className="py-4 px-4 flex justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToAnalysis(coin);
                            }}
                            className="p-2 bg-[#d0b345] rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-110 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;