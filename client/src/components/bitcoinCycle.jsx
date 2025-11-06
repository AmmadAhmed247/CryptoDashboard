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
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const CryptoMarketCycle = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["gcmi"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/gcmi`, {
        params: { limit: 365 },
      });
      return res.data || { data: [] };
    },
    select: (payload) => {
      const arr = Array.isArray(payload.data) ? payload.data : [];
      const sorted = arr.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
      return sorted.slice(Math.max(0, sorted.length - 365));
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchInterval: false,
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <div className={`p-6 rounded-2xl ${isDarkMode ? "bg-zinc-900 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
        {t("loadingGCMI")}
      </div>
    );
  }

  if (isError || !data.length) {
    return (
      <div className={`p-6 rounded-2xl ${isDarkMode ? "bg-zinc-900 text-red-400" : "bg-red-100 text-red-600"}`}>
        {t("failedLoadGCMI")}
      </div>
    );
  }

  const getPhase = (value) => {
    if (value <= 30) return { name: t("accumulationEarlyBull"), color: "#10b981" };
    if (value <= 70) return { name: t("expansionMidBull"), color: "#f59e0b" };
    return { name: t("euphoriaLateBull"), color: "#ef4444" };
  };

  return (
    <div
      className={`w-full p-6 rounded-2xl shadow-lg border-2 transition-all duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700 text-white"
          : "bg-gradient-to-br from-white to-gray-100 border-gray-300 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold ${isDarkMode ? "text-[#d0b345]" : "text-yellow-600"}`}>
          {t("Bitcoin Global Cycle Meta Index (GCMI)")}
        </h2>
        <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
          {t("last1Year")}
        </span>
      </div>

      {/* Chart */}
      <div className="h-84">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="gcmiFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDarkMode ? "#3b82f6" : "#2563eb"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isDarkMode ? "#3b82f6" : "#2563eb"} stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#2f2f2f" : "#e5e7eb"} />
            <XAxis
              dataKey="date"
              tick={{ fill: isDarkMode ? "#aaa" : "#555", fontSize: 10 }}
              interval="preserveStartEnd"
              tickFormatter={(date) => {
                const d = new Date(date);
                return `${d.toLocaleString("en-US", { month: "short" })} ${d.getFullYear().toString().slice(-2)}`;
              }}
              angle={-30}
              textAnchor="end"
            />
            <YAxis yAxisId="left" domain={[0, 100]} tick={{ fill: isDarkMode ? "#aaa" : "#444", fontSize: 12 }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: isDarkMode ? "#aaa" : "#444", fontSize: 12 }}
              tickFormatter={(v) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v}`)}
            />

            {/* Background bands */}
            <ReferenceArea y1={0} y2={30} fill="#10b98122" />
            <ReferenceArea y1={30} y2={70} fill="#f59e0b22" />
            <ReferenceArea y1={70} y2={100} fill="#ef444422" />

            <Tooltip
              contentStyle={{
                backgroundColor: isDarkMode ? "#1e1e1e" : "#f9fafb",
                border: `1px solid ${isDarkMode ? "#333" : "#ddd"}`,
                borderRadius: "8px",
                color: isDarkMode ? "#fff" : "#111",
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const gcmiValue = payload.find((p) => p.dataKey === "gcmi")?.value;
                  const btcValue = payload.find((p) => p.dataKey === "btcPrice")?.value;
                  const phase = getPhase(gcmiValue);
                  return (
                    <div className={`border rounded-lg p-3 shadow-lg ${isDarkMode ? "bg-zinc-900 border-zinc-700 text-white" : "bg-white border-gray-200 text-gray-900"}`}>
                      <p className={`text-xs mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
                      <p className="text-sm">
                        <span className="text-[#d0b345] font-semibold">{t("gcmi")}:</span> {gcmiValue?.toFixed(1)}
                      </p>
                      <p className="text-sm">
                        <span className={`font-semibold ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>{t("btcPrice")}:</span>{" "}
                        {btcValue >= 1000 ? `$${(btcValue / 1000).toFixed(1)}K` : `$${btcValue?.toFixed(2)}`}
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
              name={t("gcmi")}
              fillOpacity={1}
              fill="url(#gcmiFill)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="btcPrice"
              stroke={isDarkMode ? "#9ca3af" : "#6b7280"}
              strokeWidth={1.8}
              dot={false}
              isAnimationActive={false}
              name={t("btcPrice")}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CryptoMarketCycle;
