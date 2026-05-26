import Image from 'next/image'

const events = [
  { index: '01', year: '2025', date: 'AUG 24', title: 'Brats and Bavaria 2025', location: 'Richmond, BC' },
  { index: '02', year: '2024', date: 'JUNE 11', title: 'Brats and Bavaria 2024', location: 'Richmond, BC' },
  { index: '03', year: '2023', date: 'JUNE 25', title: 'Brats and Bavaria 2023', location: 'Richmond, BC' },
  { index: '04', year: '2022', date: 'AUG 28',  title: 'Brats and Bavaria 2022', location: 'Richmond, BC' },
]

const PreviousEvents = () => {
  return (
    <div
      className="w-full text-white"
      style={{ background: 'linear-gradient(180deg, #111518 0%, #111518 20%, #262626 100%)' }}
    >
      <section
        id="previous"
        className="px-4 sm:px-8 md:px-16 lg:px-32 py-8 sm:py-12 md:py-16 max-w-[1400px] mx-auto scroll-mt-24"
      >
        {/* Header */}
        <div className="flex items-end justify-between mt-4 sm:mt-8 mb-2">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-BebasNeue tracking-wide leading-none">
            Previous Events
          </h2>
          <span className="text-white/30 font-sans text-xs tracking-widest uppercase hidden sm:block">
            Richmond, BC
          </span>
        </div>

        <div className="h-px bg-white/15 w-full mt-4 mb-0" />

        {/* Event list */}
        <div className="mb-14 sm:mb-20">
          {events.map((event) => (
            <div
              key={event.index}
              className="group flex items-center gap-6 sm:gap-10 py-5 sm:py-6 border-b border-white/10 hover:border-white/30 transition-colors duration-300"
            >
              {/* Index */}
              <span className="text-white/20 font-sans text-xs tracking-widest w-6 shrink-0">
                {event.index}
              </span>

              {/* Year */}
              <span
                className="font-BebasNeue text-white/25 group-hover:text-white/50 transition-colors duration-300 shrink-0 leading-none"
                style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)' }}
              >
                {event.year}
              </span>

              {/* Title */}
              <span
                className="font-BebasNeue text-white group-hover:tracking-wider transition-all duration-500 flex-1 leading-none"
                style={{ fontSize: 'clamp(0.8rem, 1.0vw, 1.0rem)', letterSpacing: '0.14em' }}
              >
                {event.title}
              </span>

              {/* Date */}
              <span className="text-white/40 font-sans text-xs tracking-widest uppercase shrink-0 hidden sm:block">
                {event.date}
              </span>
            </div>
          ))}
        </div>

        {/* Image grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {['/meet.jpg', '/cars2.jpeg', '/people.jpeg', '/showcase.png'].map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden"
              style={{ aspectRatio: '4/3' }}
            >
              <Image
                src={src}
                alt={`Previous event ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-all duration-500"
              />
            </div>
          ))}
        </div>

      </section>
    </div>
  )
}

export default PreviousEvents
