import React from 'react'
import ScoreGauge from './scoreGauge'
import { TrendingUp, TrendingDown, AlertCircle, Bell, ChevronRight, Activity, Flame, Target, Clock, Zap, DollarSign, BarChart3, Award, TrendingUp as TrendUp, Calendar, Users, GitBranch, Radio, Moon, Sun, Sparkles } from 'lucide-react';
import MoonshotFactorMini from './Moonshot';
import CryptoNews from './CryptoNews'
const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "N/A";
  const absNum = Math.abs(num);

  if (absNum >= 1.0e9) {
    return (num / 1.0e9).toFixed(2).replace(/\.00$/, "") + "B";
  } else if (absNum >= 1.0e6) {
    return (num / 1.0e6).toFixed(2).replace(/\.00$/, "") + "M";
  } else if (absNum >= 1.0e3) {
    return (num / 1.0e3).toFixed(2).replace(/\.00$/, "") + "K";
  } else {
    return num.toString();
  }
};

const RightSide = ({ isDarkMode, selectedCoin }) => {


  return (
    <div className={`w-96 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'} border-l overflow-y-auto custom-scrollbar`}>
      <div className="p-4 space-y-4">
        {/* Selected Coin Detail */}
        <div className={` items-center ${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-4 border shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-fit h-fit rounded-full  flex items-center justify-center text-white font-bold text-xl shadow-lg ">
                <span>{selectedCoin?.icon}</span>
              </div>
              <div>
                <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCoin?.name}</div>
                <div className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{selectedCoin?.symbol}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedCoin?.price}</div>
              <div className={`${selectedCoin?.change >= 0 ? 'text-green-400' : 'text-red-400'} text-sm font-semibold`}>{selectedCoin?.change}</div>
            </div>
          </div>

          {/* <div className="grid grid-cols-2 gap-3 mb-4">
                <ScoreGauge isDarkMode={isDarkMode} value={72} label="CQS" size="sm" />
                <ScoreGauge isDarkMode={isDarkMode} value={85} label="TS" size="sm" />
                <ScoreGauge isDarkMode={isDarkMode} value={85} label="CI" size="sm" />
                <ScoreGauge isDarkMode={isDarkMode} value={55} label="RI" size="sm" />
              </div> */}

          <div className="space-y-2 mb-4">
            {[
              { label: "Market Cap", value: formatNumber(selectedCoin?.mcap) },
              { label: "24h Volume", value: formatNumber(selectedCoin?.volume) },

            ].map((item, idx) => (
              <div key={idx} className={`flex justify-between items-center text-sm p-2 rounded-lg ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-gray-100'} transition-all`}>
                <span className={isDarkMode ? 'text-zinc-400' : 'text-gray-600'}>{item.label}</span>
                <span className={`font-semibold items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className={`${isDarkMode ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'} rounded-lg p-3 border mb-4 shadow-md`}>
            <div className={`text-xs mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>Entry Recommendation</div>
            <div className="text-green-400 font-semibold mb-2 flex items-center gap-2">
              <Sparkles size={14} />
              Staggered Buy-Fear Entry
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>Position: 30-50%</div>
            <div className={`text-xs mt-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>Strong fundamentals + favorable timing</div>
          </div>

          <button className="w-full bg-[#d0b345] hover:from-orange-600 hover:to-yellow-900 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105">
            Add to Portfolio
          </button>
        </div>

        {/* Market Cycle Chart */}
        {/* <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-4 border shadow-lg`}>
              <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Activity className="text-yellow-500" size={18} />
                Market Cycle Position
              </h3>
              <div className={`h-48 ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'} rounded-lg p-4 border ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'} mb-3`}>
                <svg className="w-full h-full" viewBox="0 0 400 150">
                  <defs>
                    <linearGradient id="btcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="75" x2="400" y2="75" stroke={isDarkMode ? "#3f3f46" : "#e5e7eb"} strokeWidth="1" strokeDasharray="4" />
                  <path d="M 0 120 Q 50 100 100 80 Q 150 60 200 50 Q 250 55 300 75 Q 350 95 400 100" 
                        stroke="url(#btcGradient)" strokeWidth="3" fill="none" />
                  <path d="M 0 100 Q 50 85 100 70 Q 150 52 200 45 Q 250 50 300 70 Q 350 88 400 95" 
                        stroke="#3b82f6" strokeWidth="2.5" fill="none" opacity="0.7" />
                  <path d="M 0 110 Q 50 92 100 75 Q 150 58 200 48 Q 250 53 300 72 Q 350 90 400 97" 
                        stroke="#8b5cf6" strokeWidth="2.5" fill="none" opacity="0.7" />
                  <circle cx="300" cy="75" r="6" fill="#f97316" />
                  <circle cx="300" cy="75" r="10" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.5">
                    <animate attributeName="r" from="10" to="15" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
              <div className={`flex justify-between text-xs mb-3 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
                <span>Early Bull</span>
                <span>Mid Bull</span>
                <span>Late Bull</span>
                <span className="font-semibold bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">Bear</span>
              </div>
              <div className="flex gap-3 text-xs">
                {[
                  { label: 'BTC', color: 'from-orange-500 to-pink-500' },
                  { label: 'ETH', color: 'from-blue-500 to-blue-600' },
                  { label: 'SOL', color: 'from-purple-500 to-purple-600' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <div className={`w-4 h-1 bg-gradient-to-r ${item.color} rounded-full`}></div>
                    <span className={isDarkMode ? 'text-zinc-400' : 'text-gray-600'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div> */}
        <MoonshotFactorMini />

        {/* Alerts */}
        <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-4 border shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              <Bell className="text-[#d0b345]" size={18} />
              Active Alerts
            </h3>
            <span className="bg-gradient-to-r from-red-400 to-red-400 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">3</span>
          </div>
          <div className="space-y-2">
            {[
              { coin: 'KAS', time: '2m ago', msg: 'Strong entry signal detected', detail: 'CI: 85 | TS: 85 | Buy Zone Active', color: 'yellow' },
              { coin: 'ETH', time: '15m ago', msg: 'Major upgrade announcement', detail: 'Community Score +45% in 24h', color: 'yellow' },
              { coin: 'QUBIC', time: '1h ago', msg: 'Viral trend detected - Moonshot alert', detail: 'Moonshot Factor: 85 | High Risk', color: 'yellow' }
            ].map((alert, idx) => (
              <div key={idx} className={`${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'} rounded-lg p-3 border-l-4 border-${alert.color}-500 hover:scale-105 transition-all cursor-pointer shadow-md`}>
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-semibold bg-[#d0b345] bg-clip-text text-transparent">{alert.coin}</span>
                  <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{alert.time}</span>
                </div>
                <div className={`text-xs mb-1 ${isDarkMode ? 'text-zinc-300' : 'text-gray-700'}`}>{alert.msg}</div>
                <div className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{alert.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest News */}
        {/* <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-4 border shadow-lg`}>
              <h3 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Latest News</h3>
              <div className="space-y-3">
                {[
                  { text: 'Bitcoin price surpasses $60K, gains 5% in 24hrs', time: '2 hours ago', color: 'green' },
                  { text: 'Ethereum reaches new ATH for 2024', time: '4 hours ago', color: 'green' },
                  { text: 'SEC announces new crypto regulations framework', time: '6 hours ago', color: 'yellow' },
                  { text: 'DeFi TVL crosses $100B milestone', time: '8 hours ago', color: 'blue' }
                ].map((news, idx) => (
                  <div key={idx} className={`pb-3 ${idx < 3 ? (isDarkMode ? 'border-zinc-700' : 'border-gray-200') : ''} ${idx < 3 ? 'border-b' : ''} hover:scale-105 transition-all cursor-pointer`}>
                    <div className="flex items-start gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full bg-${news.color}-500 mt-1.5 shadow-lg shadow-${news.color}-500/50`}></div>
                      <div className="flex-1">
                        <div className={`text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{news.text}</div>
                        <div className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{news.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
        <CryptoNews isDarkMode={isDarkMode} />

        {/* Developer Activity */}
        <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-4 border shadow-lg`}>
          <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <GitBranch className="text-[#d0b345]" size={18} />
            Dev Activity (30d)
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Commits', value: 342, percent: 85, color: 'from-green-500 to-emerald-600' },
              { label: 'Contributors', value: 28, percent: 70, color: 'from-blue-500 to-cyan-600' },
              { label: 'Stars', value: '12.4K', percent: 92, color: 'bg-[#d0b345]' }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{item.label}</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
                </div>
                <div className={`w-full ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-200'} rounded-full h-2 overflow-hidden`}>
                  <div className={`bg-gradient-to-r ${item.color} h-2 rounded-full shadow-lg transition-all duration-1000`} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Metrics */}
        <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-4 border shadow-lg`}>
          <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Users className="text-[#d0b345]" size={18} />
            Social Metrics (7d)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { platform: 'Twitter', count: '45.2K', change: '+12.4%', positive: true },
              { platform: 'Reddit', count: '23.8K', change: '+8.7%', positive: true },
              { platform: 'Telegram', count: '67.3K', change: '-2.1%', positive: false },
              { platform: 'Discord', count: '34.1K', change: '+5.3%', positive: true }
            ].map((social, idx) => (
              <div key={idx} className={`${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'} rounded-lg p-3 hover:scale-105 transition-all cursor-pointer shadow-md`}>
                <div className={`text-xs mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{social.platform}</div>
                <div className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{social.count}</div>
                <div className={`text-xs font-semibold ${social.positive ? 'text-green-400' : 'text-red-400'}`}>{social.change}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Volume Chart */}
        <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-4 border shadow-lg`}>
          <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <BarChart3 className="text-[#d0b345]" size={18} />
            Volume Trend (7d)
          </h3>
          <div className="flex items-end justify-between h-32 gap-2">
            {[65, 78, 55, 82, 91, 73, 88].map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full bg-gradient-to-t from-orange-500 via-pink-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80 cursor-pointer shadow-lg`}
                  style={{ height: `${height}%` }}
                ></div>
                <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-gray-500'}`}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Alerts Setup */}
        <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} rounded-xl p-4 border shadow-lg`}>
          <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Target className="text-[#d0b345]" size={18} />
            Quick Alert Setup
          </h3>
          <div className="space-y-3">
            <div>
              <label className={`text-xs mb-1 block ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>Target Price</label>
              <input
                type="text"
                placeholder="$0.20"
                className={`w-full px-3 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-orange-500`}
              />
            </div>
            <div className="flex gap-2">
              <button className={`flex-1 px-3 py-2 ${isDarkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg text-xs font-semibold transition-all`}>
                Above
              </button>
              <button className={`flex-1 px-3 py-2 ${isDarkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-gray-100 hover:bg-gray-200'} rounded-lg text-xs font-semibold transition-all`}>
                Below
              </button>
            </div>
            <button className="w-full bg-[#d0b345] py-2 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105">
              Set Alert
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightSide