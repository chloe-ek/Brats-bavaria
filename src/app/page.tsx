'use client';

import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Location from '@/components/Location';
import Nav from '@/components/Nav';

const Home = () => {
  return (
    <div className="bg-[#111518] text-white min-h-screen">
      <Nav />
      <Hero />
      <Location />
      <Footer />
    </div>
  );
};

export default Home;
