import React, { useState } from 'react'
import { TrendingUp, TrendingDown, AlertCircle, Bell, ChevronRight, Activity, Flame, Target, Clock, Zap, DollarSign, BarChart3, Award, TrendingUp as TrendUp, Calendar, Users, GitBranch, Radio, Moon, Sun, Sparkles } from 'lucide-react';
import Search from './Search';
const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  return (
     <div className={`${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-gray-200'} border-b px-6 py-3 shadow-xl backdrop-blur-sm`}>
  <div className="flex justify-between items-center gap-4">
    
    {/* Left Section */}
    <div className="flex items-center gap-8">
      <div className="flex gap-2 items-center">
      <img src="Logo.png" className=' w-fit rounded-2xl h-12' alt="" />
      <h1 className="text-3xl text-[#d0b345] bg-clip-text  font-semibold   ">
        MEIN KRYPTO
      </h1>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
          </div>
          <span className={isDarkMode ? 'text-zinc-400' : 'text-gray-600'}>Live</span>
        </div>
        <div className={isDarkMode ? 'text-zinc-500' : 'text-gray-400'}>|</div>
        <span className={isDarkMode ? 'text-zinc-400' : 'text-gray-600'}>Oct 5, 2024 13:45 UTC</span>
      </div>
    </div>

    {/* Middle Section - Search Bar */}
    <Search isDarkMode={isDarkMode} />

    {/* Right Section */}
    <div className="flex items-center gap-3">
      <div className={`${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-100 border-gray-300'} px-4 py-2 rounded-lg border text-sm shadow-md`}>
        <span className={isDarkMode ? 'text-zinc-400' : 'text-gray-600'}>Cycle: </span>
        <span className={isDarkMode ? 'text-[#d0b345]' : 'text-zinc-600'}>Early Bear</span>
      </div>
      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-200 hover:bg-gray-300'} p-2 rounded-lg transition-all shadow-md hover:scale-110`}
      >
        {isDarkMode ? <Sun size={18} className="text-[#d0b345] font-semibold" /> : <Moon size={18} className="text-zinc-600" />}
      </button>
      <button className={isDarkMode ? ' text-[#d0b345] p-2 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-110' : 'text-zinc-500 p-2 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-110'}>
        <Bell size={18} />
      </button>
    </div>

  </div>
   <div className={`${isDarkMode ? 'bg-zinc-900 border-zinc-800 ' : 'bg-white border-gray-200'} rounded-2xl mt-2 border-b px-6 shadow-md backdrop-blur-sm`}>
        <div className="flex gap-1">
          {['Dashboard', 'Hot Coins', 'Moonshot', 'Portfolio', ].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-6 py-4 font-semibold transition-all relative group ${
                activeTab === tab.toLowerCase()
                  ? 'text-[#d0b345] bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text'
                  : isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg shadow-pink-500/50"></div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-100 opacity-0 group-hover:opacity-50 transition-all"></div>
            </button>
          ))}
        </div>
      </div>
</div>
  )
}

export default Navbar