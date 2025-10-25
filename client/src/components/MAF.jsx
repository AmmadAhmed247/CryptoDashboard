// LIEFCard.jsx
import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from "recharts";

/**
 * LIEFCard
 * - Measures anticipated capital inflow into crypto.
 * - Formula: normalize(0.4*ΔStable + 0.3*(100 - ΔExRes) + 0.2*ETFflow + 0.1*Stable2Ex)
 * - Data sources: DeFiLlama, CoinMetrics, CoinGlass, CryptoQuant (free).
 */

const GOLD = "#d0b345";
const GREEN = "#10b981";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const BLUE = "#3b82f6";

const formatPhase = (v) => {
  // Interpret liquidity phases
  if (v <= 0.4) return { name: "Weak Inflow Expectation", color: RED, desc: "Low capital inflow" };
  if (v <= 0.7) return { name: "Neutral Inflow Expectation", color: AMBER, desc: "Moderate inflow" };
  return { name: "Strong Inflow Expectation", color: GREEN, desc: "High capital inflow potential" };
};

const normalizeSeries = (arr) => {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (min === max) return arr.map(() => 0.5);
  return arr.map((v) => (v - min) / (max - min));
};

const LIEFCard = ({ rawData = null }) => {
  const [timeframe, setTimeframe] = useState("All");

  // Example mock dataset (monthly)
  const fallback = [
    { date: "Jan 2023", ΔStable: 3.2, ΔExRes: 1.2, ETFflow: 2.5, Stable2Ex: 1.1 },
    { date: "Feb 2023", ΔStable: 3.8, ΔExRes: 0.8, ETFflow: 2.8, Stable2Ex: 1.5 },
    { date: "Mar 2023", ΔStable: 4.2, ΔExRes: 0.6, ETFflow: 3.1, Stable2Ex: 1.7 },
    { date: "Apr 2023", ΔStable: 3.9, ΔExRes: 0.9, ETFflow: 2.9, Stable2Ex: 1.3 },
    { date: "May 2023", ΔStable: 4.5, ΔExRes: 0.7, ETFflow: 3.5, Stable2Ex: 1.8 },
    { date: "Jun 2023", ΔStable: 5.1, ΔExRes: 0.5, ETFflow: 3.8, Stable2Ex: 2.2 },
    { date: "Jul 2023", ΔStable: 5.4, ΔExRes: 0.4, ETFflow: 4.1, Stable2Ex: 2.4 },
    { date: "Aug 2023", ΔStable: 4.9, ΔExRes: 0.6, ETFflow: 3.9, Stable2Ex: 2.0 },
    { date: "Sep 2023", ΔStable: 4.6, ΔExRes: 0.7, ETFflow: 3.3, Stable2Ex: 1.6 },
    { date: "Oct 2023", ΔStable: 5.0, ΔExRes: 0.5, ETFflow: 4.0, Stable2Ex: 2.1 },
    { date: "Nov 2023", ΔStable: 5.6, ΔExRes: 0.3, ETFflow: 4.5, Stable2Ex: 2.5 },
    { date: "Dec 2023", ΔStable: 6.1, ΔExRes: 0.2, ETFflow: 4.8, Stable2Ex: 2.8 },
  ];

  const input = rawData ?? fallback;

  // COMPUTE LIEF
  const prepared = useMemo(() => {
    const ΔStableArr = normalizeSeries(input.map((d) => d.ΔStable));
    const ΔExResArr = normalizeSeries(input.map((d) => 100 - d.ΔExRes)); // inverse per formula
    const ETFflowArr = normalizeSeries(input.map((d) => d.ETFflow));
    const Stable2ExArr = normalizeSeries(input.map((d) => d.Stable2Ex));

    const liefArr = input.map((_, i) => {
      const val =
        0.4 * ΔStableArr[i] +
        0.3 * ΔExResArr[i] +
        0.2 * ETFflowArr[i] +
        0.1 * Stable2ExArr[i];
      return val; // already roughly 0–1 after weighting
    });

    const combined = input.map((d, i) => ({
      date: d.date,
      ΔStable: +ΔStableArr[i].toFixed(3),
      ΔExRes: +ΔExResArr[i].toFixed(3),
      ETFflow: +ETFflowArr[i].toFixed(3),
      Stable2Ex: +Stable2ExArr[i].toFixed(3),
      lief: +liefArr[i].toFixed(3),
      liefPercent: Math.round(liefArr[i] * 100),
    }));

    return combined;
  }, [input]);

  const filteredData = timeframe === "1y" ? prepared.slice(-12) : prepared;

  const latest = filteredData[filteredData.length - 1];
  const phase = latest ? formatPhase(latest.lief) : null;

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 w-full border-2 p-6 rounded-2xl shadow-lg text-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: GOLD }}>
            Liquidity Inflow Expectation Factor (LIEF)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            normalize(0.4·ΔStable + 0.3·(100−ΔExRes) + 0.2·ETFflow + 0.1·Stable2Ex)
            — measures anticipated capital inflow into crypto.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            {["1y", "All"].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  timeframe === tf ? "bg-[#d0b345] text-black" : "bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500 mt-1">Updated: 2024-10-05</div>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-3 pr-4 border-r border-zinc-800">
          <div className="text-xs text-slate-400">LIEF</div>
          <div className="flex flex-col">
            <div className="text-2xl font-semibold text-[#d0b345]">
              {latest ? `${latest.liefPercent}` : "--"}
              <span className="text-xs text-slate-400 ml-2">/100</span>
            </div>
            <div className="text-xs text-slate-400">{phase?.name}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-zinc-800 px-3 py-2 rounded-md">
            <div className="text-xs text-slate-400">ΔStable</div>
            <div className="text-sm font-medium text-green-400">
              {latest ? latest.ΔStable : "--"}
            </div>
          </div>
          <div className="bg-zinc-800 px-3 py-2 rounded-md">
            <div className="text-xs text-slate-400">100−ΔExRes</div>
            <div className="text-sm font-medium text-amber-400">
              {latest ? latest.ΔExRes : "--"}
            </div>
          </div>
          <div className="bg-zinc-800 px-3 py-2 rounded-md">
            <div className="text-xs text-slate-400">ETFflow</div>
            <div className="text-sm font-medium text-blue-400">
              {latest ? latest.ETFflow : "--"}
            </div>
          </div>
          <div className="bg-zinc-800 px-3 py-2 rounded-md">
            <div className="text-xs text-slate-400">Stable2Ex</div>
            <div className="text-sm font-medium text-red-400">
              {latest ? latest.Stable2Ex : "--"}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData} margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#aaa", fontSize: 11 }}
              interval={Math.max(0, Math.floor(filteredData.length / 8))}
            />
            <YAxis
              yAxisId="left"
              domain={[0, 1]}
              tick={{ fill: "#aaa", fontSize: 11 }}
              tickFormatter={(v) => Math.round(v * 100)}
            />
            <ReferenceArea y1={0} y2={0.4} fill={RED + "22"} />
            <ReferenceArea y1={0.4} y2={0.7} fill={AMBER + "22"} />
            <ReferenceArea y1={0.7} y2={1} fill={GREEN + "22"} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e1e1e", border: "1px solid #333" }}
              formatter={(val, name) => {
                if (name === "lief") return [`${Math.round(val * 100)} / 100`, "LIEF"];
                return [val, name];
              }}
              labelFormatter={(l) => `Date: ${l}`}
            />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="lief" stroke={GOLD} strokeWidth={3} dot={false} name="LIEF" />
            <Line yAxisId="left" type="monotone" dataKey="ΔStable" stroke={GREEN} dot={false} name="ΔStable" strokeWidth={1.2} />
            <Line yAxisId="left" type="monotone" dataKey="ΔExRes" stroke={AMBER} dot={false} name="100−ΔExRes" strokeWidth={1.2} />
            <Line yAxisId="left" type="monotone" dataKey="ETFflow" stroke={BLUE} dot={false} name="ETFflow" strokeWidth={1.2} />
            <Line yAxisId="left" type="monotone" dataKey="Stable2Ex" stroke={RED} dot={false} name="Stable2Ex" strokeWidth={1.2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LIEFCard;
