import React from "react";

const SkeletonLoader = ({ rows = 5, height = "h-6" }) => (
  <div className="flex flex-col bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 px-3 py-3 rounded-xl gap-3 shadow-xl animate-pulse min-h-[250px]">
    <div className="h-5 bg-zinc-700/50 rounded w-1/3"></div>
    <div className="space-y-2">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className={`${height} bg-zinc-700/40 rounded`}></div>
      ))}
    </div>
  </div>
);

export default SkeletonLoader;
