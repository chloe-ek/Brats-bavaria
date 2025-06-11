
const Footer = () => {
  return (
    <footer className="flex justify-center px-4 pt-10 pb-6">
      <div className="flex max-w-[1400px] flex-1 flex-col text-center text-[#9daeb8]">
        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
          <a className="text-base font-normal min-w-40 hover:underline" href="/privacy">Privacy Policy</a>
          <a className="text-base font-normal min-w-40 hover:underline" href="/terms">Terms of Service</a>
          <a className="text-base font-normal min-w-40 hover:underline" href="/contact">Contact Us</a>
        </div>

        {/* Social Icons */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {/* Twitter */}
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-[#9daeb8] hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M245.57,77.06A8,8,0,0,0,236,72H207.53a56,56,0,0,0-111.45,8v8.23C70.17,79.42,44.43,55.11,44.15,54.83a8,8,0,0,0-13.67,5.1c-4.26,47.2,9.44,78.79,21.7,96.89A113.18,113.18,0,0,0,76.7,181.3c-14.75,16.6-37.88,25.29-38.14,25.39a8,8,0,0,0-3.85,11.93c.76,1.13,3.79,5.07,11.19,8.77C53.68,232.49,65.85,235,80,235c68.7,0,126.18-52.83,132-120.91l29.67-29.67A8,8,0,0,0,245.57,77.06ZM200,108a8,8,0,0,0-2.33,5.15C193.48,166.3,142.5,215,80,215c-10.37,0-17.68-1.34-22.86-3.06,10.92-6.14,25.92-16.68,35.72-31.94A8,8,0,0,0,91.9,168c-.48-.28-45.12-26.87-45.12-97.18C64.5,82.73,93.07,103.2,125.54,108.84A8,8,0,0,0,136,101V80a40,40,0,0,1,78.87-10.5A8,8,0,0,0,222.67,77H240Z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[#9daeb8] hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,80a48,48,0,1,0,48,48A48,48,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm48-136H80A56,56,0,0,0,24,80v96a56,56,0,0,0,56,56h96a56,56,0,0,0,56-56V80A56,56,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-[#9daeb8] hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="text-base font-normal leading-normal">
          © 2025 Brats and Bavaria. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
