import React, { useEffect, useState } from 'react';

import { TrendingUp, TrendingDown, AlertCircle, Bell, ChevronRight, Activity, Flame, Target, Clock, Zap, DollarSign, BarChart3, Award, TrendingUp as TrendUp, Calendar, Users, GitBranch, Radio, Moon, Sun, Sparkles } from 'lucide-react';
import RightSide from '../components/RightSide';
import LeftPanel from '../components/LeftPanel';
import MainContent from '../components/MainComponent';
import Search from '../components/Search';
import { useQuery } from '@tanstack/react-query';

import axios from 'axios';

const CryptoDashboard = () => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedCoins, setSelectedCoins] = useState([]); // ✅ moved here

const handleAddToAnalysis = (coin) => {
  console.log('Adding coin:', coin.name);
  console.log('Scores:', { cqs: coin.cqs, ts: coin.ts, ci: coin.ci, ri: coin.ri });
  
  setSelectedCoins((prev) => {
    if (prev.find(c => c.name === coin.name)) {
 
      return prev;
    }
    const newCoins = [...prev, coin];
   
    return newCoins;
  });

  setSelectedCoin(coin);
};

  const handleClearAnalysis = () => setSelectedCoins([]);
  // Replace the static demoCoins with dynamic data from backend


  const { data, isLoading, error } = useQuery({
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
  const { data: globalMarketData } = useQuery({
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
    refetchInterval: 10 * 1000, // every 10 seconds
    staleTime: 10 * 1000, // 1 sec
    retry: 1, // Retry once on failure
  });


  const demoCoins = topCoinsData?.map(coin => ({
    name: coin.name,
    symbol: coin.symbol,
    icon: <img src={coin.logo} alt={coin.symbol} className="w-8 h-8 rounded-full" />,
    cqs: coin.CQS,
    ts: coin.TS,
    ci: coin.CI,
    ri: coin.RI,
    trend: coin.priceChange24h >= 0 ? 'up' : 'down',
    price: `$${coin.price ? (coin.price).toLocaleString() : '0.00'}`, // format price
    change: `${Number(coin.priceChange24h || 0).toFixed(2)}%`,
    narrative: coin.narrative || coin.symbol, // optional, fallback to symbol
    volume: `$${parseFloat(coin.volume).toLocaleString()}`,
    mcap: `$${parseFloat(coin.marketCap).toLocaleString()}`,
    moonshot: coin.Moonshot,
    average: coin.average
  })) || [];
  const altSeasonIndex = altSeasonData?.value ?? 40;
  const fearGreedIndex = data ? parseInt(data.value) : 40;
  const bitcoinHalving = halvingData ? halvingData : { days: 910, blocks: 131000, date: 'Apr 2028' };

  React.useEffect(() => {
    if (!selectedCoin && demoCoins.length > 0) {
      setSelectedCoin(demoCoins[0]);
    }
  }, [demoCoins]);
  const [Loading, setIsLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 1500); // Shows skeleton for 1.5 seconds on page load
  return () => clearTimeout(timer);
}, []);



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
  const ScoreCard = selectedCoin
    ? [
      {
        label: "Coin Quality Score",
        value: selectedCoin.cqs.toFixed(0) ?? 0,
        icon: Award,
        status:
          selectedCoin.cqs > 75
            ? "Top Tier"
            : selectedCoin.cqs > 50
              ? "High Quality"
              : selectedCoin.cqs > 30
                ? "Average"
                : "Low Quality",
      },
      {
        label: "Timing Score",
        value: selectedCoin.ts.toFixed(0) ?? 0,
        icon: Clock,
        status:
          selectedCoin.ts > 70
            ? "Strong Entry"
            : selectedCoin.ts > 40
              ? "Neutral"
              : "Weak Timing",
      },
      {
        label: "Chance Index",
        value: selectedCoin.ci.toFixed(0) ?? 0,
        icon: Target,
        status:
          selectedCoin.ci > 75
            ? "High Chance"
            : selectedCoin.ci > 50
              ? "Moderate"
              : "Low Chance",
      },
      {
        label: "Risk Index",
        value: selectedCoin.ri.toFixed(0) ?? 0,
        icon: AlertCircle,
        status:
          selectedCoin.ri < 40
            ? "Low Risk"
            : selectedCoin.ri < 70
              ? "Medium Risk"
              : "High Risk",
      },
    ]
    : [];

  const narrativeTrends = [
    { name: 'AI', score: 92, trend: 'up', color: 'bg-[#d0b345]' },
    { name: 'DeFi 2.0', score: 78, trend: 'up', color: 'bg-[#d0b345]' },
    { name: 'L2 Scaling', score: 85, trend: 'up', color: 'bg-[#d0b345]' },
    { name: 'GameFi', score: 64, trend: 'down', color: 'bg-[#d0b345]' },
    { name: 'Meme', score: 88, trend: 'up', color: 'bg-[#d0b345]' },
  ];
  const topGainers = demoCoins
    .sort((a, b) => parseFloat(b.change) - parseFloat(a.change))
    .slice(0, 9);





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
            isLoading={Loading}
          />
        </div>

        {/* Main Content Area */}
        <MainContent selectedCoins={selectedCoins}
          onAddToAnalysis={handleAddToAnalysis}
          onClearAnalysis={handleClearAnalysis} onSelectCoin={setSelectedCoin} isDarkMode={isDarkMode} demoCoins={demoCoins} narrativeTrends={narrativeTrends} ScoreCard={ScoreCard} />

        {/* Right Sidebar */}
        <div className="hidden xl:flex w-80 h-full overflow-auto">
          <RightSide isDarkMode={isDarkMode} selectedCoin={selectedCoin} topCoinsData={topCoinsData} isLoading={Loading}/>
        </div>
        {/* <MoonshotFactor /> */}
      </div>
    </div>
  );
};

export default CryptoDashboard;