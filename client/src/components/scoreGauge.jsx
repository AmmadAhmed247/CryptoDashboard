import React from 'react'
import { TrendingUp, TrendingDown, AlertCircle, Bell, ChevronRight, Activity, Flame, Target, Clock, Zap, DollarSign, BarChart3, Award, TrendingUp as TrendUp, Calendar, Users, GitBranch, Radio, Moon, Sun, Sparkles } from 'lucide-react';


  const ScoreGauge = ({ value, label, size = 'md', isDarkMode }) => {
  const radius = size === 'sm' ? 35 : 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    const getColor = () => {
      if (value >= 70) return 'url(#greenGradient)';
      if (value >= 50) return 'url(#yellowGradient)';
      return 'url(#redGradient)';
    };

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <svg width={size === 'sm' ? 90 : 120} height={size === 'sm' ? 90 : 120}>
            <defs>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle
              cx={size === 'sm' ? 45 : 60}
              cy={size === 'sm' ? 45 : 60}
              r={radius}
              stroke={isDarkMode ? "#27272a" : "#e5e7eb"}
              strokeWidth={size === 'sm' ? 6 : 8}
              fill="none"
            />
            <circle
              cx={size === 'sm' ? 45 : 60}
              cy={size === 'sm' ? 45 : 60}
              r={radius}
              stroke={getColor()}
              strokeWidth={size === 'sm' ? 6 : 8}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size === 'sm' ? 45 : 60} ${size === 'sm' ? 45 : 60})`}
              filter="url(#glow)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-bold ${size === 'sm' ? 'text-xl' : 'text-3xl'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</span>
          </div>
        </div>
        <div className={`text-xs mt-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-500'}`}>{label}</div>
      </div>
    );
  };
  


export default ScoreGauge