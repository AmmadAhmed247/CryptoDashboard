import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Moon, Menu, X, Globe } from "lucide-react";
import LiveStatus from "./Time";
import Login from "../pages/login";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { user, setUser, loading } = useAuth();
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  // -------------------- LOGOUT FUNCTION --------------------
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${backendurl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      toast.success(res.data.message || t("Logout Successfully"));
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error(err.response?.data?.message || t("logout_failed"));
    }
  };

  // -------------------- TOGGLE LANGUAGE MENU --------------------
  const toggleLangMenu = () => {
    const menu = document.getElementById("lang-menu");
    menu.classList.toggle("hidden");
  };

  return (
    <div
      className={`${
  isDarkMode ? "bg-zinc-950 border-zinc-800" : "bg-white border-gray-200"
} border-b px-3 sm:px-6 py-3 shadow-xl backdrop-blur-sm w-full overflow-x-hidden`}>
      {/* Top Bar */}
      <div className="flex justify-between items-center h-full w-full gap-2 sm:gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-8">
          <div className="flex gap-1 sm:gap-2 items-center">
            <img
              src="Logo.png"
              alt="Logo"
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-fit md:h-12 rounded-2xl animate-slowspin"
            />
            <Link to={"/"} className="text-sm sm:text-lg md:text-2xl lg:text-3xl text-[#d0b345] font-semibold whitespace-nowrap">
              MEIN KRYPTO
            </Link>
          </div>
          <div className="hidden md:block">
            <LiveStatus />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher - smaller on mobile */}
          <div className="relative">
            <button
              onClick={toggleLangMenu}
              className={`p-1.5 sm:p-2 rounded-lg transition-all shadow-md hover:scale-110 ${
                isDarkMode
                  ? "bg-zinc-800 hover:bg-zinc-700 text-[#d0b345]"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              <Globe size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>

            <div
              id="lang-menu"
              className={`hidden absolute right-0 mt-2 w-32 rounded-lg shadow-lg z-50 ${
                isDarkMode ? "bg-zinc-900" : "bg-white"
              }`}
            >
              {["en", "de"].map((lng) => (
                <button
                  key={lng}
                  onClick={() => {
                    i18n.changeLanguage(lng);
                    document.getElementById("lang-menu").classList.add("hidden");
                  }}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-md ${
                    isDarkMode
                      ? "text-[#d0b345] hover:bg-zinc-800"
                      : "text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {lng === "en" ? "🇺🇸 English" : "🇩🇪 Deutsch"}
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mode Toggle - smaller on mobile */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`${
              isDarkMode
                ? "bg-zinc-800 hover:bg-zinc-700"
                : "bg-gray-200 hover:bg-gray-300"
            } p-1.5 sm:p-2 rounded-lg transition-all shadow-md hover:scale-110`}
          >
            {isDarkMode ? (
              <Sun size={16} className="sm:w-[18px] sm:h-[18px] text-[#d0b345]" />
            ) : (
              <Moon size={16} className="sm:w-[18px] sm:h-[18px] text-zinc-600" />
            )}
          </button>

          {/* LOGIN / LOGOUT BUTTON - smaller text on mobile */}
          <div>
            {loading ? (
              <div
                className={`hidden md:block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm ${
                  isDarkMode ? "text-zinc-500" : "text-gray-400"
                }`}
              >
                {t("loading")}
              </div>
            ) : user ? (
              <button
                onClick={handleLogout}
                className={`hidden md:block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm shadow-md transition-all ${
                  isDarkMode
                    ? "bg-[#d0b345]/20 text-[#d0b345] hover:bg-[#d0b345]/30"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {t("logout")}
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className={`hidden md:block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm shadow-md transition-all ${
                    isDarkMode
                      ? "bg-[#d0b345]/20 text-[#d0b345] hover:bg-[#d0b345]/30"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {t("login")}
                </button>
                {showLogin && <Login onClose={() => setShowLogin(false)} />}
              </>
            )}
          </div>

          {/* Mobile Menu Toggle - smaller on mobile */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg text-[#d0b345] hover:bg-zinc-800 transition"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className={`${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"} rounded-2xl mt-2 border-b px-6 shadow-md backdrop-blur-sm hidden md:block`}>
        <div className="flex gap-1">
          {[
            { label: t("dashboard"), path: "/" },
            { label: t("topCoins"), path: "/topcoins" },
            { label: t("Bull Signal"), path: "https://www.coinglass.com/bull-market-peak-signals", external: true }
          ].map((tab) => {
            const TabComponent = tab.external ? "a" : Link;
            const linkProps = tab.external 
              ? { href: tab.path, target: "_blank", rel: "noopener noreferrer" }
              : { to: tab.path };
            
            return (
              <TabComponent
                {...linkProps}
                key={tab.label}
                onClick={() => !tab.external && setActiveTab(tab.label.toLowerCase())}
                className={`px-6 py-4 font-semibold transition-all relative group ${
                  activeTab === tab.label.toLowerCase()
                    ? "text-[#d0b345] bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text"
                    : isDarkMode
                    ? "text-zinc-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {activeTab === tab.label.toLowerCase() && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-100 opacity-0 group-hover:opacity-50 transition-all"></div>
              </TabComponent>
            );
          })}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div
          className={`md:hidden w-full mt-3 rounded-xl border p-4 shadow-lg ${
            isDarkMode
              ? "bg-zinc-900 border-zinc-800"
              : "bg-white border-gray-200"
          }`}
        >
          {loading ? (
            <div
              className={`px-4 py-2 text-sm ${
                isDarkMode ? "text-zinc-500" : "text-gray-400"
              }`}
            >
              {t("loading")}
            </div>
          ) : user ? (
            <button
              onClick={handleLogout}
              className={`w-full px-4 py-2 rounded-lg font-semibold text-sm shadow-md transition-all mb-2 ${
                isDarkMode
                  ? "text-[#d0b345] hover:bg-zinc-800"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {t("logout")}
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className={`w-full px-4 py-2 rounded-lg font-semibold text-sm shadow-md transition-all mb-2 ${
                  isDarkMode
                    ? "text-[#d0b345] hover:bg-zinc-800"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {t("login")}
              </button>
              {showLogin && <Login onClose={() => setShowLogin(false)} />}
            </>
          )}

          <Link
            className={`block px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              isDarkMode 
                ? "text-[#d0b345] hover:bg-zinc-800" 
                : "text-gray-800 hover:bg-gray-200"
            }`}
            to={"/"}
            onClick={() => setIsMenuOpen(false)}
          >
            {t("dashboard")}
          </Link>
          <Link
            className={`block px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
              isDarkMode 
                ? "text-[#d0b345] hover:bg-zinc-800" 
                : "text-gray-800 hover:bg-gray-200"
            }`}
            to={"/topcoins"}
            onClick={() => setIsMenuOpen(false)}
          >
            {t("Topcoins")}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;