import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Bell, ChevronRight, Activity, Flame, Target } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('home');

  const demoCoins = [
    { name: 'KAS', icon: '◆', cqs: 72, ts: 85, ci: 85, ri: 55, trend: 'up', price: '$0.1523', change: '+12.4%', narrative: 'PoW' },
    { name: 'ETH', icon: '◈', cqs: 85, ts: 78, ci: 82, ri: 45, trend: 'up', price: '$2,340', change: '+8.2%', narrative: 'L1' },
    { name: 'BTC', icon: '₿', cqs: 92, ts: 75, ci: 80, ri: 42, trend: 'up', price: '$45,230', change: '+5.1%', narrative: 'Store' },
    { name: 'QUBIC', icon: '◇', cqs: 55, ts: 70, ci: 75, ri: 70, trend: 'up', price: '$0.0034', change: '+25.6%', narrative: 'AI' },
    { name: 'LINK', icon: '⬡', cqs: 78, ts: 68, ci: 72, ri: 58, trend: 'down', price: '$14.82', change: '-3.2%', narrative: 'Oracle' },
  ];

  const moonshotCoins = [
    { name: 'MATIC', score: 78, potential: '10-20x', narrative: 'L2 Scaling' },
    { name: 'UNI', score: 72, potential: '5-15x', narrative: 'DeFi 2.0' },
    { name: 'ARB', score: 68, potential: '8-18x', narrative: 'L2 Rollup' },
  ];

  const newsItems = [
    { title: 'Bitcoin price surpasses $60K, gains 5% in 24hrs', time: '2h ago', type: 'bullish' },
    { title: 'Ethereum reaches new ATH for 2024', time: '4h ago', type: 'bullish' },
    { title: 'SEC announces new crypto regulations', time: '6h ago', type: 'neutral' },
  ];

  const alerts = [
    { coin: 'KAS', type: 'buy', message: 'Strong entry signal detected', severity: 'high' },
    { coin: 'ETH', type: 'news', message: 'Major upgrade announcement', severity: 'medium' },
    { coin: 'QUBIC', type: 'meme', message: 'Viral trend detected', severity: 'high' },
  ];

  const ScoreCard = ({ title, value, max = 100, color, details }) => {
    const percentage = (value / max) * 100;
    const getColor = () => {
      if (color) return color;
      if (value >= 70) return 'bg-green-500';
      if (value >= 50) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 hover:border-orange-500 transition-all">
        <div className="text-zinc-400 text-sm mb-2">{title}</div>
        <div className="text-4xl font-bold text-white mb-4">{value}</div>
        <div className="w-full bg-zinc-700 rounded-full h-2 mb-3">
          <div 
            className={`${getColor()} h-2 rounded-full transition-all`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <button className="text-orange-400 text-sm hover:text-orange-300 flex items-center gap-1">
          Details <ChevronRight size={14} />
        </button>
      </div>
    );
  };

  const CoinRow = ({ coin }) => (
    <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-orange-500 transition-all mb-2">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
          {coin.icon}
        </div>
        <div>
          <div className="text-white font-semibold">{coin.name}</div>
          <div className="text-zinc-400 text-xs">{coin.narrative}</div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-white">{coin.price}</div>
          <div className={`text-sm ${coin.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
            {coin.change}
          </div>
        </div>
        <div className="flex gap-2">
          <div className="bg-zinc-700 rounded px-2 py-1 text-xs text-zinc-300">CQS: {coin.cqs}</div>
          <div className="bg-zinc-700 rounded px-2 py-1 text-xs text-zinc-300">TS: {coin.ts}</div>
          <div className="bg-zinc-700 rounded px-2 py-1 text-xs text-zinc-300">CI: {coin.ci}</div>
        </div>
        {coin.trend === 'up' ? 
          <TrendingUp className="text-green-400" size={20} /> : 
          <TrendingDown className="text-red-400" size={20} />
        }
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Crypto Investment Dashboard
            </h1>
            <p className="text-zinc-400 mt-1">May 14, 2024 13:45</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-sm">Early Bear</span>
            </div>
            <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold transition-all">
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-8 bg-zinc-800 p-1 rounded-xl border border-zinc-700">
          {['Home', 'Hot Coins', 'Moonshot', 'Portfolio', 'Alerts'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.toLowerCase().replace(' ', '-')
                  ? 'bg-orange-500 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ScoreCard title="Coin Quality Score" value={72} />
          <ScoreCard title="Timing Score" value={85} />
          <ScoreCard title="Chance Index" value={85} />
          <ScoreCard title="Risk Index" value={55} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Hot Coins */}
          <div className="lg:col-span-2 bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Flame className="text-orange-500" />
                Hot Coins
              </h2>
              <button className="text-orange-400 hover:text-orange-300 text-sm">View All</button>
            </div>
            <div>
              {demoCoins.map((coin, idx) => (
                <CoinRow key={idx} coin={coin} />
              ))}
            </div>
          </div>

          {/* Moonshot Section */}
          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Target className="text-orange-500" />
              Moonshot
            </h2>
            <div className="space-y-4">
              {moonshotCoins.map((coin, idx) => (
                <div key={idx} className="bg-zinc-900 rounded-lg p-4 border border-zinc-700 hover:border-orange-500 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-white">{coin.name}</div>
                    <div className="text-green-400 text-sm font-bold">{coin.potential}</div>
                  </div>
                  <div className="text-xs text-zinc-400 mb-3">{coin.narrative}</div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full"
                      style={{ width: `${coin.score}%` }}
                    />
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">Score: {coin.score}/100</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Cycle & News */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Cycle */}
          <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Activity className="text-orange-500" />
              Market Cycle
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                {['BTC', 'ETH', 'SOL', 'KAS', 'S&P 500'].map(asset => (
                  <button key={asset} className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-sm transition-all">
                    {asset}
                  </button>
                ))}
              </div>
              <div className="h-48 bg-zinc-900 rounded-lg p-4 border border-zinc-700">
                <svg className="w-full h-full" viewBox="0 0 400 150">
                  <path d="M 0 120 Q 50 100 100 80 T 200 60 T 300 80 T 400 100" 
                        stroke="#f97316" strokeWidth="2" fill="none" />
                  <path d="M 0 100 Q 50 90 100 70 T 200 50 T 300 70 T 400 90" 
                        stroke="#3b82f6" strokeWidth="2" fill="none" />
                  <path d="M 0 110 Q 50 95 100 75 T 200 55 T 300 75 T 400 95" 
                        stroke="#eab308" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Early Bull</span>
                <span>Mid Bull</span>
                <span>Late Bull</span>
                <span className="text-orange-400 font-bold">Early Bear</span>
              </div>
            </div>
          </div>

          {/* News & Alerts */}
          <div className="space-y-6">
            <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="text-orange-500" />
                Alerts
              </h2>
              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-orange-400 font-semibold">{alert.coin}</span>
                        <span className="text-xs text-zinc-500">{alert.type}</span>
                      </div>
                      <div className="text-sm text-zinc-300">{alert.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
              <h2 className="text-xl font-bold mb-6">Latest News</h2>
              <div className="space-y-3">
                {newsItems.map((news, idx) => (
                  <div key={idx} className="p-3 bg-zinc-900 rounded-lg border border-zinc-700 hover:border-orange-500 transition-all cursor-pointer">
                    <div className="text-sm text-white mb-1">{news.title}</div>
                    <div className="text-xs text-zinc-500">{news.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;