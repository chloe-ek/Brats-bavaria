import Image from 'next/image'

const events = [

  {
    date: '11 JUNE 2024',
    title: 'Brats and Bavaria 2024',
    location: 'Richmond, BC',
  },
  {
    date: '25 JUNE 2023',
    title: 'Brats and Bavaria 2023',
    location: 'Richmond, BC',
  },
  {
    date: '28 AUG 2022',
    title: 'Brats and Bavaria 2022',
    location: 'Richmond, BC',
  },
]

const PreviousEvents = () => {
  return (
    <div
      className="w-full text-white"
      style={{
        background: `linear-gradient(180deg, #111518 0%, #262626 100%)`,
      }}
    >
      <section
        id="previous"
        className="px-6 md:px-20 lg:px-40 py-20 max-w-[1600px] mx-auto scroll-mt-24"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-Montserrat mt-8">
          Previous Events
        </h2>
        <p className="text-sm sm:text-base font-sans mb-10 leading-relaxed max-w-2xl">
          Throwback to our previous events in Richmond, BC. Thank you to all participants and sponsors.
        </p>

        <div className="h-[1px] bg-white/10 w-full mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Event List */}
          <div className="space-y-10">
            {events.map((event, index) => {
              const [day, month, year] = event.date.split(' ')
              return (
                <div key={index} className="flex items-center gap-6 min-h-[80px] p-4">
                  <div className="flex flex-col items-center justify-center w-20 h-20 bg-white/5 border border-[#424242] text-sm font-bold">
                    <span>{day}</span>
                    <span>{month}</span>
                    <span>{year}</span>
                  </div>

                  <div className="flex flex-col justify-center">
                    <h3 className="font-semibold text-lg ">{event.title}</h3>
                    <p className="text-sm text-gray-300">{event.location}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {['/meet.jpg', '/cars2.jpeg', '/people.jpeg', '/showcase.png'].map((src, i) => (
              <div key={i} className="w-full h-[220px] relative overflow-hidden shadow-lg hover:scale-[1.03] transition">
                <Image src={src} alt={`Previous event ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default PreviousEvents
