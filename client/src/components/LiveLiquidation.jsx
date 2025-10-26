import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import axios from "axios";

const exchangeLogos = {
  binance: "binance.png",
  bybit: "bybit.png",
  okx: "okx.png",
};

const formatNumber = (num) => {
  const n = Number(num);
  if (isNaN(n)) return "0";
  if (n >= 1_000_000_000) {
    return (n / 1_000_000_000).toFixed(2).replace(/\.00$/, '') + "B";
  } else if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(2).replace(/\.00$/, '') + "M";
  } else if (n >= 1_000) {
    return (n / 1_000).toFixed(2).replace(/\.00$/, '') + "K";
  } else {
    return n.toFixed(2);
  }
};

const LiveLiquidation = () => {
  const [selected, setSelected] = useState("all");
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const dropdownRef = useRef(null);

  const exchanges = ['all', 'binance', 'bybit', 'okx'];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['liquidation'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/liquidation`);
      return res.data;
    },
    refetchInterval: 3000,
  });

  const safeData = useMemo(() => Array.isArray(data) ? data : [], [data]);

  const filtered = useMemo(() => {
    if (selected === "all") return safeData;
    return safeData.filter((d) => d.exchange?.toLowerCase() === selected.toLowerCase());
  }, [selected, safeData]);

  const displayData = useMemo(() => {
    return showAll ? filtered : filtered.slice(0, 12);
  }, [showAll, filtered]);

  const handleExchangeSelect = (exchange) => {
    setSelected(exchange);
    setOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-zinc-400 text-lg animate-pulse">Loading liquidation data...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-400 text-lg">Error loading data. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-2 w-full">
      <div className="flex flex-col bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 border-2 w-full px-4 py-6 rounded-2xl gap-2 shadow-2xl">
        <div className="flex flex-row justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Real Time Liquidations
            </h2>
            {isFetching && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-xs text-zinc-400">Live</span>
              </div>
            )}
          </div>

          <div className="relative flex flex-col" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between bg-zinc-700 w-28 px-3 py-2 rounded-md cursor-pointer hover:bg-zinc-600 transition-all duration-200 hover:shadow-lg hover:scale-105"
              aria-haspopup="true"
              aria-expanded={open}
            >
              <span className="capitalize">{selected}</span>
              <span className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {open && (
              <div className="absolute top-12 z-10 flex flex-col bg-zinc-800 border border-zinc-700 rounded-md shadow-2xl min-w-full animate-in fade-in slide-in-from-top-2 duration-200">
                {exchanges.map((ex) => (
                  <div
                    key={ex}
                    onClick={() => handleExchangeSelect(ex)}
                    className="px-3 py-2 cursor-pointer capitalize hover:bg-zinc-700 transition-all duration-150 first:rounded-t-md last:rounded-b-md hover:translate-x-1"
                  >
                    {ex}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[100px_120px_100px_80px_120px_100px] gap-4 px-3 py-2 border-t-2 border-zinc-600 text-zinc-300 font-medium">
          <span>Exchange</span>
          <span>Symbol</span>
          <span>Price</span>
          <span>Side</span>
          <span>Total USD</span>
          <span>Time</span>
        </div>

        {/* Table Body */}
        <div className="flex flex-col gap-2">
          {displayData.length > 0 ? (
            displayData.map((item, index) => {
              const exchangeLogo = exchangeLogos[item.exchange?.toLowerCase()];
              const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleTimeString("en-GB") : 'N/A';
              
              return (
                <div
                  key={`${item.exchange}-${item.symbol}-${item.timestamp}-${index}`}
                  className={`grid grid-cols-[100px_120px_100px_80px_120px_100px] gap-4 items-center font-semibold px-3 py-1 rounded-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-in fade-in slide-in-from-left-4 ${
                    item.side === "BUY"
                      ? "bg-gradient-to-r from-green-600/80 to-green-500/70 hover:from-green-600/90 hover:to-green-500/80"
                      : "bg-gradient-to-r from-red-500/80 to-red-600/60 hover:from-red-500/95 hover:to-red-600/90"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards'
                  }}
                >
                  <div className="flex items-center gap-2">
                    {exchangeLogo && (
                      <img
                        className="rounded-full w-6 h-6 transition-transform duration-300 hover:scale-110 hover:rotate-12"
                        src={exchangeLogo}
                        alt={item.exchange}
                      />
                    )}
                    <span className="capitalize text-sm">{item.exchange}</span>
                  </div>
                  <span className="truncate ">{item.symbol}</span>
                  <span className="font-mono">${parseFloat(item.price).toFixed(2)}</span>
                  <span className={` ${item.side === "BUY" ? "text-green-100" : "text-red-100"}`}>
                    {item.side}
                  </span>
                  <span className="font-mono">${formatNumber(item.totalUSD)}</span>
                  <span className="text-sm opacity-90">{timestamp}</span>
                </div>
              );
            })
          ) : (
            <p className="text-zinc-400 text-center py-8 animate-pulse">No liquidation data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveLiquidation;