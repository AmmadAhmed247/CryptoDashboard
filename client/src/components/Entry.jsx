import React from 'react';
import {
  Rocket,
  Star,
  TrendingUp,
  AlertTriangle,
  PauseCircle,
  Ban,
} from "lucide-react";

// Entry Recommendation Logic
const getEntryRecommendation = (average) => {
  if (average >= 80) {
    return {
      recommendation: "Strong Entry Signal",
      position: "30-40%",
      signal: "Aggressive Buy",
      color: "green",
      icon: Rocket,
      description: "Excellent fundamentals + optimal timing"
    };
  } else if (average >= 70) {
    return {
      recommendation: "Good Entry Point",
      position: "20-30%",
      signal: "Strong Buy",
      color: "green",
      icon: Star,
      description: "Strong fundamentals + favorable timing"
    };
  } else if (average >= 60) {
    return {
      recommendation: "Moderate Entry",
      position: "15-20%",
      signal: "Buy",
      color: "emerald",
      icon: TrendingUp,
      description: "Good fundamentals + decent timing"
    };
  } else if (average >= 50) {
    return {
      recommendation: "Cautious Entry",
      position: "10-15%",
      signal: "Small Buy",
      color: "yellow",
      icon: AlertTriangle,
      description: "Average fundamentals + neutral timing"
    };
  } else if (average >= 30) {
    return {
      recommendation: "Wait & Watch",
      position: "5-10%",
      signal: "Hold",
      color: "orange",
      icon: PauseCircle,
      description: "Below average conditions - monitor closely"
    };
  } else {
    return {
      recommendation: "Avoid Entry",
      position: "0-5%",
      signal: "Do Not Buy",
      color: "red",
      icon: Ban,
      description: "Poor fundamentals - wait for better conditions"
    };
  }
};

// Component
const EntryRecommendation = ({ average, isDarkMode }) => {
  const entry = getEntryRecommendation(average);
  const Icon = entry.icon; 

  // Color mapping for Tailwind classes
  const colorClasses = {
    green: {
      bg: isDarkMode ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300',
      text: 'text-green-400',
      glow: 'drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]'
    },
    emerald: {
      bg: isDarkMode ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-700' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300',
      text: 'text-emerald-400',
      glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]'
    },
    yellow: {
      bg: isDarkMode ? 'bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border-yellow-700' : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300',
      text: 'text-yellow-400',
      glow: 'drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]'
    },
    orange: {
      bg: isDarkMode ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-700' : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-300',
      text: 'text-orange-400',
      glow: 'drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]'
    },
    red: {
      bg: isDarkMode ? 'bg-gradient-to-r from-red-900/30 to-rose-900/30 border-red-700' : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300',
      text: 'text-red-400',
      glow: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]'
    }
  };

  const colors = colorClasses[entry.color];

  return (
    <div className={`${colors.bg} rounded-lg p-3 border mb-4 shadow-md transition-all duration-300`}>
      <div className={`text-xs mb-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
        Entry Recommendation ({average.toFixed(1)})
      </div>

      <div className={`${colors.text} font-semibold mb-2 flex items-center gap-2 ${colors.glow}`}>
        <Icon className="w-4 h-4" /> {/* Lucide icon rendered here */}
        {entry.signal}
      </div>

      <div className={`text-sm font-bold ${isDarkMode ? 'text-zinc-200' : 'text-gray-800'} mb-1`}>
        Position Size: {entry.position} of Portfolio
      </div>

      <div className={`text-xs mt-2 ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
        {entry.description}
      </div>
    </div>
  );
};

export default EntryRecommendation;
