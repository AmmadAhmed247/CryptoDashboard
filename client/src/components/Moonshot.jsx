import React, { useState } from "react";
import { Rocket, Sparkles } from "lucide-react";

export default function MoonshotFactorMini() {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);

  const coins = [
    {
      id: 1,
      name: "WLD",
      logo: "🌍",
      nf: 92,
      marketCapFactor: 65,
      hype: 88,
      novelty: 90,
      cqs: 78,
      marketCap: "$1.2B",
      change24h: 15.4,
    },
    {
      id: 2,
      name: "Pepe",
      logo: "🐸",
      nf: 85,
      marketCapFactor: 72,
      hype: 95,
      novelty: 58,
      cqs: 72,
      marketCap: "$890M",
      change24h: 22.8,
    },
    {
      id: 3,
      name: "Sui",
      logo: "💧",
      nf: 76,
      marketCapFactor: 55,
      hype: 78,
      novelty: 68,
      cqs: 70,
      marketCap: "$1.6B",
      change24h: -5.3,
    },
  ];

  const calculateMoonshot = (coin) => {
    if (coin.cqs < 50) return 0;
    const raw =
      0.4 * coin.nf +
      0.3 * coin.marketCapFactor +
      0.2 * coin.hype +
      0.1 * coin.novelty;
    return Math.min(raw, 100);
  };

  const coinsWithScores = coins.map((c) => ({
    ...c,
    moonshotScore: calculateMoonshot(c),
  }));

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
      <div className=" mb-6">
        <div className="inline-flex items-center gap-2 mb-2">
          <Rocket  className=" h-8 float-animation text-amber-400 drop-shadow-[0_0_3px_#FFD700]/60" />
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
          {coinsWithScores.map((coin) => (
            <div
              key={coin.id}
              onClick={() => handleEnter(coin)}
              className="bg-zinc-900 border animation-float border-zinc-800 hover:border-amber-400/40 rounded-xl p-4 flex justify-between items-center cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{coin.logo}</span>
                <div>
                  <h3 className="font-semibold">{coin.name}</h3>
                  <p className="text-xs text-zinc-500">{coin.marketCap}</p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-bold ${
                    coin.change24h > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {coin.change24h > 0 ? "+" : ""}
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
              <img src="image.png" className="w-10 " alt="" />
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
                  selectedCoin.change24h > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {selectedCoin.change24h > 0 ? "+" : ""}
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
                  { label: "Narrative Fit", key: "nf" },
                  { label: "Market Cap Factor", key: "marketCapFactor" },
                  { label: "Hype Level", key: "hype" },
                  { label: "Novelty", key: "novelty" },
                  { label: "CQS", key: "cqs" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-400">{label}</span>
                      <span className="text-[#96948d] font-semibold">
                        {animateStats ? selectedCoin[key] : 0}
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
