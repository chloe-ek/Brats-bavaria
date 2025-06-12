'use client';

import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Location from '@/components/Location';
import Nav from '@/components/Nav';

const Home = () => {
  return (
    <div className='min-h-screen'>
      <Nav />
      <Hero />
      <Location />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
