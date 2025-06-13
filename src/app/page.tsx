'use client';

import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Info from '@/components/Info';
import Location from '@/components/Location';
import Nav from '@/components/Nav';


const Home = () => {
  return (
    <div className='min-h-screen'>
      <Nav />
      <Hero />
      <Info />
      <Location />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
