import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Star,
  TrendingUp,
  AlertTriangle,
  PauseCircle,
  Ban,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import axios from "axios";

const getEntryRecommendation = (average, t) => {
  if (average >= 85) {
    return {
      signal: t("signals.overheating.name"),
      position: "30-40%",
      color: "green",
      icon: Rocket,
      description: t("signals.overheating.action"),
    };
  } else if (average >= 70) {
    return {
      signal: t("signals.strong.name"),
      position: "20-30%",
      color: "green",
      icon: Star,
      description: t("signals.strong.action"),
    };
  } else if (average >= 50) {
    return {
      signal: t("signals.earlyOpportunity.name"),
      position: "15-20%",
      color: "emerald",
      icon: TrendingUp,
      description: t("signals.earlyOpportunity.action"),
    };
  } else if (average >= 40) {
    return {
      signal: t("signals.neutral.name"),
      position: "10-15%",
      color: "yellow",
      icon: AlertTriangle,
      description: t("signals.neutral.action"),
    };
  } else if (average >= 25) {
    return {
      signal: t("signals.weak.name"),
      position: "5-10%",
      color: "orange",
      icon: PauseCircle,
      description: t("signals.weak.action"),
    };
  } else {
    return {
      signal: t("signals.stress.name"),
      position: "0-5%",
      color: "red",
      icon: Ban,
      description: t("signals.stress.action"),
    };
  }
};


const EntryRecommendation = ({ coinId, isDarkMode }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  
  

  useEffect(() => {
    const calculateScore = async () => {
      if (!coinId) {
        console.log('No coinId provided');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/score/${coinId}`;
        console.log('Posting to URL:', url);
        
        const response = await axios.post(url);
        
        // console.log('Response received:', response.data);
        setScoreData(response.data);
        
      } catch (err) {
        console.error('Full error:', err);
        console.error('Error response:', err.response);
        
        const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to calculate score';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    calculateScore();
  }, [coinId]);

  if (loading) {
    return (
      <div className={`${isDarkMode ? 'bg-zinc-800/50 border-zinc-700' : 'bg-gray-100 border-gray-300'} rounded-lg p-3 border mb-4 shadow-md`}>
        <div className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-gray-600"} text-center`}>
          {t("loadingScoreData")}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isDarkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-300'} rounded-lg p-3 border mb-4 shadow-md`}>
        <div className="text-sm text-red-400 text-center">
          {t("error")}: {error}
        </div>
      </div>
    );
  }

  if (!scoreData) return null;

  const finalScore = scoreData.finalScore;
  const entry = getEntryRecommendation(finalScore, t);
  const Icon = entry.icon;

  // Tailwind color classes
  const colorClasses = {
    green: {
      bg: isDarkMode
        ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700'
        : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300',
      text: 'text-green-400',
      glow: 'drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]',
    },
    emerald: {
      bg: isDarkMode
        ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-700'
        : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300',
      text: 'text-emerald-400',
      glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]',
    },
    yellow: {
      bg: isDarkMode
        ? 'bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border-yellow-700'
        : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300',
      text: 'text-yellow-400',
      glow: 'drop-shadow-[0_0_8px_rgba(234,179,8,0.3)]',
    },
    orange: {
      bg: isDarkMode
        ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-700'
        : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-300',
      text: 'text-orange-400',
      glow: 'drop-shadow-[0_0_8px_rgba(249,115,22,0.3)]',
    },
    red: {
      bg: isDarkMode
        ? 'bg-gradient-to-r from-red-900/30 to-rose-900/30 border-red-700'
        : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300',
      text: 'text-red-400',
      glow: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]',
    },
  };

  const colors = colorClasses[entry.color];

  return (
    <div className={`${colors.bg} rounded-lg p-3 border mb-4 shadow-md`}>
      {/* <div className={`text-xs mb-2 ${isDarkMode ? "text-zinc-400" : "text-gray-600"} flex justify-between items-center`}>
        <span>{t("entryRecommendation")} ({average.toFixed(1)})</span>
        <span className="font-medium">{scoreData.marketPhase}</span>
      </div> */}

      <div className={`${colors.text} font-semibold mb-2 flex items-center gap-2 ${colors.glow}`}>
        <Icon className="w-4 h-4" />
        {entry.signal}
      </div>

      {/* <div className={`text-sm font-bold ${isDarkMode ? "text-zinc-200" : "text-gray-800"} mb-1`}>
        {t("positionSize")}: {entry.position}
      </div> */}

      <div className={`text-xs mt-2 ${isDarkMode ? "text-zinc-400" : "text-gray-600"}`}>
        {entry.description}
      </div>
      
      {scoreData.signalLevel && (
        <div className={`text-xs mt-2 pt-2 border-t ${isDarkMode ? "border-zinc-700 text-zinc-500" : "border-gray-200 text-gray-500"}`}>
          {scoreData.marketPhase}
        </div>
      )}
    </div>
  );
};

export default EntryRecommendation;