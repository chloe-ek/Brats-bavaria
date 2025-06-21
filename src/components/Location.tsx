import dynamic from "next/dynamic";

const MapEmbed = dynamic(() => import("./MapEmbed"), { ssr: false });

const Location = () => {
  return (

    <div className="relative w-full bg-gradient-to-b from-[#262626] to-[#111518]">

    <section id="location" className=" text-white px-4 sm:px-6 md:px-20 lg:px-40 py-12 sm:py-16 md:py-20 max-w-[1600px] mx-auto scroll-mt-10">
      <div className="mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 font-Montserrat">Event Location</h2>
        <p className="text-sm sm:text-base font-sans mb-8 sm:mb-10 leading-relaxed max-w-2xl">
        CLASSIC GARAGE PERFORMANCE, 4331 Vanguard Rd, Richmond, BC V6X 2P6
        </p>

        <div className="h-[1px] bg-white/20 w-full mb-8 sm:mb-12" />



          <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden border border-white">
            <MapEmbed />
          </div>
      </div>
    </section>
    </div>
  );
};

export default Location;
