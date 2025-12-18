import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirectToCheckout, setRedirectToCheckout] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          withCredentials: true,
        });
        setUser(res.data.user);
        
        // Check if user just logged in and needs to be redirected to checkout
        if (redirectToCheckout && res.data.user && !res.data.user.buyStatus) {
          setRedirectToCheckout(false);
          window.location.href = `${import.meta.env.VITE_CHECKOUT_URL}?email=${res.data.user.email}`;
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [redirectToCheckout]);

  const logout = async () => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading, redirectToCheckout, setRedirectToCheckout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);