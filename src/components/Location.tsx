import dynamic from "next/dynamic";

const MapEmbed = dynamic(() => import("./MapEmbed"), { ssr: false });

const Location = () => {
  return (

    <div className="relative w-full 2a1c1b bg-gradient-to-b from-[#262626] to-[#bg-gradient-to-b to-[#111518]">

    <section id="location" className=" text-white px-6 md:px-20 lg:px-40 py-20 max-w-[1600px] mx-auto scroll-mt-10">
      <div className="mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4   font-Montserrat">Event Location</h2>
        <p className="text-sm sm:text-base font-sans mb-10 leading-relaxed max-w-2xl">
        CLASSIC GARAGE PERFORMANCE, 4331 Vanguard Rd, Richmond, BC V6X 2P6
        </p>

        <div className="h-[1px] bg-white/20 w-full mb-12" />



          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden border border-white">
            <MapEmbed />
          </div>

        <div className="h-20" />
      </div>
    </section>
    </div>
  );
};

export default Location;
