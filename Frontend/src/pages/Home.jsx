import React from 'react';
import TopBar from '../components/layout/TopBar';
import Header from '../components/layout/Header';
import Navbar from '../components/layout/Navbar';
import LoginSidebar from '../components/home/LoginSidebar';
import HeroImage from '../components/home/HeroImage';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#fdf5eb]">
      <TopBar />
      <Header />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-4 sm:py-3 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Login Options */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex justify-center md:justify-start md:sticky md:top-4 self-start h-fit">
          <LoginSidebar />
        </div>

        {/* Right Main Content - Hero Image */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <HeroImage />
        </div>
      </main>
    </div>
  );
};

export default Home;
