import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import BlurWrapper from '../components/BlurWrapper.jsx';

const MainLayout = () => {
  return (
    <div className='flex overflow-x-hidden min-h-screen flex-col h-screen'>
      <BlurWrapper>
      <Navbar />
      {/* Wrap all children routes with BlurWrapper */}
        <Outlet />
      </BlurWrapper>
    </div>
  );
};

export default MainLayout;
