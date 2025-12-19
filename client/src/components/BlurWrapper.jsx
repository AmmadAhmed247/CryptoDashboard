import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const BlurWrapper = ({ children }) => {
  const { user, loading, setRedirectToCheckout } = useAuth();
    const navigate = useNavigate();
  const handleUpgrade = () => {
    if (!user) {
      // User is not logged in → go to signup/login page
       setRedirectToCheckout(true);
      navigate("/login"); // or /signup if you have a separate route
      return;
    }
    // User is logged in → redirect to Systeme.io checkout
    window.location.href = `${import.meta.env.VITE_CHECKOUT_URL}?email=${user.email}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#d0b345]/30 border-t-[#d0b345] rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-yellow-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
      </div>
    );
  }

  const isPaid = user?.buyStatus;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Dashboard / Children */}
      <div className={`transition-all duration-500 ${!isPaid ? 'blur-sm scale-[0.98] pointer-events-none select-none' : ''}`}>
        {children}
      </div>

      {/* Overlay for non-paid users */}
      {!isPaid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          {/* Animated gradient orbs in background */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d0b345]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Premium card */}
          <div className="relative max-w-lg w-full bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#d0b345]/30 overflow-hidden">
            {/* Animated border gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#d0b345] via-yellow-600 to-[#d0b345] opacity-20 blur-xl animate-pulse"></div>
            
            {/* Content */}
            <div className="relative p-8 md:p-12">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#d0b345] to-yellow-600 rounded-2xl flex items-center justify-center transform rotate-6 shadow-lg shadow-[#d0b345]/50">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#d0b345] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-[#d0b345] via-yellow-500 to-[#d0b345] bg-clip-text text-transparent">
                Schalte Premium frei

              </h2>
              
              {/* Subtitle */}
              <p className="text-zinc-300 text-center mb-8 text-lg">
                Führen Sie ein Upgrade durch, um auf das vollständige Dashboard zuzugreifen und alle Premium-Funktionen freizuschalten.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {[
                  'Vollständiger Dashboard-Zugriff',
                  'Fortgeschrittene Analysen und Erkenntnisse',
                  'Vorrangiger Support',
                  'Unbegrenzte Funktionen'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-zinc-200">
                    <div className="w-5 h-5 bg-gradient-to-br from-[#d0b345] to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={handleUpgrade
                }
                className="w-full bg-gradient-to-r from-[#d0b345] via-yellow-600 to-[#d0b345] text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-[#d0b345]/50 hover:shadow-[#d0b345]/70 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <span>Upgrade Now</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>

             
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlurWrapper;