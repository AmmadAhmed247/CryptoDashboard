import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './pages/dashboard.jsx'
import Home from './pages/Home.jsx'
import './index.css'
import MainLayout from './layout/mainlayout.jsx'
import HotCoins from './pages/hotCoins.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient=new QueryClient();
const router=createBrowserRouter([
  {
    path:"/",element:<MainLayout/>,
    children:[
      {path:"/",element:<Dashboard/>},
      {path:"/hotcoins",element:<HotCoins/>},
      {path:"/home",element:<Home/>},
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider  client={queryClient}>
    <RouterProvider router={router}/>
    </QueryClientProvider >
  </StrictMode>,
)
