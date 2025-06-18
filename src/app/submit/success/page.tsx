"use client";

import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import Link from 'next/link';

export default function SubmitSuccessPage() {
  return (
    <div className="bg-[#111518] text-white min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 px-4 sm:px-6 py-10 w-full max-w-[1400px] mx-auto">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Application Submitted!</h1>
          <p className="mb-10">We&apos;ll review your application and contact you soon.</p>
        </div>
        <Link 
          href="/" 
          className="h-10 bg-[#f6f6f6] px-4 text-sm font-bold text-black flex items-center justify-center">
          Return Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
