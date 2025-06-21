import Link from 'next/link';



const Footer = () => {
  return (
    <footer className="flex justify-center px-4 pt-8 sm:pt-10 pb-6">
      <div className="flex max-w-[1400px] flex-1 flex-col text-center text-[#9daeb8]">
        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6">
        <Link href="/privacy" className="text-sm sm:text-base font-normal hover:underline">Privacy Policy</Link>
        <Link href="/terms" className="text-sm sm:text-base font-normal hover:underline">Terms of Service</Link>
        <Link href="/#contact" className="text-sm sm:text-base font-normal hover:underline">Contact Us</Link>
        </div>

        {/* Social Icons */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">

          {/* Instagram */}
          <a
            href="https://instagram.com/bratsandbavaria"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[#9daeb8] hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,80a48,48,0,1,0,48,48A48,48,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm48-136H80A56,56,0,0,0,24,80v96a56,56,0,0,0,56,56h96a56,56,0,0,0,56-56V80A56,56,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/events/s/brats-bavaria-2024-german-auto/1845741942531208/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-[#9daeb8] hover:text-white transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs sm:text-sm font-normal leading-normal">
          © 2025 Brats and Bavaria. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
