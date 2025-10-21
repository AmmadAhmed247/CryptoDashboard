import React from 'react';

const DashboardHeader = () => (

  <div className="bg-zinc-950 border-b border-zinc-800 px-6 py-3">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
          CryptoSignal Pro
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-zinc-400">Live</span>
          </div>
          <div className="text-zinc-500">|</div>
          <span className="text-zinc-400">Oct 5, 2024 13:45 UTC</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700 text-sm">
          <span className="text-zinc-400">Cycle:</span>
          <span className="text-orange-400 font-semibold ml-2">Early Bear</span>
        </div>
        <button className="bg-orange-500 hover:bg-orange-600 p-2 rounded-lg transition-all">
          {/* Bell icon will be passed as a child or imported where used */}
          <span role="img" aria-label="bell">🔔</span>
        </button>
      </div>
    </div>
  </div>
);

export default DashboardHeader;
