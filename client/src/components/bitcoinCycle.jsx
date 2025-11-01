import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

const CryptoMarketCycle = () => {
  const { data, isLoading, isError } = useQuery({
  queryKey: ["gcmi"],
  queryFn: async () => {
    // Fetch GCMI page from backend (we'll select last 365 entries below)
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/gcmi`, { params: { limit: 365 } });
    return res.data || { data: [] };
  },
  select: (payload) => {
    const arr = Array.isArray(payload.data) ? payload.data : [];
    // Ensure sorted by date ascending, then take last 365 entries
    const sorted = arr.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    return sorted.slice(Math.max(0, sorted.length - 365));
  },
  staleTime: 1000 * 60 * 60, // 1 hour
  cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
  refetchInterval: false,
  keepPreviousData: true,
});



  if (isLoading) {
    return (
      <div className="bg-zinc-900 text-gray-400 p-6 rounded-2xl">
        Loading GCMI data...
      </div>
    );
  }

  if (isError || !data.length) {
    return (
      <div className="bg-zinc-900 text-red-400 p-6 rounded-2xl">
        Failed to load GCMI data.
      </div>
    );
  }

  const getPhase = (value) => {
    if (value <= 30)
      return { name: "Accumulation / Early Bull", color: "#10b981" };
    if (value <= 50)
      return { name: "Expansion / Mid Bull", color: "#f59e0b" };
    return { name: "Euphoria / Late Bull", color: "#ef4444" };
  };

  return (
    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 w-full p-6 rounded-2xl shadow-lg border-2 border-zinc-700 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#d0b345]">
          Bitcoin Global Cycle Meta Index (GCMI)
        </h2>
        <span className="text-xs text-gray-400">Last 1 Year</span>
      </div>

      {/* Chart */}
      <div className="h-84">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
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
              interval="preserveStartEnd" // automatically reduces tick count
              tickFormatter={(date) => {
                const d = new Date(date);
                // show as "MMM YY" e.g., "Jan 21"
                return `${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear().toString().slice(-2)}`;
              }}
              angle={-30}
              textAnchor="end"
            />

            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              tick={{ fill: "#aaa", fontSize: 12 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#aaa", fontSize: 12 }}
              tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`)}
            />

            {/* Background bands */}
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
                      <p className="text-sm">
                        <span className="text-[#d0b345] font-semibold">GCMI:</span>{" "}
                        {gcmiValue?.toFixed(1)}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-400 font-semibold">BTC:</span>{" "}
                        {btcValue >= 1000
                          ? `$${(btcValue / 1000).toFixed(1)}K`
                          : `$${btcValue?.toFixed(2)}`}
                      </p>
                      <div className="mt-2 pt-2 border-t border-zinc-700">
                        <p className="text-xs font-semibold" style={{ color: phase.color }}>
                          {phase.name}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="gcmi"
              stroke="#d0b345"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
              name="GCMI"
              fillOpacity={1}
              fill="url(#gcmiFill)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="btcPrice"
              stroke="#9ca3af"
              strokeWidth={1.8}
              dot={false}
              isAnimationActive={false}
              name="BTC Price"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CryptoMarketCycle;
