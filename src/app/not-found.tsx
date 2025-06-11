import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111518] text-white">
      <h2 className="text-2xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="mb-4">The page you are looking for does not exist.</p>
      <Link 
        href="/" 
        className="h-10 min-w-[84px] rounded-lg bg-[#1997e5] px-4 text-sm font-bold text-white flex items-center justify-center"
      >
        Return Home
      </Link>
    </div>
  );
}