import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const fetchCryptoNews = async () => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/data/cryptonews`);
  return res.data;
};

const CryptoNews = ({ isDarkMode }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cryptoNews"],
    queryFn: fetchCryptoNews,
    // match backend’s 5-min cache
    staleTime: 1000 * 60 * 5, // don’t refetch if <5 min old
    cacheTime: 1000 * 60 * 10, // keep cached data for 10 min
    refetchOnWindowFocus: false, // don’t refetch every time you focus tab
  });

  if (isLoading)
    return (
      <div
        className={`rounded-xl p-4 border shadow-lg flex justify-center ${
          isDarkMode
            ? "bg-zinc-900 border-zinc-700"
            : "bg-white border-gray-200"
        }`}
      >
        <Loader2 className="animate-spin text-gray-400" size={24} />
      </div>
    );

  if (isError)
    return (
      <div
        className={`rounded-xl p-4 border shadow-lg text-center ${
          isDarkMode
            ? "bg-zinc-900 text-red-400 border-zinc-700"
            : "bg-white text-red-500 border-gray-200"
        }`}
      >
        Failed to load news
      </div>
    );

  const newsItems = data?.articles?.slice(0, 4) || []; // ✅ GNews uses `articles` key

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700"
          : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
      } rounded-xl p-4 border shadow-lg`}
    >
      <h3
        className={`text-sm font-semibold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Latest Crypto News
      </h3>

      <div className="space-y-3">
        {newsItems.map((news, idx) => (
          <div
            key={idx}
            className={`pb-3 ${
              idx < newsItems.length - 1
                ? isDarkMode
                  ? "border-zinc-700"
                  : "border-gray-200"
                : ""
            } ${idx < newsItems.length - 1 ? "border-b" : ""} transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-[#d0b345] mt-1.5 shadow-lg shadow-yellow-500/40"></div>
              <div className="flex-1">
                <div
                  className={`text-sm font-medium mb-1 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {news.title}
                </div>
                <div
                  className={`text-xs ${
                    isDarkMode ? "text-zinc-500" : "text-gray-500"
                  }`}
                >
                  {news.source?.name ?? "Unknown Source"} —{" "}
                  {new Date(news.publishedAt).toLocaleString()}
                </div>

                <button
                  onClick={() => window.open(news.url, "_blank")}
                  className={`mt-2 text-xs font-semibold px-3 py-1 rounded-md transition-all ${
                    isDarkMode
                      ? "bg-zinc-700 text-white hover:bg-zinc-600"
                      : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                  }`}
                >
                  Read More →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoNews;
