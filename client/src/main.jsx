import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './pages/dashboard.jsx';
import Home from './pages/Home.jsx';
import './index.css';
import MainLayout from './layout/mainlayout.jsx';
import HotCoins from './pages/hotCoins.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/700.css';
import Login from "./pages/login.jsx";
import { AuthProvider } from './context/AuthContex.jsx';
import { Toaster } from 'react-hot-toast';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ThemeProvider } from "./context/ThemeContext";
import axios from 'axios';
import "./i18n.js";

const queryClient = new QueryClient();
axios.defaults.withCredentials = true;
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/topcoins", element: <HotCoins /> },
      { path: "/home", element: <Home /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <>
        <ThemeProvider >
          <RouterProvider router={router} />
          <Toaster position="top-right" reverseOrder={false} />
        </ThemeProvider >
        </>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
