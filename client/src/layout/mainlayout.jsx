import React from 'react'
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
const MainLayout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default MainLayout