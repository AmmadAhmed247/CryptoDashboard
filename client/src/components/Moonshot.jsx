import React, { useState } from "react";
import { Rocket, Sparkles } from "lucide-react";

export default function MoonshotFactorMini({ coins }) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);

  // Format number to K, M, B
  const formatNumber = (num) => {
    const cleanNum = typeof num === 'string' 
      ? parseFloat(num.replace(/[$,]/g, '')) 
      : num;

    if (isNaN(cleanNum)) return '$0';

    const absNum = Math.abs(cleanNum);
    
    if (absNum >= 1e9) return '$' + (cleanNum / 1e9).toFixed(2) + 'B';
    if (absNum >= 1e6) return '$' + (cleanNum / 1e6).toFixed(2) + 'M';
    if (absNum >= 1e3) return '$' + (cleanNum / 1e3).toFixed(2) + 'K';
    return '$' + cleanNum.toFixed(2);
  };

  // Transform coins data to match component structure
  const transformedCoins = Array.isArray(coins) 
    ? coins.map((coin) => ({
        id: coin._id || coin.coinId,
        name: coin.name,
        symbol: coin.symbol,
        logo: coin.logo,
        price: `${coin.price?.toFixed(4) || '0.00'}`,
        marketCap: formatNumber(coin.marketCap),
        volume: formatNumber(coin.volume),
        change24h: coin.priceChange24h?.toFixed(2) || 0,
        moonshotScore: coin.Moonshot || 0,
        // Moonshot breakdown factors
        volatilityScore: coin.MoonshotFactors?.volatilityScore || 0,
        hypeScore: coin.MoonshotFactors?.hypeScore || 0,
        devActivity: coin.MoonshotFactors?.devActivity || 0,
        socialSentiment: coin.MoonshotFactors?.socialSentiment || 0,
        otherFactors: coin.MoonshotFactors?.otherFactors || 0,
        // Other scores
        cqs: coin.CQS || 0,
        ci: coin.CI || 0,
        ri: coin.RI || 0,
        ts: coin.TS || 0,
      }))
    : [];

  // Sort by moonshot score (highest first)
  const sortedCoins = transformedCoins.sort((a, b) => b.moonshotScore - a.moonshotScore).slice(0, 3);
  

  // Early return if no coins
  if (sortedCoins.length === 0) {
    return (
      <div className="bg-zinc-850 text-white p-6 rounded-2xl border border-zinc-700 max-w-xl mx-auto">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Rocket className="h-8 text-amber-400" />
            <h2 className="text-xl font-bold text-[#d0b345]">
              Moonshot Factor
            </h2>
          </div>
          <p className="text-zinc-400 text-sm">Loading moonshot data...</p>
        </div>
      </div>
    );
  }

  const handleEnter = (coin) => {
    setSelectedCoin(coin);
    setShowAnalytics(true);
    setAnimateStats(false);
    setTimeout(() => setAnimateStats(true), 200);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  return (
    <div className="bg-zinc-850 text-white p-6 rounded-2xl border border-zinc-700 max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <Rocket className="h-8 float-animation text-amber-400 drop-shadow-[0_0_3px_#FFD700]/60" />
          <h2 className="text-xl w-fit font-bold text-[#d0b345] bg-clip-text bg-gradient-to-r from-[#ffd66f] via-[#ffce51] to-[#FFD700] drop-shadow-[0_0_3px_#FFD700]/40">
            Moonshot Factor
          </h2>
        </div>
        <p className="text-zinc-400 text-sm">
          Daily top coins with the highest moonshot potential
        </p>
      </div>

      {/* Coin Selection (only show if no coin selected yet) */}
      {!selectedCoin && (
        <div className="space-y-3">
          {sortedCoins.slice(0, 5).map((coin) => (
            <div
              key={coin.id}
              onClick={() => handleEnter(coin)}
              className="bg-zinc-900 border animation-float border-zinc-800 hover:border-amber-400/40 rounded-xl p-4 flex justify-between items-center cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <img 
                  src={coin.logo} 
                  alt={coin.symbol} 
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{coin.name}</h3>
                  <p className="text-xs text-zinc-500">{coin.marketCap}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-bold ${
                    parseFloat(coin.change24h) > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {parseFloat(coin.change24h) > 0 ? "+" : ""}
                  {coin.change24h}%
                </p>
                <div className="flex items-center justify-end gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <p className="text-[#d0b345] font-bold text-lg">
                    {coin.moonshotScore.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Coin (only show one) */}
      {selectedCoin && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img 
                src={selectedCoin.logo} 
                alt={selectedCoin.symbol}
                className="w-10 h-10 rounded-full" 
              />
              <div>
                <h3 className="font-semibold text-lg">{selectedCoin.name}</h3>
                <p className="text-xs text-zinc-500">
                  {selectedCoin.marketCap}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-bold ${
                  parseFloat(selectedCoin.change24h) > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {parseFloat(selectedCoin.change24h) > 0 ? "+" : ""}
                {selectedCoin.change24h}%
              </p>
              <div className="flex items-center justify-end gap-1">
                <Sparkles className="w-3 h-3 text-[#E4C35E]" />
                <p className="text-[#dad9ab] font-bold text-lg">
                  {selectedCoin.moonshotScore.toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          {showAnalytics && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-4 text-[#888585] text-center">
                Detailed Breakdown
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Volatility Score", key: "volatilityScore" },
                  { label: "Hype Score", key: "hypeScore" },
                  { label: "Dev Activity", key: "devActivity" },
                  { label: "Other Factors", key: "otherFactors" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">{label}</span>
                      <span className="text-[#96948d] font-semibold">
                        {animateStats ? selectedCoin[key].toFixed(0) : 0}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#E4C35E] border-[#E4C35E] border-1 transition-all duration-700 ease-out"
                        style={{
                          width: animateStats ? `${selectedCoin[key]}%` : "0%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <p className="text-sm text-zinc-400">
                  Overall Moonshot Score
                </p>
                <div className="text-5xl font-bold text-[#E4C35E] mt-2">
                  {animateStats ? selectedCoin.moonshotScore.toFixed(0) : 0}
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setShowAnalytics(false);
                    setSelectedCoin(null);
                  }}
                  className="text-sm text-zinc-400 hover:text-amber-400 transition"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}