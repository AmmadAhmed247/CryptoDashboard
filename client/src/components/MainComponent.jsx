import React from 'react'
import { TrendingUp, TrendingDown, AlertCircle, Bell, ChevronRight, Activity, Flame, Target, Clock, Zap, DollarSign, BarChart3, Award, Calendar, Users, GitBranch, Radio, Moon, Sun, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import CoinRow from './PriceAction';

function getColor(value) {
  return value < 50 ? 'bg-red-800' : 'bg-green-700';
}

const MainContent = ({ isDarkMode, demoCoins, narrativeTrends, ScoreCard, onSelectCoin, selectedCoins, onAddToAnalysis, onClearAnalysis }) => {

  const [coins, setCoins] = React.useState(demoCoins);
  const prevCoinsRef = React.useRef(demoCoins);

  // Detect when demoCoins prop changes and mark which coins changed
  React.useEffect(() => {
    const prevCoins = prevCoinsRef.current;
    
    const updatedCoins = demoCoins.map((coin, idx) => {
      const prevCoin = prevCoins[idx];
      
      if (prevCoin && prevCoin.price !== coin.price) {
        const oldPrice = parseFloat(prevCoin.price.replace(/[$,]/g, ''));
        const newPrice = parseFloat(coin.price.replace(/[$,]/g, ''));
        const isUp = newPrice > oldPrice;
        
        return {
          ...coin,
          priceChanged: true,
          priceDirection: isUp ? "up" : "down"
        };
      }
      
      return coin;
    });
    
    setCoins(updatedCoins);
    prevCoinsRef.current = demoCoins;
    
    // Reset glow after 500ms
    const timeout = setTimeout(() => {
      setCoins(demoCoins.map(coin => ({
        ...coin,
        priceChanged: false
      })));
    }, 500);
    
    return () => clearTimeout(timeout);
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
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="p-6 space-y-2">
        {selectedCoins.length > 0 && (
          <div className="flex justify-end w-full">
            <button
              onClick={onClearAnalysis}
              className="px-3 py-1 bg-red-800 text-white text-xs rounded-lg hover:bg-red-900 transition"
            >
              Clear Analysis
            </button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {(aggregatedScores
            ? [
              { label: "CQS", value: aggregatedScores.cqs, icon: Activity, status: "Composite Quality Score" },
              { label: "TS", value: aggregatedScores.ts, icon: Target, status: "Technical Strength" },
              { label: "CI", value: aggregatedScores.ci, icon: Award, status: "Confidence Index" },
              { label: "RI", value: aggregatedScores.ri, icon: Flame, status: "Risk Index" },
            ]
            : ScoreCard
          ).map((card, idx) => (
            <div key={idx}
              className={`${isDarkMode
                ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700'
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
                } rounded-xl p-6 border shadow-lg hover:shadow-2xl transition-all hover:scale-105 group`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className={`text-sm mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{card.label}</div>
                  <div className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{card.value}</div>
                </div>
                <div className="p-2 bg-zinc-800 border-2 border-[#d0b345] rounded-xl shadow-lg group-hover:scale-110 transition-all hidden md:block">
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

        <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-6 border shadow-lg`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Radio className="text-yellow-400" />
              Narrative Trends
            </h2>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {narrativeTrends.map((narrative, idx) => (
              <div key={idx} className={`${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-gray-50 border-gray-200'} rounded-xl p-4 border shadow-md hover:shadow-xl transition-all hover:scale-105 group cursor-pointer`}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${narrative.color} flex items-center justify-center mb-3 shadow-lg group-hover:rotate-12 transition-all`}>
                  <span className="text-2xl font-bold text-white">{narrative.score}</span>
                </div>
                <div className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{narrative.name}</div>
                <div className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{narrative.coins} coins</div>
                <div className="flex items-center gap-1 mt-2">
                  {narrative.trend === 'up' ? (
                    <TrendingUp size={14} className="text-green-400" />
                  ) : (
                    <TrendingDown size={14} className="text-red-400" />
                  )}
                  <span className={`text-xs font-semibold ${narrative.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    Trending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-6 border shadow-lg`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Flame className="text-[#d0b345]" />
              Hot Coins
            </h2>
            <div className="flex gap-2">
              {['All', 'High CI', 'Low Risk'].map(filter => (
                <button key={filter} className={`px-4 py-2 ${isDarkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg text-sm transition-all hover:scale-105 shadow-md font-semibold`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="border-zinc-700 border-b">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-zinc-400">Coin</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">Price</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">24h</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">Volume</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">CQS</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">TS</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">CI</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">RI</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">Moonshot</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">Action</th>
                  <th className="text-middle w-12 py-3 px-4 text-sm font-semibold text-zinc-400">Add To Analysis</th>
                </tr>
              </thead>
              <tbody>
                {coins.map((coin, idx) => (
                  <tr
                    key={idx}
                    className={`${isDarkMode
                      ? "border-zinc-700 hover:bg-zinc-700/50"
                      : "border-gray-200 hover:bg-gray-100"
                      } border-b text-left transition-all cursor-pointer group`}
                    onClick={() => onSelectCoin(coin)}
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

                    <td className="text-right py-4 px-4">
                      <span
                        className={`font-semibold transition-all duration-300 inline-block ${
                          coin.priceChanged && coin.priceDirection === 'up'
                            ? "!text-green-500 drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]"
                            : coin.priceChanged && coin.priceDirection === 'down'
                              ? "!text-red-500 drop-shadow-[0_0_12px_rgba(248,113,113,0.8)]"
                              : isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {coin.price}
                      </span>
                    </td>

                    <td className="text-right py-4 px-4">
                      <span
                        className={`${parseFloat(coin.change) >= 0 ? "text-green-400" : "text-red-400"} font-semibold transition-all duration-300 ${
                          coin.priceChanged && coin.priceDirection === 'up'
                            ? "drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]"
                            : coin.priceChanged && coin.priceDirection === 'down'
                              ? "drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]"
                              : ""
                        }`}
                      >
                        {coin.change}
                      </span>
                    </td>

                    <td className={`text-right py-4 px-4 ${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}>
                      {coin.volume}
                    </td>

                    {["cqs", "ts", "ci", "ri"].map((metric, i) => {
                      const value = Number(coin[metric] ?? 0);
                      return (
                        <td key={i} className="text-right py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-semibold shadow-md ${metric === "ri"
                              ? value < 50
                                ? "bg-green-500/20 text-green-400"
                                : value < 75
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                              : value >= 70
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                              }`}
                          >
                            {value?.toFixed(0) || 0}
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

                    <td className="text-right py-4 px-4">
                      <button className="px-4 font-semibold py-2 bg-[#d0b345] rounded-lg text-xs transition-all shadow-lg hover:shadow-xl hover:scale-110">
                        Entry
                      </button>
                    </td>
                    <td className="text-right py-4 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToAnalysis(coin);
                        }}
                        className="px-4 py-2 bg-[#d0b345] rounded-lg text-xs font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-110"
                      >
                        Add to Analysis
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContent