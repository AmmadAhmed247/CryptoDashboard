import React, { useState } from 'react'
import { Flame, Target, Award, Sparkles,Trash2 } from 'lucide-react';

const HotCoins = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [portfolio, setPortfolio] = useState([]);
    
    
    const addToPortfolio = (coin) => {
      if (!portfolio.find(c => c.name === coin.name)) {
        setPortfolio([...portfolio, coin]);
      }
    };
    
    const removeFromPortfolio = (coinName) => {
      setPortfolio(portfolio.filter(c => c.name !== coinName));
    };
    
    const demoCoins = [
    { name: 'KAS', icon: '◆', cqs: 72, ts: 85, ci: 85, ri: 55, price: '$0.1523', change: '+12.4%', narrative: 'PoW', volume: '$45.2M', moonshot: 78 },
    { name: 'ETH', icon: '◈', cqs: 85, ts: 78, ci: 82, ri: 45, price: '$2,340', change: '+8.2%', narrative: 'L1', volume: '$2.1B', moonshot: 62 },
    { name: 'BTC', icon: '₿', cqs: 92, ts: 75, ci: 80, ri: 42, price: '$45,230', change: '+5.1%', narrative: 'Store', volume: '$8.4B', moonshot: 45 },
    { name: 'QUBIC', icon: '◇', cqs: 55, ts: 70, ci: 75, ri: 70, price: '$0.0034', change: '+25.6%', narrative: 'AI', volume: '$12.8M', moonshot: 85 },
    { name: 'LINK', icon: '⬡', cqs: 78, ts: 68, ci: 72, ri: 58, price: '$14.82', change: '-3.2%', narrative: 'Oracle', volume: '$120M', moonshot: 68 },
    { name: 'SOL', icon: '◐', cqs: 80, ts: 82, ci: 83, ri: 48, price: '$98.45', change: '+15.3%', narrative: 'L1', volume: '$890M', moonshot: 71 },
    { name: 'QUBIC', icon: '◇', cqs: 55, ts: 70, ci: 75, ri: 70, price: '$0.0034', change: '+25.6%', narrative: 'AI', volume: '$12.8M', moonshot: 85 },
    { name: 'LINK', icon: '⬡', cqs: 78, ts: 68, ci: 72, ri: 58, price: '$14.82', change: '-3.2%', narrative: 'Oracle', volume: '$120M', moonshot: 68 },
    { name: 'SOL', icon: '◐', cqs: 80, ts: 82, ci: 83, ri: 48, price: '$98.45', change: '+15.3%', narrative: 'L1', volume: '$890M', moonshot: 71 },
    { name: 'QUBIC', icon: '◇', cqs: 55, ts: 70, ci: 75, ri: 70, price: '$0.0034', change: '+25.6%', narrative: 'AI', volume: '$12.8M', moonshot: 85 },
    { name: 'LINK', icon: '⬡', cqs: 78, ts: 68, ci: 72, ri: 58, price: '$14.82', change: '-3.2%', narrative: 'Oracle', volume: '$120M', moonshot: 68 },
    { name: 'SOL', icon: '◐', cqs: 80, ts: 82, ci: 83, ri: 48, price: '$98.45', change: '+15.3%', narrative: 'L1', volume: '$890M', moonshot: 71 },
    { name: 'QUBIC', icon: '◇', cqs: 55, ts: 70, ci: 75, ri: 70, price: '$0.0034', change: '+25.6%', narrative: 'AI', volume: '$12.8M', moonshot: 85 },
    { name: 'LINK', icon: '⬡', cqs: 78, ts: 68, ci: 72, ri: 58, price: '$14.82', change: '-3.2%', narrative: 'Oracle', volume: '$120M', moonshot: 68 },
    { name: 'SOL', icon: '◐', cqs: 80, ts: 82, ci: 83, ri: 48, price: '$98.45', change: '+15.3%', narrative: 'L1', volume: '$890M', moonshot: 71 },
    { name: 'QUBIC', icon: '◇', cqs: 55, ts: 70, ci: 75, ri: 70, price: '$0.0034', change: '+25.6%', narrative: 'AI', volume: '$12.8M', moonshot: 85 },
    { name: 'LINK', icon: '⬡', cqs: 78, ts: 68, ci: 72, ri: 58, price: '$14.82', change: '-3.2%', narrative: 'Oracle', volume: '$120M', moonshot: 68 },
    { name: 'SOL', icon: '◐', cqs: 80, ts: 82, ci: 83, ri: 48, price: '$98.45', change: '+15.3%', narrative: 'L1', volume: '$890M', moonshot: 71 },
    { name: 'MATIC', icon: '◮', cqs: 74, ts: 76, ci: 78, ri: 52, price: '$0.82', change: '+9.8%', narrative: 'L2', volume: '$340M', moonshot: 73 },
  ];
  
  return (
    <div className="flex gap-6 p-6 h-fit bg-zinc-900">
      <div className="bg-gradient-to-br h-fit from-zinc-800 to-zinc-900 border-zinc-700 flex-1 p-6 border shadow-lg rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Flame className="text-[#d0b345]" />
              Hot Coins
            </h2>
            <div className="flex gap-2">
              {['All', 'High CI', 'Low Risk'].map(filter => (
                <button key={filter} className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-all hover:scale-105 shadow-md font-semibold text-white">
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
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
                  <th className="text-right py-3 px-4 text-sm font-semibold text-zinc-400">Add</th>
                </tr>
              </thead>
              <tbody>
                {demoCoins.map((coin, idx) => (
                  <tr key={idx} className="border-zinc-700 hover:bg-zinc-700/50 border-b transition-all cursor-pointer group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#d0b345] flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-all">
                          {coin.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{coin.name}</div>
                          <div className="text-xs text-zinc-500">{coin.narrative}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 font-semibold text-white">{coin.price}</td>
                    <td className="text-right py-4 px-4">
                      <span className={`${coin.change.startsWith('+') ? 'text-green-400' : 'text-red-400'} font-semibold`}>
                        {coin.change}
                      </span>
                    </td>
                    <td className="text-right py-4 px-4 text-zinc-400">{coin.volume}</td>
                    <td className="text-right py-4 px-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold shadow-md ${coin.cqs >= 70 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {coin.cqs}
                      </span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold shadow-md ${coin.ts >= 70 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {coin.ts}
                      </span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold shadow-md ${coin.ci >= 70 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {coin.ci}
                      </span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold shadow-md ${coin.ri < 50 ? 'bg-green-500/20 text-green-400' : coin.ri < 75 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {coin.ri}
                      </span>
                    </td>
                    <td className="text-right py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-zinc-700 rounded-full h-2 overflow-hidden">
                          <div className="bg-[#d0b345] h-2 rounded-full shadow-md" style={{ width: `${coin.moonshot}%` }}></div>
                        </div>
                        <span className="text-xs bg-[#d0b345] bg-clip-text text-transparent font-bold">{coin.moonshot}</span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4">
                      <button className="px-4 font-semibold py-2 bg-[#d0b345] rounded-lg text-xs text-white transition-all shadow-lg hover:shadow-xl hover:scale-110">
                        Entry
                      </button>
                    </td>
                    <td className="text-right py-4 px-4">
                      <button 
                        onClick={() => addToPortfolio(coin)}
                        className="px-4 py-2 bg-[#d0b345] rounded-lg text-xs font-semibold text-white transition-all shadow-lg hover:shadow-xl hover:scale-110">
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 w-120 p-6 border shadow-lg rounded-lg">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-white">
            <Award className="text-[#d0b345]" />
            Portfolio
          </h2>
          
          {portfolio.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <Target className="mx-auto mb-4 opacity-50" size={48} />
              <p>No coins added yet</p>
              <p className="text-sm mt-2">Click "Add" to build your portfolio</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-4 text-xs font-semibold text-zinc-400 mb-2">
                <div className="w-2"></div>
               
                <div className="w-24">Name</div>
                <div className="w-30">Price</div>
                <div className="w-14">24hr</div>
                <div className="w-15 text-right">Entry</div>
              </div>
              {portfolio.map((coin, idx) => (
                <div key={idx} className="bg-zinc-800/80 border-zinc-700 border rounded-lg px-4 py-3 transition-all hover:bg-zinc-700/50 flex items-center gap-3">
                  <button 
                    onClick={() => removeFromPortfolio(coin.name)}
                    className="text-zinc-500 hover:text-yellow-400 transition-colors w-4">
                    <Trash2 size={16} fill="currentColor" />
                  </button>

                  <div className="w-7 h-7 rounded-full bg-[#d0b345] flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
                    {coin.icon}
                  </div>
                  
                  <div className="w-12 min-w-0">
                    <div className="font-semibold text-white text-sm">{coin.name}</div>
                  </div>
                  
                  <div className="w-30 text-left">
                    <div className="text-white font-semibold text-sm">{coin.price}</div>
                  </div>
                  
                  <div className="w-14 text-left">
                    <div className={`font-semibold text-sm ${coin.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.change}
                    </div>
                  </div>
                  
                  <div className="w-20 text-right">
                    <button className="px-3 py-1 bg-[#d0b345] rounded text-xs font-semibold text-black transition-all hover:scale-105">
                      Entry
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}  
        </div>
      </div>
  )
}

export default HotCoins