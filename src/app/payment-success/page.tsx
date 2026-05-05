"use client";

import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="bg-[#111518] text-white min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 flex items-center justify-center px-6 sm:px-12 md:px-20 py-20">
        <div className="w-full max-w-xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px w-8 bg-white/40" />
            <span
              className="text-white/50 font-sans uppercase tracking-[0.3em]"
              style={{ fontSize: '0.7rem' }}
            >
              BRATS AND BAVARIA 2026
            </span>
          </div>

          {/* Check icon */}
          <div className="w-11 h-11 border border-white/20 flex items-center justify-center mb-8">
            <svg
              className="w-5 h-5 text-white/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3.5rem, 9vw, 7rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.01em',
              marginBottom: '1.5rem',
            }}
          >
            Payment<br />Confirmed
          </h1>

          {/* Divider */}
          <div className="h-px bg-white/20 w-full mb-8" />

          {/* Message */}
          <p
            className="text-white/50 text-sm leading-relaxed mb-3"
            style={{ letterSpacing: '0.02em' }}
          >
            Your entry fee has been received. Your vehicle display spot is confirmed for the event.
          </p>
          <p
            className="text-white/30 text-xs leading-relaxed mb-12"
            style={{ letterSpacing: '0.02em' }}
          >
            A confirmation will be sent to your email. See you on the day!
          </p>

          {/* CTA */}
          <Link
            href="/"
            className="group inline-flex items-center gap-3 border border-white/40 text-white text-xs font-sans font-semibold tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300"
          >
            Return Home
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>

        </div>
      </main>

      <Footer />
    </div>
  );
}
