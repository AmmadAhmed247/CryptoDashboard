import React, { useEffect, useState, useRef } from 'react';
import { Zap, Award, Trash2, Plus, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

function formatPrice(price) {
  return Number(price).toLocaleString("en-US", {
    maximumSignificantDigits: 4
  });
}

const HotCoins = () => {
  const { isDarkMode } = useTheme();
  const [portfolio, setPortfolio] = useState([]);
  const { user } = useAuth();
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);

  const prevPricesRef = useRef({});

  const { data: topCoinsData } = useQuery({
    queryKey: ['topCoins'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/top-coins`);
      return res.data.data;
    },
    refetchInterval: 3000,
    staleTime: 3000,
    retry: 1,
  });

  const [coinsWithFlash, setCoinsWithFlash] = useState([]);

  useEffect(() => {
    if (!topCoinsData) return;

    const currentPrices = {};
    const updatedCoins = topCoinsData.map(coin => {
      const id = coin.coinId;
      const currentPrice = coin.price;
      currentPrices[id] = currentPrice;

      const prevPrice = prevPricesRef.current[id];
      let flash = false;
      let direction = null;

      if (prevPrice !== undefined && prevPrice !== currentPrice) {
        flash = true;
        direction = currentPrice > prevPrice ? 'up' : 'down';
      }

      return {
        id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        logo: coin.logo,
        icon: <img src={coin.logo} alt={coin.symbol} className="w-8 h-8 rounded-full" />,
        cqs: coin.CQS.toFixed(0),
        ts: coin.TS.toFixed(0),
        ci: coin.CI.toFixed(0),
        ri: coin.RI.toFixed(0),
        cms: coin.CMS.toFixed(0),
        price: formatPrice(coin.price),
        rawPrice: coin.price,
        change: `${Number(coin.priceChange24h || 0).toFixed(2)}%`,
        volume: `$${parseFloat(coin.volume).toLocaleString()}`,
        mcap: `$${parseFloat(coin.marketCap).toLocaleString()}`,
        moonshot: coin.Moonshot.toFixed(0),
        narrative: coin.narrative || coin.symbol,
        flash,
        direction,
      };
    });

    const sorted = updatedCoins.sort((a, b) => {
      if (a.symbol === 'BTC') return -1;
      if (b.symbol === 'BTC') return 1;
      if (a.symbol === 'KAS') return -1;
      if (b.symbol === 'KAS') return 1;
      const mcapA = parseFloat(a.mcap.replace(/[$,]/g, '')) || 0;
      const mcapB = parseFloat(b.mcap.replace(/[$,]/g, '')) || 0;
      return mcapB - mcapA;
    });

    setCoinsWithFlash(sorted);
    prevPricesRef.current = currentPrices;

    const timer = setTimeout(() => {
      setCoinsWithFlash(prev => prev.map(c => ({ ...c, flash: false })));
    }, 1500);

    return () => clearTimeout(timer);
  }, [topCoinsData]);

  const totalPages = Math.ceil(coinsWithFlash.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCoins = coinsWithFlash.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [coinsWithFlash.length, totalPages, currentPage]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/portfolio`, { withCredentials: true });
        setPortfolio(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchPortfolio();
  }, [user]);

  const addToPortfolio = async (coin) => {
    try {
      if (!user) {
        toast.error(t("Please login to add coins to portfolio"));
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/portfolio/add`,
        {
          id: coin.id,
          symbol: coin.symbol,
          price: coin.rawPrice,
          change24h: parseFloat(coin.change),
          logo: coin.logo
        },
        { withCredentials: true }
      );
      setPortfolio(response.data);
      toast.success(t("Coin added to portfolio"));
    } catch (error) {
      if (error.response?.status === 401) toast.error(t("Please login to add coins to portfolio"));
      else if (error.response?.status === 400) toast.info(t("Coin already in portfolio"));
      else toast.error(error.response?.data?.message || t("Failed to add coin"));
    }
  };

  const removeFromPortfolio = async (coinId) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/portfolio/remove/${coinId}`,
        { withCredentials: true }
      );
      setPortfolio(res.data);
      toast.success(t("Coin removed from portfolio"));
    } catch (err) {
      toast.error(t("Failed to remove coin"));
    }
  };

  const enrichedPortfolio = portfolio.map(portfolioCoin => {
    const matchingCoin = coinsWithFlash.find(c => c.id === portfolioCoin.id);
    return {
      ...portfolioCoin,
      logo: matchingCoin?.logo || '',
      icon: matchingCoin?.logo ? (
        <img src={matchingCoin.logo} alt={portfolioCoin.symbol} className="w-8 h-8 rounded-full" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs">
          {portfolioCoin.symbol?.slice(0, 2)}
        </div>
      ),
      price: `$${Number(portfolioCoin.price).toLocaleString()}`,
      change: `${Number(portfolioCoin.change24h).toFixed(2)}%`,
      trend: portfolioCoin.change24h >= 0 ? 'up' : 'down',
    };
  });

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const themeClasses = isDarkMode
    ? {
        bg: 'bg-zinc-900',
        card: 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700',
        text: 'text-white',
        subtext: 'text-zinc-400',
        hover: 'hover:bg-zinc-700/50',
        border: 'border-zinc-700',
      }
    : {
        bg: 'bg-gray-50',
        card: 'bg-gradient-to-br from-white to-gray-100 border-gray-300',
        text: 'text-gray-900',
        subtext: 'text-gray-600',
        hover: 'hover:bg-gray-100',
        border: 'border-gray-300',
      };

  return (
    <div className={`flex flex-col lg:flex-row gap-6 p-3 sm:p-6 h-fit ${themeClasses.bg}`}>
      {/* Hot Coins Table */}
      <div className={`${themeClasses.card} flex-1 p-3 sm:p-6 border shadow-lg rounded-lg`}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 ${themeClasses.text}`}>
            <Zap className="text-[#d0b345]" size={20} />
            {t("Top Coins")}
          </h2>
        </div>

        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="min-w-[800px]">
            <table className="w-full">
              <thead>
                <tr className={themeClasses.border + ' border-b'}>
                  {['Coin', 'Price', '24h', 'Volume', 'CQS', 'TS', 'CI', 'RI', 'CMS', 'Moonshot', 'Action'].map((head, i) => (
                    <th key={i} className={`${i === 0 ? 'text-left' : 'text-right'} py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold ${themeClasses.subtext}`}>
                      {t(head)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentCoins.map((coin) => {
                  const isFlashingUp = coin.flash && coin.direction === 'up';
                  const isFlashingDown = coin.flash && coin.direction === 'down';

                  return (
                    <tr
                      key={coin.id}
                      className={`${themeClasses.border} border-b ${themeClasses.hover} transition-all cursor-pointer group`}
                    >
                      <td className="py-2 sm:py-4 px-2 sm:px-4">
                        <Link
                          to={`https://coinmarketcap.com/currencies/${coin.id || coin.name.toLowerCase().replace(/\s+/g, '-')}`}
                          target="_blank"
                          className="flex items-center gap-2 sm:gap-3"
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all flex-shrink-0">
                            {coin.icon}
                          </div>
                          <div className="min-w-0">
                            <div className={`font-semibold text-xs sm:text-sm ${themeClasses.text} truncate`}>{coin.name}</div>
                            <div className={`text-xs ${themeClasses.subtext} truncate`}>{coin.narrative}</div>
                          </div>
                        </Link>
                      </td>

                      <td className={`text-right py-2 sm:py-4 px-2 sm:px-4 font-semibold text-xs sm:text-sm transition-colors duration-300 ${
                        isFlashingUp ? 'text-green-500' :
                        isFlashingDown ? 'text-red-500' :
                        themeClasses.text
                      }`}>
                        {coin.price}
                      </td>

                      <td className="text-right py-2 sm:py-4 px-2 sm:px-4">
                        <span
                          className={`font-semibold text-xs sm:text-sm transition-all duration-300 inline-block ${
                            parseFloat(coin.change) >= 0
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          {coin.change}
                        </span>
                      </td>

                      <td className={`text-right py-2 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm transition-colors duration-300 ${themeClasses.subtext} ${
                        isFlashingUp ? '!text-green-400' :
                        isFlashingDown ? '!text-red-400' :
                        ''
                      }`}>
                        {coin.volume}
                      </td>
                      
                      {[coin.cqs, coin.ts, coin.ci, coin.ri, coin.cms].map((metric, i) => (
                        <td key={i} className="text-right py-2 sm:py-4 px-2 sm:px-4">
                          <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg text-xs font-semibold shadow-md ${
                            metric >= 50 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                          }`}>
                            {metric}
                          </span>
                        </td>
                      ))}

                      <td className="text-right py-2 sm:py-4 px-2 sm:px-4">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <div className="w-12 sm:w-16 bg-zinc-700 rounded-full h-1.5 sm:h-2 overflow-hidden">
                            <div className="bg-[#d0b345] h-1.5 sm:h-2 rounded-full shadow-md" style={{ width: `${coin.moonshot}%` }}></div>
                          </div>
                          <span className="text-xs bg-[#d0b345] bg-clip-text text-transparent font-bold">{coin.moonshot}</span>
                        </div>
                      </td>

                      <td className="py-2 sm:py-4 px-2 sm:px-4">
                        <button
                          onClick={() => addToPortfolio(coin)}
                          className="p-1.5 sm:p-2 bg-[#d0b345] rounded-lg text-xs font-semibold text-white transition-all shadow-lg hover:shadow-xl hover:scale-110 flex items-center mx-auto"
                        >
                          <Plus size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 gap-3 ${themeClasses.text}`}>
            <div className={`text-xs sm:text-sm ${themeClasses.subtext}`}>
              {t("Showing")} {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, coinsWithFlash.length)} {t("of")} {coinsWithFlash.length}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                className={`p-1.5 sm:p-2 rounded-lg ${themeClasses.hover} transition-all ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'} ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-200'}`}>
                <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                    return (
                      <button key={i} onClick={() => handlePageChange(pageNumber)}
                        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                          currentPage === pageNumber ? 'bg-[#d0b345] text-white shadow-lg'
                          : `${isDarkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-gray-200 hover:bg-gray-300'} ${themeClasses.text}`
                        }`}>
                        {pageNumber}
                      </button>
                    );
                  } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return <span key={i} className={`px-1 sm:px-2 ${themeClasses.subtext}`}>...</span>;
                  }
                  return null;
                })}
              </div>

              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                className={`p-1.5 sm:p-2 rounded-lg ${themeClasses.hover} transition-all ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'} ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-200'}`}>
                <ChevronRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Portfolio Sidebar */}
      <div className={`${themeClasses.card} w-full lg:w-96 p-3 sm:p-6 border shadow-lg rounded-lg`}>
        <h2 className={`text-lg sm:text-xl font-bold flex items-center gap-2 mb-4 sm:mb-6 ${themeClasses.text}`}>
          <Award className="text-[#d0b345]" size={20} />
          {t("Portfolio")}
        </h2>

        {enrichedPortfolio.length === 0 ? (
          <div className={`text-center py-8 sm:py-12 ${themeClasses.subtext}`}>
            <Target className="mx-auto mb-4 opacity-50" size={40} />
            <p className="text-sm sm:text-base">{t("No coins added yet")}</p>
            <p className="text-xs sm:text-sm mt-2">{t('Click "+" to build your portfolio')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className={`hidden sm:flex items-center gap-3 px-4 text-xs font-semibold ${themeClasses.subtext} mb-2`}>
              <div className="w-7"></div>
              <div className="w-20">{t("Name")}</div>
              <div className="w-24">{t("Price")}</div>
              <div className="w-16">{t("24h")}</div>
            </div>

            {enrichedPortfolio.map((coin, idx) => (
              <div key={idx} className={`border ${themeClasses.border} rounded-lg px-2 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 transition-all ${themeClasses.hover}`}>
                <button onClick={() => removeFromPortfolio(coin.id)} className="text-zinc-500 hover:text-yellow-400 transition-colors flex-shrink-0">
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                </button>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  {coin.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-xs sm:text-sm ${themeClasses.text}`}>{coin.symbol}</div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold text-xs sm:text-sm ${themeClasses.text}`}>{coin.price}</div>
                </div>
                <div className="text-right w-14 sm:w-16">
                  <div className={`font-semibold text-xs sm:text-sm ${coin.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotCoins;