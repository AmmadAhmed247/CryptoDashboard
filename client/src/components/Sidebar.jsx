import React from 'react';
import FearGreedGauge from './fearAndreed';
const Sidebar = ({
  fearGreedIndex,
  bitcoinHalving,
  altSeasonIndex,
  marketMetrics,
  topGainers,
  narrativeTrends,
  FearGreedGauge
}) => (
  <div className="w-80 bg-zinc-900 border-r border-zinc-800 overflow-y-auto">
    <div className="p-4 space-y-4">
      {/* Fear & Greed */}
      <FearGreedGauge value={fearGreedIndex} />
      {/* Bitcoin Halving */}
      <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
        <div className="flex items-center gap-2 mb-3">
          <span role="img" aria-label="clock">⏰</span>
          <h3 className="text-sm font-semibold">Bitcoin Halving</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 text-xs">Days Remaining</span>
            <span className="text-2xl font-bold text-orange-400">{bitcoinHalving.days}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Blocks</span>
            <span className="text-zinc-300">{bitcoinHalving.blocks.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Est. Date</span>
            <span className="text-zinc-300">{bitcoinHalving.date}</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-2 mt-3">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>
      </div>
      {/* Alt Season Index */}
      <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
        <div className="flex items-center gap-2 mb-3">
          <span role="img" aria-label="zap">⚡</span>
          <h3 className="text-sm font-semibold">Alt Season Index</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-yellow-400">{altSeasonIndex}</div>
            <div className="text-xs text-zinc-400 mt-1">Bitcoin Season</div>
            <div className="text-xs text-zinc-500 mt-2">Alt season at 75+</div>
          </div>
          <div className="relative w-20 h-20">
            {/* SVG chart omitted for brevity */}
          </div>
        </div>
      </div>
      {/* Market Metrics */}
      <div className="space-y-2">
        {marketMetrics.map((metric, idx) => (
          <div key={idx} className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Icon placeholder */}
                <span role="img" aria-label="icon">💹</span>
                <span className="text-xs text-zinc-400">{metric.label}</span>
              </div>
              <span className={`text-xs ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change}
              </span>
            </div>
            <div className="text-lg font-bold mt-1">{metric.value}</div>
          </div>
        ))}
      </div>
      {/* Top Gainers/Losers */}
      <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
        <h3 className="text-sm font-semibold mb-3">Top Gainers 24h</h3>
        <div className="space-y-2">
          {topGainers.map((coin, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-xs">
                  {coin.icon}
                </div>
                <span className="text-sm">{coin.name}</span>
              </div>
              <span className="text-green-400 text-sm font-semibold">{coin.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Sidebar;
