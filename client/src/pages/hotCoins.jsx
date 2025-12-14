import React, { useEffect, useState } from 'react';
import { Flame, Target, Award, Trash2, Plus ,Zap} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContex';
import { useTranslation } from 'react-i18next';

const HotCoins = () => {
  const { isDarkMode } = useTheme();
  const [portfolio, setPortfolio] = useState([]);
  const { user } = useAuth();
  const { t } = useTranslation();

  const { data: topCoinsData, isLoading, error } = useQuery({
    queryKey: ['topCoins'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/top-coins`);
      return res.data.data;
    },
    refetchInterval: 10 * 1000,
    staleTime: 10 * 1000,
    retry: 1,
  });

  const demoCoins =
    topCoinsData?.map(coin => ({
      id: coin.coinId,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      logo: coin.logo,
      icon: <img src={coin.logo} alt={coin.symbol} className="w-8 h-8 rounded-full" />,
      cqs: coin.CQS.toFixed(0),
      ts: coin.TS.toFixed(0),
      ci: coin.CI.toFixed(0),
      ri: coin.RI.toFixed(0),
      trend: coin.priceChange24h >= 0 ? 'up' : 'down',
      price: `$${coin.price ? coin.price.toLocaleString() : '0.00'}`,
      change: `${Number(coin.priceChange24h || 0).toFixed(2)}%`,
      narrative: coin.narrative || coin.symbol,
      volume: `$${parseFloat(coin.volume).toLocaleString()}`,
      mcap: `$${parseFloat(coin.marketCap).toLocaleString()}`,
      moonshot: coin.Moonshot.toFixed(0),
      average: coin.average,
    })) || [];
    

const sortedCoins = [...demoCoins].sort((a, b) => {
  if (a.symbol === 'BTC') return -1;
  if (b.symbol === 'BTC') return 1;
  if (a.symbol === 'KAS') return -1;
  if (b.symbol === 'KAS') return 1;
  const mcapA = parseFloat(a.mcap.replace(/[$,]/g, '')) || 0;
  const mcapB = parseFloat(b.mcap.replace(/[$,]/g, '')) || 0;
  return mcapB - mcapA;
});



  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/portfolio`, { withCredentials: true });
        setPortfolio(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  const enrichedPortfolio = portfolio.map(portfolioCoin => {
    const matchingCoin = demoCoins.find(c => c.id === portfolioCoin.id);
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
          price: parseFloat(coin.price.replace(/[$,]/g, '')),
          change24h: parseFloat(coin.change.replace('%', '')),
          logo: coin.logo
        },
        { withCredentials: true }
      );

      setPortfolio(response.data);
      toast.success(t("Coin added to portfolio"));

    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(t("Please login to add coins to portfolio"));
      } else if (error.response?.status === 400) {
        toast.info(t("Coin already in portfolio"));
      } else {
        toast.error(error.response?.data?.message || t("Failed to add coin"));
      }
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
      console.error(err);
      toast.error(t("Failed to remove coin"));
    }
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
    <div className={`flex gap-6 p-6 h-fit ${themeClasses.bg}`}>
      {/* LEFT SIDE (Hot Coins Table) */}
      <div className={`${themeClasses.card} flex-1 p-6 border shadow-lg rounded-lg`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold flex items-center gap-2 ${themeClasses.text}`}>
            <Zap className="text-[#d0b345]" />
            {t("Top Coins")}
          </h2>
          {/* <div className="flex gap-2">
            {['All', 'High CI', 'Low Risk'].map(filter => (
              <button
                key={filter}
                className={`px-4 py-2 ${isDarkMode ? 'bg-zinc-700 hover:bg-zinc-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg text-sm transition-all hover:scale-105 shadow-md font-semibold ${themeClasses.text}`}>
                {t(filter)}
              </button>
            ))}
          </div> */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={themeClasses.border + ' border-b'}>
                {[
                  'Coin', 'Price', '24h', 'Volume', 'CQS', 'TS', 'CI', 'RI', 'Moonshot', 'Action'
                ].map((head, i) => (
                  <th
                    key={i}
                    className={`${i === 0 ? 'text-left' : 'text-right'} py-3 px-4 text-sm font-semibold ${themeClasses.subtext}`}>
                    {t(head)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
  {sortedCoins.map((coin, idx) => (
    <tr
      key={idx}
      className={`${themeClasses.border} border-b ${themeClasses.hover} transition-all cursor-pointer group`}>
      <td className="py-4 px-4">
        <Link
          to={`https://coinmarketcap.com/currencies/${coin.id || coin.name.toLowerCase().replace(/\s+/g, '-')}`}
          target="_blank"
          className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
            {coin.icon}
          </div>
          <div>
            <div className={`font-semibold ${themeClasses.text}`}>{coin.name}</div>
            <div className={`text-xs ${themeClasses.subtext}`}>{coin.narrative}</div>
          </div>
        </Link>
      </td>
      <td className={`text-right py-4 px-4 font-semibold ${themeClasses.text}`}>{coin.price}</td>
      <td className="text-right py-4 px-4">
        <span className={`font-semibold ${coin.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {coin.change}
        </span>
      </td>
      <td className={`text-right py-4 px-4 ${themeClasses.subtext}`}>{coin.volume}</td>
      {[coin.cqs, coin.ts, coin.ci, coin.ri].map((metric, i) => (
        <td key={i} className="text-right py-4 px-4">
          <span className={`px-2 py-1 rounded-lg text-xs font-semibold shadow-md ${
            metric >= 50 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
          }`}>{metric}</span>
        </td>
      ))}
      <td className="text-right py-4 px-4">
        <div className="flex items-center justify-end gap-2">
          <div className="w-16 bg-zinc-700 rounded-full h-2 overflow-hidden">
            <div className="bg-[#d0b345] h-2 rounded-full shadow-md" style={{ width: `${coin.moonshot}%` }}></div>
          </div>
          <span className="text-xs bg-[#d0b345] bg-clip-text text-transparent font-bold">{coin.moonshot}</span>
        </div>
      </td>
      <td className="py-4 px-4 flex justify-center">
        <button
          onClick={() => addToPortfolio(coin)}
          className="p-2 bg-[#d0b345] rounded-lg text-xs font-semibold text-white transition-all shadow-lg hover:shadow-xl hover:scale-110 flex items-center">
          <Plus size={16} />
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>

      {/* RIGHT SIDE (Portfolio) */}
      <div className={`${themeClasses.card} w-96 p-6 border shadow-lg rounded-lg`}>
        <h2 className={`text-xl font-bold flex items-center gap-2 mb-6 ${themeClasses.text}`}>
          <Award className="text-[#d0b345]" />
          {t("Portfolio")}
        </h2>

        {enrichedPortfolio.length === 0 ? (
          <div className={`text-center py-12 ${themeClasses.subtext}`}>
            <Target className="mx-auto mb-4 opacity-50" size={48} />
            <p>{t("No coins added yet")}</p>
            <p className="text-sm mt-2">{t('Click "+" to build your portfolio')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className={`flex items-center gap-3 px-4 text-xs font-semibold ${themeClasses.subtext} mb-2`}>
              <div className="w-7"></div>
              <div className="w-20">{t("Name")}</div>
              <div className="w-24">{t("Price")}</div>
              <div className="w-16">{t("24h")}</div>
            </div>

            {enrichedPortfolio.map((coin, idx) => (
              <div
                key={idx}
                className={`border ${themeClasses.border} rounded-lg px-4 py-3 flex items-center gap-3 transition-all ${themeClasses.hover}`}>
                <button
                  onClick={() => removeFromPortfolio(coin.id)} 
                  className="text-zinc-500 hover:text-yellow-400 transition-colors w-4">
                  <Trash2 size={16} />
                </button>

                <div className="w-9 h-9 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  {coin.icon}
                </div>

                <div className="w-12">
                  <div className={`font-semibold text-sm ${themeClasses.text}`}>{coin.symbol}</div>
                </div>

                <div className="w-24 text-left">
                  <div className={`font-semibold text-sm ${themeClasses.text}`}>{coin.price}</div>
                </div>

                <div className="w-16 text-left">
                  <div className={`font-semibold text-sm ${coin.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
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
