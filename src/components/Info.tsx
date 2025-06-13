"use client";

import Image from "next/image";

const Info = () => {
  return (
    <div className="relative w-full bg-[#111518]">
      <section
        id="Info"
        className="text-white px-6 md:px-20 lg:px-40 py-20 max-w-[1600px] mx-auto"
      >
        <div className="mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-Ovo mt-8">
            Event Info
          </h2>
          <p className="text-sm sm:text-base font-sans mb-10 leading-relaxed max-w-2xl">
            Find us at Richmond in Vancouver. Use the cards below to learn more
            about the event experience and schedule.
          </p>

          <div className="h-[1px] bg-white/20 w-full mb-12" />

          {/* 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-white/5 border border-white/10 shadow-md backdrop-blur-sm hover:shadow-xl transition overflow-hidden">
              <Image
                src="/meet.png"
                alt="Meet & Park"
                width={300}
                height={300}
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold font-Ovo mb-2">
                  Meet & Park
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  Car owners arrive and check in. Secure your spot and meet
                  fellow enthusiasts. Food trucks on-site!
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 border border-white/10 shadow-md backdrop-blur-sm hover:shadow-xl transition overflow-hidden">
            <Image
                src="/meet.png"
                alt="Meet & Park"
                width={500}
                height={300}
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold font-Ovo mb-2">
                  Showcase & Photoshoot
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  Main display day with professional photoshoots, live music,
                  and curated judging of entries.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 border border-white/10 shadow-md backdrop-blur-sm hover:shadow-xl transition overflow-hidden">
            <Image
                src="/meet.png"
                alt="Meet & Park"
                width={500}
                height={300}
                className="w-full h-80 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold font-Ovo mb-2">
                  Awards & Wrap-up
                </h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  Trophies, sponsor giveaways, and closing group cruise through
                  scenic Vancouver routes.
                </p>
              </div>
            </div>
          </div>

          <div className="h-20" />
        </div>
      </section>
    </div>
  );
};

export default Info;
