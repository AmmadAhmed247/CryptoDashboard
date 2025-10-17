import { useEffect, useState } from "react";

function CoinRow({ coin, isDarkMode }) {
  const [glowClass, setGlowClass] = useState("");

  useEffect(() => {
    if (!coin.change) return;

    // Detect direction
    const isUp = coin.change.startsWith("+");
    const newGlow = isUp ? "glow-green" : "glow-red";

    setGlowClass(newGlow);

    // Remove glow after 600ms
    const timer = setTimeout(() => setGlowClass(""), 600);
    return () => clearTimeout(timer);
  }, [coin.price]); // trigger when price changes

  return (
    <tr>
      {/* Price */}
      <td
        className={`text-right py-4 px-4 font-semibold transition-all duration-300 ${glowClass} ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {coin.price}
      </td>

      {/* Change */}
      <td className="text-right py-4 px-4">
        <span
          className={`${
            coin.change.startsWith("+") ? "text-green-400" : "text-red-400"
          } font-semibold`}
        >
          {coin.change}
        </span>
      </td>

      {/* Volume */}
      <td
        className={`text-right py-4 px-4 ${
          isDarkMode ? "text-zinc-400" : "text-gray-600"
        }`}
      >
        {coin.volume}
      </td>
    </tr>
  );
}

export default CoinRow;
