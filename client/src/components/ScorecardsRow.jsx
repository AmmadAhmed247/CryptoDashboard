import React from 'react';

const ScorecardsRow = () => (
  <div className="grid grid-cols-4 gap-4">
    {/* Card 1 */}
    <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 hover:border-orange-500 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-zinc-400 text-sm mb-1">Coin Quality Score</div>
          <div className="text-4xl font-bold text-white">72</div>
        </div>
        <span role="img" aria-label="award">🏆</span>
      </div>
      <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
      </div>
      <div className="text-xs text-zinc-400">High Quality</div>
    </div>
    {/* Card 2 */}
    <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 hover:border-orange-500 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-zinc-400 text-sm mb-1">Timing Score</div>
          <div className="text-4xl font-bold text-white">85</div>
        </div>
        <span role="img" aria-label="clock">⏰</span>
      </div>
      <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
      </div>
      <div className="text-xs text-zinc-400">Strong Entry</div>
    </div>
    {/* Card 3 */}
    <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 hover:border-orange-500 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-zinc-400 text-sm mb-1">Chance Index</div>
          <div className="text-4xl font-bold text-white">85</div>
        </div>
        <span role="img" aria-label="target">🎯</span>
      </div>
      <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
      </div>
      <div className="text-xs text-zinc-400">High Chance</div>
    </div>
    {/* Card 4 */}
    <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700 hover:border-orange-500 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-zinc-400 text-sm mb-1">Risk Index</div>
          <div className="text-4xl font-bold text-white">55</div>
        </div>
        <span role="img" aria-label="alert">⚠️</span>
      </div>
      <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '55%' }}></div>
      </div>
      <div className="text-xs text-zinc-400">Medium Risk</div>
    </div>
  </div>
);

export default ScorecardsRow;
