import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import axios from "axios";
import { useTheme } from '../context/ThemeContext';

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
  const { isDarkMode } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const exchanges = ['all', 'binance', 'bybit', 'okx'];

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

  const displayData = useMemo(() => filtered.slice(0, 10), [filtered]);

  const handleExchangeSelect = (exchange) => {
    setSelected(exchange);
    setOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-zinc-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center w-fit p-6">
        <div className="text-red-400 text-sm">Error loading data</div>
      </div>
    );
  }

  return (
    <div className="max-w-full hidden [@media(min-width:1660px)]:block">
      <div
        className={`flex flex-col px-3 py-3 rounded-xl gap-2 shadow-xl border transition-all duration-300
          ${
            isDarkMode
              ? "bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700 text-zinc-100"
              : "bg-gradient-to-br from-white to-gray-100 border-gray-300 text-gray-900"
          }
        `}
      >
        <div className="flex flex-row justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <h2
              className={`text-base font-semibold ${
                isDarkMode
                  ? "bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent"
                  : "bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent"
              }`}
            >
              Live Liquidations
            </h2>
            {isFetching && (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-xs text-zinc-500">Live</span>
              </div>
            )}
          </div>

          {/* Dropdown */}
          <div className="relative flex flex-col" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className={`flex items-center justify-between w-20 px-2 py-1 rounded text-xs cursor-pointer transition-all duration-200
                ${
                  isDarkMode
                    ? "bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }
              `}
            >
              <span className="capitalize">{selected}</span>
              <span
                className={`text-xs transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            {open && (
              <div
                className={`absolute top-8 right-0 z-10 flex flex-col rounded shadow-2xl min-w-full border ${
                  isDarkMode
                    ? "bg-zinc-800 border-zinc-700 text-zinc-100"
                    : "bg-white border-gray-200 text-gray-800"
                } animate-in fade-in slide-in-from-top-2 duration-200`}
              >
                {exchanges.map((ex) => (
                  <div
                    key={ex}
                    onClick={() => handleExchangeSelect(ex)}
                    className={`px-2 py-1.5 text-xs cursor-pointer capitalize transition-all duration-150 first:rounded-t last:rounded-b
                      ${
                        isDarkMode
                          ? "hover:bg-zinc-700 hover:translate-x-1"
                          : "hover:bg-gray-100 hover:translate-x-1"
                      }`}
                  >
                    {ex}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table Header */}
        <div
          className={`grid grid-cols-[60px_80px_60px_50px_70px_55px] gap-2 px-2 py-1 border-t text-xs font-medium
            ${
              isDarkMode
                ? "border-zinc-700 text-zinc-400"
                : "border-gray-300 text-gray-600"
            }`}
        >
          <span>Exch</span>
          <span>Symbol</span>
          <span>Price</span>
          <span>Side</span>
          <span>Amount</span>
          <span>Time</span>
        </div>

        {/* Table Body */}
        <div className="flex flex-col gap-1.5">
          {displayData.length > 0 ? (
            displayData.map((item, index) => {
              const exchangeLogo = exchangeLogos[item.exchange?.toLowerCase()];
              const timestamp = item.timestamp
                ? new Date(item.timestamp).toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A";

              return (
                <div
                  key={`${item.exchange}-${item.symbol}-${item.timestamp}-${index}`}
                  className={`grid grid-cols-[60px_80px_60px_50px_70px_55px] gap-2 items-center px-2 py-1.5 rounded text-xs transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                    item.side === "BUY"
                      ? isDarkMode
                        ? "bg-green-500/10 hover:bg-green-500/20"
                        : "bg-green-100 hover:bg-green-200"
                      : isDarkMode
                        ? "bg-red-500/10 hover:bg-red-500/20"
                        : "bg-red-100 hover:bg-red-200"
                  }`}
                  style={{
                    animationDelay: `${index * 40}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <div className="flex items-center gap-1">
                    {exchangeLogo && (
                      <img
                        className="rounded-full w-4 h-4 transition-transform duration-300 hover:scale-125 hover:rotate-12"
                        src={exchangeLogo}
                        alt={item.exchange}
                      />
                    )}
                    <span className="capitalize text-xs truncate">{item.exchange}</span>
                  </div>
                  <span className="truncate text-xs font-medium">{item.symbol}</span>
                  <span className="font-mono text-xs">${parseFloat(item.price).toFixed(2)}</span>
                  <span
                    className={`font-semibold ${
                      item.side === "BUY"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.side}
                  </span>
                  <span className="font-mono text-xs">
                    ${formatNumber(item.totalUSD)}
                  </span>
                  <span className="text-xs opacity-80">{timestamp}</span>
                </div>
              );
            })
          ) : (
            <p className="text-zinc-400 text-center py-6 text-xs animate-pulse">
              No data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveLiquidation;
