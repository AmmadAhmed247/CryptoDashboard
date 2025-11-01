import React, { useState } from 'react';
import axios from 'axios';
import { Target } from 'lucide-react';

const Alert = ({ isDarkMode }) => {
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState('above');
  const [loading, setLoading] = useState(false);

  const handleSetAlert = async () => {
    try {
      setLoading(true);
      const email = "ammadwork123@gmail.com"; // later, get this from logged-in user
      const coin = "bitcoin"; // you can make this dynamic later

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/alerts`, {
        email,
        coin,
        targetPrice: Number(targetPrice),
        condition,
      });

      alert("✅ Alert set successfully!");
      setTargetPrice('');
    } catch (err) {
      console.error(err);
      alert("❌ Failed to set alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={`${isDarkMode ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'} w-70 rounded-xl p-4 border shadow-lg`}>
        <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <Target className="text-[#d0b345]" size={18} />
          Quick Alert Setup
        </h3>
        <div className="space-y-3">
          <div>
            <label className={`text-xs mb-1 block ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>
              Target Price
            </label>
            <input
              type="text"
              placeholder="$0.20"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-orange-500`}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCondition('above')}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${condition === 'above' ? 'bg-[#d0b345] text-white' : (isDarkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-gray-100 hover:bg-gray-200')}`}
            >
              Above
            </button>
            <button
              onClick={() => setCondition('below')}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${condition === 'below' ? 'bg-[#d0b345] text-white' : (isDarkMode ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-gray-100 hover:bg-gray-200')}`}
            >
              Below
            </button>
          </div>

          <button
            onClick={handleSetAlert}
            disabled={loading}
            className="w-full bg-[#d0b345] py-2 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            {loading ? "Setting..." : "Set Alert"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
