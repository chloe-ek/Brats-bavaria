import dynamic from "next/dynamic";

const MapEmbed = dynamic(() => import("./MapEmbed"), { ssr: false });

const Dot = () => (
  <span className="w-1 h-1 rounded-full bg-white/30 shrink-0 mt-[7px] block" />
);

const Location = () => {
  return (
    <div className="relative w-full bg-gradient-to-b from-[#262626] to-[#111518]">
      <section
        id="location"
        className="text-white px-4 sm:px-8 md:px-16 lg:px-32 py-8 sm:py-12 md:py-16 max-w-[1400px] mx-auto scroll-mt-10"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 font-BebasNeue tracking-wide">
          Event Location
        </h2>

        <div className="h-[1px] bg-white/20 w-full mb-8 sm:mb-12" />

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
          {/* Info panel */}
          <div className="flex flex-col justify-between lg:w-2/5 bg-white/5 border border-white/10 p-6 sm:p-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-white/50 mb-3 font-sans">Venue</p>
              <h3 className="text-2xl sm:text-3xl font-BebasNeue tracking-wide mb-6">
                Classic Garage Performance
              </h3>

              <div className="h-[1px] bg-white/10 w-full mb-6" />

              <div className="space-y-4 text-sm font-sans text-white/80">
                <div className="flex gap-3 items-start">
                  <Dot />
                  <p>4331 Vanguard Rd, Richmond, BC V6X 2P6</p>
                </div>
                <div className="flex gap-3 items-start">
                  <Dot />
                  <p>10:00 AM – 2:00 PM</p>
                </div>
                <div className="flex gap-3 items-start">
                  <Dot />
                  <p>Free Admission</p>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Classic+Garage+Performance+4331+Vanguard+Rd+Richmond+BC"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block border border-white/60 hover:border-white hover:bg-white hover:text-black transition-all duration-200 px-6 py-3 text-sm font-sans tracking-widest uppercase text-center"
            >
              Get Directions →
            </a>
          </div>

          {/* Map */}
          <div className="lg:w-3/5 h-[280px] sm:h-[360px] lg:h-auto min-h-[400px] overflow-hidden border border-white/10">
            <MapEmbed />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Location;
