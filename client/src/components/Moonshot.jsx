import React, { useState } from "react";
import { Rocket, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function MoonshotFactorMini({ coins, isDarkMode }) {
  const { t } = useTranslation();
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [animateStats, setAnimateStats] = useState(false);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "$0.00";
    const cleanNum =
      typeof num === "string"
        ? parseFloat(num.replace(/[$,]/g, ""))
        : Number(num);

    if (isNaN(cleanNum)) return "$0.00";

    const absNum = Math.abs(cleanNum);
    if (absNum >= 1e9) return "$" + (cleanNum / 1e9).toFixed(2) + "B";
    if (absNum >= 1e6) return "$" + (cleanNum / 1e6).toFixed(2) + "M";
    if (absNum >= 1e3) return "$" + (cleanNum / 1e3).toFixed(2) + "K";
    return "$" + cleanNum.toFixed(2);
  };

  const normalizeToArray = (input) => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (input.data && !Array.isArray(input.data)) return [input.data];
    if (input.data && Array.isArray(input.data)) return input.data;
    return [input];
  };

  const transformedCoins = normalizeToArray(coins).map((coin) => ({
    id: coin._id || coin.coinId || coin.id || coin.symbol,
    name: coin.name || t("Unknown"),
    symbol: coin.symbol || "",
    logo: coin.logo || coin.image || "/default.png",
    price: typeof coin.price === "number" ? coin.price.toFixed(4) : "0.00",
    marketCap: formatNumber(coin.marketCap),
    volume: formatNumber(coin.volume),
    change24h:
      typeof coin.priceChange24h === "number" ? coin.priceChange24h.toFixed(2) : 0,
    moonshotScore: coin.Moonshot ?? 0,
    volatilityScore: coin.MoonshotFactors?.volatilityScore ?? 0,
    hypeScore: coin.MoonshotFactors?.hypeScore ?? 0,
    devActivity: coin.MoonshotFactors?.devActivity ?? 0,
    socialSentiment: coin.MoonshotFactors?.socialSentiment ?? 0,
    otherFactors: coin.MoonshotFactors?.otherFactors ?? 0,
    cqs: coin.CQS ?? 0,
    ci: coin.CI ?? 0,
    ri: coin.RI ?? 0,
    ts: coin.TS ?? 0,
  }));

  const sortedCoins = transformedCoins
    .sort((a, b) => b.moonshotScore - a.moonshotScore)
    .slice(0, 3);

  if (sortedCoins.length === 0) {
    return (
      <div className="bg-zinc-850 text-white p-6 rounded-2xl border border-zinc-700 max-w-xl mx-auto">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Rocket className="h-8 text-amber-400" />
            <h2 className="text-xl font-bold text-[#d0b345]">{t("Moonshot Factor")}</h2>
          </div>
          <p className="text-zinc-400 text-sm">{t("Loading moonshot data...")}</p>
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
            {t("Moonshot Factor")}
          </h2>
        </div>
        <p className="text-zinc-400 text-sm">{t("Daily top coins with the highest moonshot potential")}</p>
      </div>

      {!selectedCoin && (
        <div className="space-y-3">
          {sortedCoins.slice(0, 5).map((coin) => (
            <div
              key={coin.id}
              onClick={() => handleEnter(coin)}
              className={`${
                isDarkMode
                  ? "bg-zinc-900 border border-zinc-800 hover:border-amber-400/40"
                  : "bg-white border border-gray-200 hover:border-amber-300/50"
              } animation-float rounded-xl p-4 flex justify-between items-center cursor-pointer transition-all`}
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <img src={coin.logo} alt={coin.symbol} className="w-8 h-8 rounded-full" />
                <div>
                  <h3 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    {coin.name}
                  </h3>
                  <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}>
                    {coin.marketCap}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className={`text-sm font-bold ${parseFloat(coin.change24h) > 0 ? "text-green-400" : "text-red-600"}`}>
                  {parseFloat(coin.change24h) > 0 ? "+" : ""}
                  {coin.change24h}%
                </p>
                <div className="flex items-center justify-end gap-1">
                  <Sparkles className={`w-3 h-3 ${isDarkMode ? "text-amber-400" : "text-yellow-500"}`} />
                  <p className={`font-bold text-lg ${isDarkMode ? "text-[#E4C35E]" : "text-amber-600"}`}>
                    {coin.moonshotScore.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCoin && (
        <div className={`${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"} rounded-xl p-5 mt-4 transition-all`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src={selectedCoin.logo} alt={selectedCoin.symbol} className="w-10 h-10 rounded-full" />
              <div>
                <h3 className={`font-semibold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {selectedCoin.name}
                </h3>
                <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}>
                  {selectedCoin.marketCap}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className={`text-sm font-bold ${parseFloat(selectedCoin.change24h) > 0 ? "text-green-400" : "text-red-700"}`}>
                {parseFloat(selectedCoin.change24h) > 0 ? "+" : ""}
                {selectedCoin.change24h}%
              </p>
              <div className="flex items-center justify-end gap-1">
                <Sparkles className="w-3 h-3 text-[#E4C35E]" />
                <p className={`font-bold text-lg ${isDarkMode ? "text-[#E4C35E]" : "text-amber-600"}`}>
                  {selectedCoin.moonshotScore.toFixed(0)}
                </p>
              </div>
            </div>
          </div>

          {showAnalytics && (
            <div className="mt-4">
              <h3 className={`text-lg font-semibold mb-4 text-center ${isDarkMode ? "text-zinc-300" : "text-gray-700"}`}>
                {t("Detailed Breakdown")}
              </h3>
              <div className="space-y-3">
                {[
                  { label: t("Volatility Score"), key: "volatilityScore" },
                  { label: t("Hype Score"), key: "hypeScore" },
                  { label: t("Dev Activity"), key: "devActivity" },
                  { label: t("Other Factors"), key: "otherFactors" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}>{label}</span>
                      <span className={`font-semibold ${isDarkMode ? "text-zinc-200" : "text-gray-900"}`}>
                        {animateStats ? (selectedCoin[key] ?? 0).toFixed(0) : 0}
                      </span>
                    </div>
                    <div className={`h-2 ${isDarkMode ? "bg-zinc-800" : "bg-gray-200"} rounded-full overflow-hidden`}>
                      <div
                        className="h-full bg-[#E4C35E] transition-all duration-700 ease-out"
                        style={{ width: animateStats ? `${selectedCoin[key] ?? 0}%` : "0%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}>
                  {t("Overall Moonshot Score")}
                </p>
                <div className={`text-5xl font-bold mt-2 ${isDarkMode ? "text-[#E4C35E]" : "text-amber-600"}`}>
                  {animateStats ? (selectedCoin.moonshotScore ?? 0).toFixed(0) : 0}
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setShowAnalytics(false);
                    setSelectedCoin(null);
                  }}
                  className={`text-sm transition ${isDarkMode ? "text-zinc-400 hover:text-amber-400" : "text-gray-600 hover:text-amber-600"}`}
                >
                  {t("Back")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
