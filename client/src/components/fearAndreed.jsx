import {
  AlertCircle,
  Sparkles,
  Award,
} from "lucide-react";

const FearGreedGauge = ({ value, isDarkMode }) => {
  const getLabel = () => {
    if (value <= 20) return "Extreme Fear";
    if (value <= 40) return "Fear";
    if (value <= 60) return "Neutral";
    if (value <= 80) return "Greed";
    return "Extreme Greed";
  };

const getColor = (value) => {
  const v = Number(value);
  if (isNaN(v)) return "#DC2626"; // fallback to red

  if (v <= 50) return "#DC2626";      // Tailwind red-600
  if (v <= 80) return "#22C55D";      // Tailwind green-500
  return "#16A34A";                   // Tailwind green-600 (extreme)
};

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700"
          : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
      } rounded-xl p-4 border shadow-lg hover:shadow-xl transition-all`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className={`text-sm font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Fear & Greed Index
        </h3>
        <AlertCircle
          size={16}
          className={isDarkMode ? "text-zinc-500" : "text-gray-400"}
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div
            className="text-3xl font-bold"
            style={{ color: getColor() }}
          >
            {value}
          </div>
          <div
            className={`text-xs mt-1 ${
              isDarkMode ? "text-zinc-400" : "text-gray-500"
            }`}
          >
            {getLabel()}
          </div>
          <div
            className={`text-xs mt-2 flex items-center gap-1 ${
              value > 50 ? "text-green-500" : "text-red-600"
            }`}
          >
            <Sparkles size={15} />
            Buy Signal Active
          </div>
        </div>

        {/* ✅ Perfect Circle Gauge with Center Sticker */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 36 36"
          >
            {/* Background Circle */}
            <circle
              className="stroke-[3]"
              stroke={isDarkMode ? "#27272a" : "#e5e7eb"}
              fill="none"
              cx="18"
              cy="18"
              r="15.9155"
            />
            {/* Progress Circle */}
            <circle
              className="stroke-[3] transition-all duration-700"
              stroke={getColor()}
              fill="none"
              strokeDasharray={`${Math.min(value * 1.75, 100)} 100`}
              strokeLinecap="round"
              cx="18"
              cy="18"
              r="15.9155"
            />
          </svg>

          {/* 🧠 Sticker in the middle */}
          <div className={`absolute text-2xl ${getColor()}`}>{<Award className={` text-2xl text-red-600`} />}</div>
        </div>
      </div>
    </div>
  );
};

export default FearGreedGauge;
