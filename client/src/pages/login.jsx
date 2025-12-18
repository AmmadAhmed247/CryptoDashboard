import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Facebook, Twitter, Chrome } from "lucide-react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Login = ({ onClose }) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const { setUser, redirectToCheckout, setRedirectToCheckout } = useAuth();

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --------------------- LOGIN MUTATION ---------------------
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${backendurl}/api/auth/login`, data, { withCredentials: true });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || t("Login successful!"));
      toast.error(data.user.buyStatus);
      setMessage(data.message);
      setUser(data.user);
      
      // Check if should redirect to checkout
     if (redirectToCheckout && !data.user.buyStatus) {
        setRedirectToCheckout(false);
        setTimeout(() => {
          window.location.href = `${import.meta.env.VITE_CHECKOUT_URL}?email=${data.user.email}`;
        }, 1000);
      } else if (data.user.buyStatus) {
        // User has paid - redirect to dashboard
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setTimeout(onClose, 1000);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || t("Signup Failed"));
      setMessage(err.response?.data?.message || t("Signup Failed"));
    },
  });

  // --------------------- REGISTER MUTATION ---------------------
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${backendurl}/api/auth/register`, data, { withCredentials: true });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || t("Signup successful!"));
      setMessage(data.message);
      setUser(data.user);
      
      // Check if should redirect to checkout
      if (redirectToCheckout && !data.user.buyStatus) {
        setRedirectToCheckout(false);
        setTimeout(() => {
          window.location.href = `${import.meta.env.VITE_CHECKOUT_URL}?email=${data.user.email}`;
        }, 1000);
      } else if (data.user.buyStatus) {
        // User has paid - redirect to dashboard
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setTimeout(onClose, 1000);
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || t("Signup Failed"));
      setMessage(err.response?.data?.message || t("Signup Failed"));
    },
  });

  // --------------------- HANDLE SUBMIT ---------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    const { name, email, password } = formData;

    if (isLogin) {
      loginMutation.mutate({ email, password });
    } else {
      registerMutation.mutate({ name, email, password });
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  // --------------------- MODAL UI ---------------------
  const modalContent = (
    <div className="fixed inset-0 bg-black/100 flex items-center justify-center z-[9999]">
      <div className="bg-zinc-800 w-[380px] rounded-2xl shadow-2xl p-6 text-white relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
        >
          <X size={22} />
        </button>

        {/* Tabs */}
        <div className="flex justify-center mb-6 border-b border-zinc-700">
          <button
            onClick={() => setIsLogin(true)}
            className={`pb-2 mx-4 text-lg font-medium transition ${
              isLogin ? "text-[#d0b345] border-b-2 border-[#d0b345]" : "text-zinc-400"
            }`}
          >
            {t("Log In")}
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`pb-2 mx-4 text-lg font-medium transition ${
              !isLogin ? "text-[#d0b345] border-b-2 border-[#d0b345]" : "text-zinc-400"
            }`}
          >
            {t("Sign Up")}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-1">{t("Username")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInput}
                placeholder={t("Choose a username")}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d0b345]"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-1">{t("Email")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInput}
              placeholder="user@mail.com"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d0b345]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-1">{t("Password")}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInput}
              placeholder={isLogin ? t("Enter password") : t("Create password")}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d0b345]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg font-semibold transition ${
              isLoading
                ? "bg-zinc-600 text-zinc-300 cursor-not-allowed"
                : "bg-[#d0b345] hover:bg-[#c0a63e] text-zinc-900"
            }`}
          >
            {isLoading ? t("Processing...") : isLogin ? t("Log In") : t("Create Account")}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-3 text-[#d0b345]">{message}</p>
        )}

        <div className="flex items-center my-5">
          <div className="flex-grow border-t border-zinc-700"></div>
          <span className="mx-3 text-xs text-zinc-500">{t("OR")}</span>
          <div className="flex-grow border-t border-zinc-700"></div>
        </div>

        <p className="text-[11px] text-zinc-500 mt-5 text-center leading-snug">
          {isLogin ? (
            <>
              {t("Don't have an account?")}{" "}
              <span
                onClick={() => setIsLogin(false)}
                className="text-[#d0b345] cursor-pointer hover:underline font-semibold"
              >
                {t("Sign Up")}
              </span>
            </>
          ) : (
            <>
              {t("By signing up, you agree to our")}{" "}
              <span className="text-[#d0b345] cursor-pointer hover:underline">{t("Terms")}</span>{" "}
              {t("and")}{" "}
              <span className="text-[#d0b345] cursor-pointer hover:underline">{t("Privacy Policy")}</span>
            </>
          )}
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Login;