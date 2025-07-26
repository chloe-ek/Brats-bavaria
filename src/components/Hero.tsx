import { motion } from "framer-motion";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="relative w-full bg-[#111518]">
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/background.jpg')" }}/>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-8 md:px-16 lg:px-32 py-8 sm:py-12 md:py-16 text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold mb-4 font-Montserrat text-center w-full"
        >
         GERMAN AUTO FESTIVAL
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="h-[0.5px] bg-white w-full my-6 sm:my-8 md:my-10" 
        />

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 items-center">
          <Image
            src="/background.jpg"
            alt="brats"
            width={800}
            height={600}
            className="w-full max-w-[450px] sm:max-w-[540px] md:max-w-[630px] h-auto shadow-lg"
          />

          <div className="flex flex-col justify-center text-white">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 font-Montserrat">
              Be Part of the Experience
            </h2>
            <p className="text-sm sm:text-md font-sans mb-4 sm:mb-5">
              Join us for a weekend: Category awards,
              Bratwurst/German food, Sponsor booths, live DJ and more!
            </p>
            <p className="text-sm sm:text-md font-Montserrat font-bold mb-4 sm:mb-5">
              Sunday, August 24th, 2025 <span className="px-2">|</span> 10AM–2PM
            </p>
            <p className="text-sm sm:text-md font-sans mb-4 sm:mb-5">
              Vehicles on display will need to arrive approx 1 hour before the
              show.
            </p>
            <button
              className="w-fit h-10 cursor-pointer bg-[#f4f4f4] px-4 sm:px-6 py-2 text-sm font-bold text-black hover:bg-[#e0e0e0] transition"
              onClick={() => (window.location.href = "/submit")}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
      <div className="h-10 sm:h-14 md:h-18" />
    </div>
  );
};

export default Hero;
