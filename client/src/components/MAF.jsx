// MAFCard.jsx
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
 * MAFCard
 * - Use this component inside your dashboard.
 * - Pass `data` prop as array of { date, ism, m2, dxy, btcPrice? } (monthly).
 * - This example computes normalized series locally for demo.
 */

const GOLD = "#d0b345";
const GREEN = "#10b981";
const AMBER = "#f59e0b";
const RED = "#ef4444";
const BLUE = "#3b82f6";

const formatPhase = (v) => {
  // v is maf normalized 0..1
  if (v <= 0.4) return { name: "Unfavorable Macro", color: RED, desc: "Tight liquidity" };
  if (v <= 0.7) return { name: "Neutral Macro", color: AMBER, desc: "Moderate liquidity" };
  return { name: "Favorable Macro", color: GREEN, desc: "Loose liquidity" };
};

const normalizeSeries = (arr) => {
  // simple min-max normalizer (avoid divide-by-zero)
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  if (min === max) return arr.map(() => 0.5);
  return arr.map((v) => (v - min) / (max - min));
};

const MAFCard = ({ rawData = null }) => {
  const [timeframe, setTimeframe] = useState("All");
  // Mock fallback data if not passed
  const fallback = [
    { date: "Jan 2015", ism: 52.3, m2: 5.2, dxy: 94.5 },
    { date: "Apr 2015", ism: 51.8, m2: 5.8, dxy: 96.2 },
    { date: "Jul 2015", ism: 50.2, m2: 6.1, dxy: 97.8 },
    { date: "Oct 2015", ism: 49.5, m2: 6.5, dxy: 98.2 },
    { date: "Jan 2016", ism: 52.1, m2: 7.2, dxy: 95.8 },
    { date: "Apr 2016", ism: 53.5, m2: 7.8, dxy: 94.2 },
    { date: "Jul 2016", ism: 54.2, m2: 8.1, dxy: 93.5 },
    { date: "Oct 2016", ism: 54.8, m2: 8.5, dxy: 92.8 },
    { date: "Jan 2017", ism: 55.6, m2: 9.2, dxy: 91.5 },
    { date: "Apr 2017", ism: 56.8, m2: 9.8, dxy: 90.2 },
    { date: "Jul 2017", ism: 57.5, m2: 10.2, dxy: 89.5 },
    { date: "Oct 2017", ism: 58.2, m2: 10.8, dxy: 88.8 },
    { date: "Jan 2018", ism: 58.8, m2: 11.2, dxy: 88.2, },
    { date: "Apr 2018", ism: 56.5, m2: 9.5, dxy: 91.5 },
    { date: "Jul 2018", ism: 54.8, m2: 8.2, dxy: 93.8 },
    { date: "Oct 2018", ism: 53.2, m2: 7.5, dxy: 95.2 },
    { date: "Jan 2019", ism: 52.5, m2: 7.2, dxy: 96.5 },
    { date: "Apr 2019", ism: 54.2, m2: 8.5, dxy: 94.2 },
    { date: "Jul 2019", ism: 55.8, m2: 9.8, dxy: 92.5 },
    { date: "Oct 2019", ism: 54.5, m2: 9.2, dxy: 93.8 },
  ];

  const input = rawData ?? fallback;

  // PREPROCESS: compute inversed DXY, normalize components and compute MAF
  const prepared = useMemo(() => {
    // compute DXY inverse raw
    const dxyInvRaw = input.map((d) => 1 / d.dxy);

    // normalize each series separately to 0..1
    const ismArr = normalizeSeries(input.map((d) => d.ism));
    const m2Arr = normalizeSeries(input.map((d) => d.m2));
    const dxyInvArr = normalizeSeries(dxyInvRaw);

    // weighted sum (equal weights here — you can change)
    const mafArr = input.map((_, i) => {
      // example weight: ISM trend + M2 growth + DXY^-1 (equal weights)
      const val = ismArr[i] + m2Arr[i] + dxyInvArr[i];
      // bring to 0..1 range by dividing by 3 (max possible)
      return val / 3;
    });

    // produce final array with formatted numbers (MAF 0..100)
    const combined = input.map((d, i) => ({
      date: d.date,
      ism: +(ismArr[i]).toFixed(3),
      m2: +(m2Arr[i]).toFixed(3),
      dxyInv: +(dxyInvArr[i]).toFixed(3),
      maf: +(mafArr[i]).toFixed(3), // 0..1
      mafPercent: Math.round(mafArr[i] * 100),
    }));

    return combined;
  }, [input]);

  const filteredData = timeframe === "1y" ? prepared.slice(-12) : prepared;

  const latest = filteredData[filteredData.length - 1];
  const phase = latest ? formatPhase(latest.maf) : null;

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 w-full border-2 border-zinc-700 p-6 rounded-2xl shadow-lg text-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold" style={{ color: GOLD }}>
            Macro Alignment Factor (MAF)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            normalize(ISM_trend + M2_growth + DXY⁻¹) — reflects macro liquidity & dollar
            environment
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

      {/* Top metrics row */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-3 pr-4 border-r border-zinc-800">
          <div className="text-xs text-slate-400">MAF</div>
          <div className="flex flex-col">
            <div className="text-2xl font-semibold text-[#d0b345]" >
              {latest ? `${latest.mafPercent}` : "--"}
              <span className="text-xs text-slate-400 ml-2">/100</span>
            </div>
            <div className="text-xs text-slate-400">{phase?.name}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-zinc-800 px-3 py-2 rounded-md">
            <div className="text-xs text-slate-400">ISM</div>
            <div className="text-sm font-medium text-green-400">{latest ? latest.ism : "--"}</div>
          </div>
          <div className="bg-zinc-800 px-3 py-2 rounded-md">
            <div className="text-xs text-slate-400">M2</div>
            <div className="text-sm font-medium text-amber-400">{latest ? latest.m2 : "--"}</div>
          </div>
          <div className="bg-zinc-800 px-3 py-2 rounded-md">
            <div className="text-xs text-slate-400">DXY⁻¹</div>
            <div className="text-sm font-medium text-red-400">{latest ? latest.dxyInv : "--"}</div>
          </div>
        </div>
      </div>

      {/* Chart area */}
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

            {/* Phase bands */}
            <ReferenceArea y1={0} y2={0.4} fill={RED + "22"} />
            <ReferenceArea y1={0.4} y2={0.7} fill={AMBER + "22"} />
            <ReferenceArea y1={0.7} y2={1} fill={GREEN + "22"} />

            <Tooltip
              contentStyle={{ backgroundColor: "#1e1e1e", border: "1px solid #333" }}
              formatter={(val, name) => {
                if (name === "maf") return [`${Math.round(val * 100)} / 100`, "MAF"];
                return [val, name.toUpperCase()];
              }}
              labelFormatter={(l) => `Date: ${l}`}
            />
            <Legend />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="maf"
              stroke={GOLD}
              strokeWidth={3}
              dot={false}
              name="MAF"
            />
            <Line yAxisId="left" type="monotone" dataKey="ism" stroke={GREEN} dot={false} name="ISM" strokeWidth={1.2} />
            <Line yAxisId="left" type="monotone" dataKey="m2" stroke={AMBER} dot={false} name="M2" strokeWidth={1.2} />
            <Line yAxisId="left" type="monotone" dataKey="dxyInv" stroke={RED} dot={false} name="DXY⁻¹" strokeWidth={1.2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      
    </div>
  );
};

export default MAFCard;
