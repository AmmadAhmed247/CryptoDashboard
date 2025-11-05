import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Sun, Moon, Menu, X } from "lucide-react";
import LiveStatus from "./Time";
import Login from "../pages/login";
import { useAuth } from "../context/AuthContex";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, setUser, loading } = useAuth(); // ✅ Get user, setter, and loading from context
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  // -------------------- LOGOUT FUNCTION --------------------
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${backendurl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message || "Logged out successfully ✅");
      setUser(null); // ✅ Clear user context
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error(err.response?.data?.message || "Logout failed ❌");
    }
  };

  return (
    <div
      className={`${
        isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-200"
      } border-b px-6 py-3 shadow-xl backdrop-blur-sm`}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <div className="flex gap-2 items-center">
            <img
              src="Logo.png"
              alt="Logo"
              className="w-fit h-12 rounded-2xl animate-slowspin"
            />
            <Link to={"/"} className="text-3xl text-[#d0b345] font-semibold">
              MEIN KRYPTO
            </Link>
          </div>
          <LiveStatus />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`${
              isDarkMode
                ? "bg-zinc-800 hover:bg-zinc-700"
                : "bg-gray-200 hover:bg-gray-300"
            } p-2 rounded-lg transition-all shadow-md hover:scale-110`}
          >
            {isDarkMode ? (
              <Sun size={18} className="text-[#d0b345]" />
            ) : (
              <Moon size={18} className="text-zinc-600" />
            )}
          </button>

          {/* ✅ LOGIN / LOGOUT BUTTON - FIXED LOGIC */}
          <div>
            {loading ? (
              // Show loading state while checking auth
              <div
                className={`hidden md:block px-4 py-2 rounded-lg font-semibold text-sm ${
                  isDarkMode ? "text-zinc-500" : "text-gray-400"
                }`}
              >
                Loading...
              </div>
            ) : user ? (
              // ✅ User is logged in - show LOGOUT button
              <button
                onClick={handleLogout}
                className={`hidden md:block px-4 py-2 rounded-lg font-semibold text-sm shadow-md transition-all ${
                  isDarkMode
                    ? "bg-[#d0b345]/20 text-[#d0b345] hover:bg-[#d0b345]/30"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                Logout
              </button>
            ) : (
              // ✅ No user - show LOGIN button
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className={`hidden md:block px-4 py-2 rounded-lg font-semibold text-sm shadow-md transition-all ${
                    isDarkMode
                      ? "bg-[#d0b345]/20 text-[#d0b345] hover:bg-[#d0b345]/30"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  Login
                </button>
                {showLogin && <Login onClose={() => setShowLogin(false)} />}
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#d0b345] hover:bg-zinc-800 transition"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Bottom Tabs */}
      <div
        className={`${
          isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
        } rounded-2xl mt-2 border-b px-6 shadow-md backdrop-blur-sm hidden md:block`}
      >
        <div className="flex gap-1">
          {["Dashboard", "Top Coins"].map((tab) => (
            <Link
              to={
                tab === "Dashboard"
                  ? "/"
                  : `/${tab.toLowerCase().replace(" ", "")}`
              }
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-6 py-4 font-semibold transition-all relative group ${
                activeTab === tab.toLowerCase()
                  ? "text-[#d0b345] bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text"
                  : isDarkMode
                  ? "text-zinc-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-500/50"></div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-100 opacity-0 group-hover:opacity-50 transition-all"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div
          className={`md:hidden mt-3 rounded-xl border p-4 shadow-lg ${
            isDarkMode
              ? "bg-zinc-900 border-zinc-800"
              : "bg-white border-gray-200"
          }`}
        >
          {/*MOBILE LOGIN/LOGOUT */}
          {loading ? (
            <div
              className={`px-4 py-2 text-sm ${
                isDarkMode ? "text-zinc-500" : "text-gray-400"
              }`}
            >
              Loading...
            </div>
          ) : user ? (
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-lg font-semibold text-sm shadow-md transition-all ${
                isDarkMode
                  ? "text-[#d0b345] hover:underline"
                  : "bg-gray-200 text-gray-800 hover:underline"
              }`}
            >
              Logout
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm shadow-md transition-all ${
                  isDarkMode
                    ? "text-[#d0b345] hover:underline"
                    : "bg-gray-200 text-gray-800 hover:underline"
                }`}
              >
                Login
              </button>
              {showLogin && <Login onClose={() => setShowLogin(false)} />}
            </>
          )}

          <Link
            className="block px-3 py-2 text-sm font-semibold text-[#d0b345] hover:underline"
            to={"/"}
          >
            Dashboard
          </Link>
          <Link
            className="block px-3 py-2 text-sm font-semibold text-[#d0b345] hover:underline"
            to={"/topcoins"}
          >
            TopCoins
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;