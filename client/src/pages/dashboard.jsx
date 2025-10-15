import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Bell, ChevronRight, Activity, Flame, Target, Clock, Zap, DollarSign, BarChart3, Award, TrendingUp as TrendUp, Calendar, Users, GitBranch, Radio, Moon, Sun, Sparkles } from 'lucide-react';
import RightSide from '../components/RightSide';
import LeftPanel from '../components/LeftPanel';
import MainContent from '../components/MainComponent';
import Search from '../components/Search';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';  
const CryptoDashboard = () => {
  const [selectedCoin, setSelectedCoin] = useState('KAS');
  const [isDarkMode, setIsDarkMode] = useState(true);
  // Replace the static demoCoins with dynamic data from backend


  const {data , isLoading, error} =useQuery({
    queryKey: ['fearGreedIndex'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/data/feargreed`);
      return res.data;
    },
    refetchInterval: 1000 * 60 * 60, //every 1 hour
  });
  const { data: halvingData } = useQuery({
    queryKey: ['halvingData'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/data/halving`);
      return res.data;
    },
    refetchInterval: 1000 * 60 * 30, //every 1 minute
  });
  const { data: altSeasonData } = useQuery({
    queryKey: ['altSeasonData'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/data/altseason`);
      return res.data;
    },
    refetchInterval: 1000 * 60 * 10,
    staleTime: 1000 * 60 * 10,
    retry: 2, 
  });
  const {data: globalMarketData} = useQuery({
    queryKey: ['globalMarketData'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/data/globalmarket`);
      return res.data;
    },
    refetchInterval: 1000 * 60 * 30, //every 30 minutes
  });
  const { data: topCoinsData, isLoading: coinsLoading, error: coinsError } = useQuery({
    queryKey: ['topCoins'],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/top-coins`);
      return res.data.data; // assuming your controller returns { success, data }
    },
    refetchInterval: 2 * 60 * 1000, // every 2 mins for live price updates
    staleTime: 60 * 1000, // 1 min
    retry: 2,
  });
  
  
  const demoCoins = topCoinsData?.map(coin => ({
  name: coin.name,
  icon: <img src={coin.logo} alt={coin.symbol} className="w-6 h-6 rounded-full" />, // show logo
  cqs: coin.CQS,
  ts: coin.TS,
  ci: coin.CI,
  ri: coin.RI,
  trend: coin.priceChange24h >= 0 ? 'up' : 'down',
  price: `$${coin.price ? (coin.price).toLocaleString() : '0.00'}`, // format price
  change: `${coin.priceChange24h >= 0 ? '+' : ''}${coin.priceChange24h.toFixed(2)}%`,
  narrative: coin.narrative || coin.symbol, // optional, fallback to symbol
  volume: `$${parseFloat(coin.volume).toLocaleString()}`,
  mcap: `$${parseFloat(coin.marketCap).toLocaleString()}`,
  moonshot: coin.Moonshot
})) || [];

  const altSeasonIndex = altSeasonData?.value ?? 40;
  const fearGreedIndex = data ? parseInt(data.value) : 40; 
  const bitcoinHalving = halvingData ? halvingData : { days: 910, blocks: 131000, date: 'Apr 2028' };

  const marketMetrics = [
  {
    label: 'Total Market Cap',
    value: globalMarketData?.total_market_cap?.value ?? '$0',
    change: globalMarketData?.total_market_cap?.change_24h ?? '0%',
    icon: DollarSign,
  },
  {
    label: 'BTC Dominance',
    value: globalMarketData?.btc_dominance?.value ?? '0%',
    change: globalMarketData?.btc_dominance?.change_24h ?? '0%',
    icon: BarChart3,
  },
  {
    label: '24h Volume',
    value: globalMarketData?.total_volume_24h?.value ?? '$0',
    change: globalMarketData?.total_volume_24h?.change_24h ?? '0%',
    icon: Activity,
  },
  {
    label: 'Active Cryptos',
    value: globalMarketData?.active_cryptocurrencies ?? '0',
    change: 'N/A',
    icon: Users,
  },
];

  const narrativeTrends = [
    { name: 'AI', score: 92,  trend: 'up', color: 'bg-[#d0b345]' },
    { name: 'DeFi 2.0', score: 78,  trend: 'up', color: 'bg-[#d0b345]' },
    { name: 'L2 Scaling', score: 85,  trend: 'up', color: 'bg-[#d0b345]' },
    { name: 'GameFi', score: 64,  trend: 'down', color: 'bg-[#d0b345]' },
    { name: 'Meme', score: 88,  trend: 'up', color: 'bg-[#d0b345]' },
  ];

  const topGainers = demoCoins.filter(c => parseFloat(c.change) > 0).slice(0, 7);



  

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-gray-50 text-gray-900'} transition-all duration-300`}>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#18181b' : '#f3f4f6'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: gray;
          border-radius: 10px;
          transition: all 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: gray;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Top Bar */}


      {/* Navigation */}
     

      {/* Main Content */}
      <div className="flex h-full relative">
        {/* Left Sidebar */}
        <div className="hidden lg:flex w-64 h-full overflow-auto">
    <LeftPanel
      isDarkMode={isDarkMode}
      fearGreedIndex={fearGreedIndex}
      bitcoinHalving={bitcoinHalving}
      altSeasonIndex={altSeasonIndex}
      marketMetrics={marketMetrics}
      topGainers={topGainers}
    />
  </div>

        {/* Main Content Area */}
        <MainContent isDarkMode={isDarkMode} demoCoins={demoCoins} narrativeTrends={narrativeTrends} />
      
        {/* Right Sidebar */}
        <div className="hidden xl:flex w-80 h-full overflow-auto">
    <RightSide isDarkMode={isDarkMode} selectedCoin={selectedCoin} />
  </div>
        {/* <MoonshotFactor /> */}
      </div>
    </div>
  );
};

export default CryptoDashboard;