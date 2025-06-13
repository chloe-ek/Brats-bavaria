'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



const Nav = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 flex items-center border-b border-b-[#293238] px-10 py-4  bg-[#111518] text-white ">
      <div className="flex items-center gap-4 text-white">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706..."
              fill="currentColor"
            />
          </svg>
        </div>
        <Image
          src="/logo.png"
          alt="German Auto Festival - Brats & Bavaria"
          width={250}
          height={50}
          className="hidden md:block"
        />
          </div>
      <div className="flex flex-1 justify-end gap-8">
      <div className="flex items-center gap-9">
        <Link href="/" className="text-white text-sm font-medium">Home</Link>
        <Link href="#location" className="text-white text-sm font-medium">Location</Link>
        <Link href="#about" className="text-white text-sm font-medium">About</Link>
        <Link href="#contact" className="text-white text-sm font-medium">Contact</Link>
      </div>
        <button className="h-9 min-w-[84px] bg-[#f6f6f6] px-3 py-2 text-sm font-bold text-black"
        onClick={() => router.push('/submit')}>
          Apply
        </button>
      </div>
    </header>
  );
};

export default Nav;
