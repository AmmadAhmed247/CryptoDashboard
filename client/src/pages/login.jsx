import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Facebook, Twitter, Chrome } from "lucide-react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContex"; // ✅ for global auth state
import toast from "react-hot-toast";
const Login = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const { setUser } = useAuth(); // ✅ from context

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --------------------- LOGIN MUTATION ---------------------
  const loginMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${backendurl}/api/auth/login`, data, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Login successful!');
      setMessage(data.message);
      console.log("Login success:", data);

    
      setUser(data.user);

   
      setTimeout(onClose, 1000);
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || "Login Failed");

      toast.error(err.response?.data?.message || "Login Failed ");
    },
  });

  // --------------------- REGISTER MUTATION ---------------------
  const registerMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post(`${backendurl}/api/auth/register`, data, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setMessage(data.message);
      console.log("✅ User registered:", data.user);

      // ✅ Automatically set user after signup
      setUser(data.user);

      setTimeout(onClose, 1000);
    },
    onError: (err) => {
      setMessage(err.response?.data?.message || "Signup Failed");
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
      toast.success(res.data.message || 'Signup successful!');

    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  // --------------------- MODAL UI ---------------------
  const modalContent = (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
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
            Log In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`pb-2 mx-4 text-lg font-medium transition ${
              !isLogin ? "text-[#d0b345] border-b-2 border-[#d0b345]" : "text-zinc-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-sm text-zinc-400 mb-1">Username</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInput}
                placeholder="Choose a username"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d0b345]"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-1">Email</label>
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
            <label className="block text-sm text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInput}
              placeholder={isLogin ? "Enter password" : "Create password"}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#d0b345]"
              required
            />
          </div>

          {isLogin && (
            <div className="text-right mb-4">
              <button type="button" className="text-xs text-[#d0b345] hover:underline">
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg font-semibold transition ${
              isLoading
                ? "bg-zinc-600 text-zinc-300 cursor-not-allowed"
                : "bg-[#d0b345] hover:bg-[#c0a63e] text-zinc-900"
            }`}
          >
            {isLoading
              ? "Processing..."
              : isLogin
              ? "Log In"
              : "Create Account"}
          </button>
        </form>

        {message && (
          <p className="text-center text-sm mt-3 text-[#d0b345]">{message}</p>
        )}

        <div className="flex items-center my-5">
          <div className="flex-grow border-t border-zinc-700"></div>
          <span className="mx-3 text-xs text-zinc-500">OR</span>
          <div className="flex-grow border-t border-zinc-700"></div>
        </div>

        <div className="flex justify-center gap-5 mt-5">
          <Chrome className="text-zinc-400 hover:text-[#d0b345] cursor-pointer transition" size={20} />
          <Twitter className="text-zinc-400 hover:text-[#d0b345] cursor-pointer transition" size={20} />
          <Facebook className="text-zinc-400 hover:text-[#d0b345] cursor-pointer transition" size={20} />
        </div>

        <p className="text-[11px] text-zinc-500 mt-5 text-center leading-snug">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setIsLogin(false)}
                className="text-[#d0b345] cursor-pointer hover:underline font-semibold"
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              By signing up, you agree to our{" "}
              <span className="text-[#d0b345] cursor-pointer hover:underline">
                Terms
              </span>{" "}
              and{" "}
              <span className="text-[#d0b345] cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Login;
