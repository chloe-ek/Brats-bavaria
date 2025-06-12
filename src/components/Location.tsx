const Location = () => {
  return (
    <section id="location" className="bg-[#111518] text-white px-6 md:px-20 lg:px-40 py-20 max-w-[1600px] mx-auto">
      <div className="mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-Ovo">Event Location</h2>
        <p className="text-sm sm:text-base font-sans mb-10 leading-relaxed max-w-2xl">
          Find us at Richmond in Vancouver. Use the map below to explore the event venue and plan your visit.
        </p>

        <div className="h-[0.25px] bg-white w-full mb-10"></div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT: Google Map */}
          <div className="w-full lg:w-[50%] aspect-video overflow-hidden border border-white">
            <iframe
              title="Event Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2607.9641544577858!2d-123.10603167304689!3d49.18226680000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548675174dcb64a3%3A0xc6144e458eeb325a!2sCLASSIC%20GARAGE%20PERFORMANCE!5e0!3m2!1sen!2sca!4v1749752617373!5m2!1sen!2sca"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>


          {/* RIGHT: Schedule Info */}
          <div className="flex flex-col gap-10 w-full lg:w-[50%] font-sans">
            <div>
              <h3 className="font-bold text-lg font-Ovo">Meet & Park</h3>
              <p className="text-sm text-gray-200 mt-1">
                Car owners arrive and check in. Secure your spot and meet fellow enthusiasts. Food trucks on-site!
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg font-Ovo">Showcase & Photoshoot</h3>
              <p className="text-sm text-gray-200 mt-1">
                Main display day with professional photoshoots, live music, and curated judging of entries.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg font-Ovo">Awards & Wrap-up</h3>
              <p className="text-sm text-gray-200 mt-1">
                Trophies, sponsor giveaways, and closing group cruise through scenic Vancouver routes.
              </p>
            </div>
          </div>
        </div>
        <div className="h-20" />
      </div>
    </section>
  );
};

export default Location;
