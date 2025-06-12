import Image from "next/image";

const Hero = () => {
  return (
    <div className="mx-auto max-w-[1600px] flex flex-col items-start px-6 md:px-20 lg:px-40 py-20 bg-[#111518] text-white">

      <h1 className="text-6xl leading-tight text-white font-Ovo font-bold">
      German Auto Festival <br /> Brats & Bavaria
      </h1>
      <div className="h-[0.25px] bg-white w-full my-20"></div>

      <div className="flex flex-row gap-20">
        <Image src="/brats.jpg" alt="brats" width={600} height={400} className="w-[600px] h-auto" />
        
        <div className="flex flex-col justify-center">
          <h2 className="text-xl font-semibold mb-6 font-Ovo">Be Part of the Experience</h2>
          <p className="text-md font-sans mb-5">
            Join us for a weekend
            Category awards, German beer, Bratwurst/German food, Sponsor booths, live DJ and more!
          </p>
          <p className="text-md font-sans font-bold">Sunday, June 30th, 2025</p>
          <p className="text-md font-sans mb-5">Vehicles on desplay will need to arrive approx 1 hour before the show.</p>
          <button
            className="w-fit h-10 cursor-pointer bg-[#f4f4f4] px-6 py-2 text-sm font-bold text-black hover:bg-[#e0e0e0] transition"
            onClick={() => window.location.href = "/submit"}>
            Apply Now
          </button>
        </div>

      </div>
      <div className="h-20" />
    </div>
    
  );
};

export default Hero;
