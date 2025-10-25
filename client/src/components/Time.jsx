import { useEffect, useState } from "react";

export default function LiveStatus({ isDarkMode }) {
  const [germanTime, setGermanTime] = useState("");

  useEffect(() => {
    const updateGermanTime = () => {
      const now = new Date();

      // Convert to German time (Europe/Berlin)
      const formatted = now.toLocaleString("en-GB", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      setGermanTime(formatted);
    };

    updateGermanTime(); // initial run
    const interval = setInterval(updateGermanTime, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
        </div>
        <span className={isDarkMode ? "text-zinc-400" : "text-gray-600"}>
          Live
        </span>
      </div>
      <div className={isDarkMode ? "text-zinc-500" : "text-gray-400"}>|</div>
      <span className={isDarkMode ? "text-zinc-400" : "text-gray-600"}>
        {germanTime} 
      </span>
    </div>
  );
}
