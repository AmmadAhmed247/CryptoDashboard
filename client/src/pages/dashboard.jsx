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
  const demoCoins = [
    { name: 'KAS', icon: '◆', cqs: 72, ts: 85, ci: 85, ri: 55, trend: 'up', price: '$0.1523', change: '+12.4%', narrative: 'PoW', volume: '$45.2M', mcap: '$1.2B', moonshot: 78 },
    { name: 'ETH', icon: '◈', cqs: 85, ts: 78, ci: 82, ri: 45, trend: 'up', price: '$2,340', change: '+8.2%', narrative: 'L1', volume: '$2.1B', mcap: '$281B', moonshot: 62 },
    { name: 'BTC', icon: '₿', cqs: 92, ts: 75, ci: 80, ri: 42, trend: 'up', price: '$45,230', change: '+5.1%', narrative: 'Store', volume: '$8.4B', mcap: '$890B', moonshot: 45 },
    { name: 'QUBIC', icon: '◇', cqs: 55, ts: 70, ci: 75, ri: 70, trend: 'up', price: '$0.0034', change: '+25.6%', narrative: 'AI', volume: '$12.8M', mcap: '$340M', moonshot: 85 },
    { name: 'LINK', icon: '⬡', cqs: 78, ts: 68, ci: 72, ri: 58, trend: 'down', price: '$14.82', change: '-3.2%', narrative: 'Oracle', volume: '$120M', mcap: '$8.2B', moonshot: 68 },
    { name: 'SOL', icon: '◐', cqs: 80, ts: 82, ci: 83, ri: 48, trend: 'up', price: '$98.45', change: '+15.3%', narrative: 'L1', volume: '$890M', mcap: '$42B', moonshot: 71 },
    { name: 'MATIC', icon: '◮', cqs: 74, ts: 76, ci: 78, ri: 52, trend: 'up', price: '$0.82', change: '+9.8%', narrative: 'L2', volume: '$340M', mcap: '$7.6B', moonshot: 73 },
  ];
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

  const altSeasonIndex = altSeasonData?.value ?? 40;
  const fearGreedIndex = data ? parseInt(data.value) : 40; 
  const bitcoinHalving = halvingData ? halvingData : { days: 910, blocks: 131000, date: 'Apr 2028' };

  const marketMetrics = [
    { label: 'Total Market Cap', value: '$1.89T', change: '+4.2%', icon: DollarSign },
    { label: 'BTC Dominance', value: '47.2%', change: '-1.3%', icon: BarChart3 },
    { label: '24h Volume', value: '$89.2B', change: '+12.4%', icon: Activity },
    { label: 'Active Addresses', value: '1.2M', change: '+8.7%', icon: Users },
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