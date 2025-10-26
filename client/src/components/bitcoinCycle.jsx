import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

const CryptoMarketCycle = () => {
  const [timeframe, setTimeframe] = useState("All");

const { data:gcmiData, isLoading } = useQuery({
  queryKey: ["gcmi"],
  queryFn: async () => {
    const res = await axios.get(`${process.meta.env.VITE_BACKEND_URL}/api/gcmi`);
    return res.data;
  },
});


  // Same dataset you had
  const allData = [
    { date: "Jan 2011", gcmi: 8, btcPrice: 0.3 },
    { date: "Apr 2011", gcmi: 45, btcPrice: 1.2 },
    { date: "Jul 2011", gcmi: 78, btcPrice: 15 },
    { date: "Oct 2011", gcmi: 22, btcPrice: 3 },
    { date: "Jan 2012", gcmi: 18, btcPrice: 5 },
    { date: "Apr 2012", gcmi: 25, btcPrice: 5.5 },
    { date: "Jul 2012", gcmi: 32, btcPrice: 8 },
    { date: "Oct 2012", gcmi: 38, btcPrice: 11 },
    { date: "Jan 2013", gcmi: 48, btcPrice: 15 },
    { date: "Apr 2013", gcmi: 75, btcPrice: 120 },
    { date: "Jul 2013", gcmi: 82, btcPrice: 95 },
    { date: "Oct 2013", gcmi: 88, btcPrice: 180 },
    { date: "Jan 2014", gcmi: 68, btcPrice: 800 },
    { date: "Apr 2014", gcmi: 42, btcPrice: 450 },
    { date: "Jul 2014", gcmi: 35, btcPrice: 600 },
    { date: "Oct 2014", gcmi: 28, btcPrice: 350 },
    { date: "Jan 2015", gcmi: 22, btcPrice: 250 },
    { date: "Apr 2015", gcmi: 25, btcPrice: 240 },
    { date: "Jul 2015", gcmi: 32, btcPrice: 280 },
    { date: "Oct 2015", gcmi: 38, btcPrice: 320 },
    { date: "Jan 2016", gcmi: 42, btcPrice: 430 },
    { date: "Apr 2016", gcmi: 48, btcPrice: 450 },
    { date: "Jul 2016", gcmi: 52, btcPrice: 650 },
    { date: "Oct 2016", gcmi: 58, btcPrice: 700 },
    { date: "Jan 2017", gcmi: 65, btcPrice: 950 },
    { date: "Apr 2017", gcmi: 72, btcPrice: 1300 },
    { date: "Jul 2017", gcmi: 78, btcPrice: 2500 },
    { date: "Oct 2017", gcmi: 85, btcPrice: 5800 },
  ];

  const data = timeframe === "All" ? allData : allData.slice(-12);

  const getPhase = (value) => {
    if (value <= 30)
      return {
        name: "Accumulation / Early Bull",
        color: "#10b981",
        desc: "Fear or undervalued zone",
      };
    if (value <= 70)
      return {
        name: "Expansion / Mid Bull",
        color: "#f59e0b",
        desc: "Growth phase",
      };
    return { name: "Euphoria / Late Bull", color: "#ef4444", desc: "High risk zone" };
  };

  return (
    <div className="bg-gradient-to-br h-fit from-zinc-800 to-zinc-900 w-full p-6 rounded-2xl shadow-lg border-2 border-zinc-700 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#d0b345]">
          Bitcoin Global Cycle Meta Index (GCMI)
        </h2>
        <div className="flex gap-2">
          {["1y", "All"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                timeframe === tf
                  ? "bg-[#d0b345] text-black"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      

      {/* Chart */}
      <div className="h-60 ">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="gcmiFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#aaa", fontSize: 10 }}
              interval={2}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fill: "#aaa", fontSize: 12 }}
              tickFormatter={(v) => `${v}`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#aaa", fontSize: 12 }}
              tickFormatter={(v) =>
                v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`
              }
            />

            {/* Background bands for phases */}
            <ReferenceArea y1={0} y2={30} fill="#10b98122" />
            <ReferenceArea y1={30} y2={70} fill="#f59e0b22" />
            <ReferenceArea y1={70} y2={100} fill="#ef444422" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#1e1e1e",
                border: "1px solid #333",
                borderRadius: "8px",
                color: "#fff",
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const gcmiValue = payload.find((p) => p.dataKey === "gcmi")?.value;
                  const btcValue = payload.find((p) => p.dataKey === "btcPrice")?.value;
                  const phase = getPhase(gcmiValue);

                  return (
                    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 shadow-lg">
                      <p className="text-xs text-gray-400 mb-2">{label}</p>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="text-[#d0b345] font-semibold">GCMI:</span>{" "}
                          {gcmiValue?.toFixed(1)}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400 font-semibold">BTC Price:</span>{" "}
                          {btcValue >= 1000
                            ? `$${(btcValue / 1000).toFixed(1)}K`
                            : `$${btcValue?.toFixed(2)}`}
                        </p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-zinc-700">
                        <p className="text-xs font-semibold" style={{ color: phase.color }}>
                          {phase.name}
                        </p>
                        <p className="text-xs text-gray-500">{phase.desc}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />

            {/* GCMI Line */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="gcmi"
              stroke="#d0b345"
              strokeWidth={2.5}
              dot={false}
              name="GCMI"
              fillOpacity={1}
              fill="url(#gcmiFill)"
            />

            {/* BTC Price Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="btcPrice"
              stroke="#9ca3af"
              strokeWidth={1.8}
              dot={false}
              name="BTC Price"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

     
    </div>
  );
};

export default CryptoMarketCycle;
