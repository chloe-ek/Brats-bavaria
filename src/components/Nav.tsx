'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';



const Nav = () => {
  const router = useRouter();
  const menuRef = useRef<HTMLUListElement | null>(null);

  const openMenu = () => {
    if (menuRef.current) {
      menuRef.current.classList.remove('translate-x-full');
    }
  };

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.classList.add('translate-x-full');
    }
  };


  return (
    <header className="sticky top-0 z-50 flex justify-between items-center border-b border-b-[#293238] px-10 py-4  bg-[#111518] text-white ">

        <Link href="/" className='flex items-center'>
        <Image
          src="/logo.png"
          alt="Logo"
          width={250}
          height={50}
          className="max-w-[112px] md:max-w-none h-auto cursor-pointer"
        />
        </Link>

      <nav className="hidden md:flex flex-1 justify-end gap-10 items-center">
        <Link href="/" className="text-white text-sm font-medium">Home</Link>
        <Link href="/#location" className="text-white text-sm font-medium">Location</Link>
        <Link href="/about" className="text-white text-sm font-medium">About</Link>
        <Link href="/#contact" className="text-white text-sm font-medium">Contact</Link>
        <button className="h-9 min-w-[84px] bg-[#f6f6f6] px-3 py-2 text-sm font-bold text-black"
        onClick={() => router.push('/submit')}>
          Apply
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <button className="block md:hidden items-end" onClick={openMenu}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Side Menu */}
      <ul
        ref={menuRef}
        className="fixed top-0 right-0 z-50 h-full w-64 bg-[#111518] text-white flex flex-col gap-6 px-6 py-20 transform translate-x-full transition-transform duration-300 md:hidden"
      >
        <button className="absolute top-5 right-5" onClick={closeMenu}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <Link href="/" onClick={closeMenu}>Home</Link>
        <Link href="/#location" onClick={closeMenu}>Location</Link>
        <Link href="/about" onClick={closeMenu}>About</Link>
        <Link href="/#contact" onClick={closeMenu}>Contact</Link>
        <button
          className="bg-white text-black py-2 px-4 font-bold mt-4"
          onClick={() => {
            closeMenu();
            router.push('/submit');
          }}
        >
          Apply
        </button>
      </ul>
    </header>
  );
};

export default Nav;
