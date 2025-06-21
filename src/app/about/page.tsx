import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Image from "next/image";
import Link from "next/link";

const members = [
  {
    instagramId: "pb_e46",
    profileImg: "/pb.png",
    instagramUrl: "https://www.instagram.com/pb_e46/",
  },
  {
    instagramId: "js_imola",
    profileImg: "/josh.png",
    instagramUrl: "https://www.instagram.com/js_imola",
  },
  {
    instagramId: "kennyomama",
    profileImg: "/kenny.png",
    instagramUrl: "https://www.instagram.com/kennyomama",
  },
  {
    instagramId: "dubberz",
    profileImg: "/dubb.png",
    instagramUrl: "https://www.instagram.com/Dubberzforum",
  },
  {
    instagramId: "aloravii.v",
    profileImg: "/alora.png",
    instagramUrl: "https://www.instagram.com/aloravii.v/",
  },
  {
    instagramId: "joeschmoez",
    profileImg: "/joes.png",
    instagramUrl: "https://www.instagram.com/joeschmoez?igsh=MWtmY2VyaWxqM3lq",
  }
];

const About = () => {
  return (
<div className="bg-[#111518] text-white min-h-screen flex flex-col">

      <Nav />

      <div className="flex-grow mx-auto max-w-[1600px] px-4 sm:px-6 md:px-20 lg:px-40 py-12 sm:py-16 md:py-24 text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold mb-4 font-Montserrat text-center w-full">
          ABOUT US
        </h1>

      

        <div className="h-[1px] bg-white/30 w-full my-4 sm:my-6" />

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 items-center">
          <div className="flex flex-col justify-center text-white">
            <p className="text-sm sm:text-md font-sans mb-8 sm:mb-10 text-center">
              We are local car enthusiasts that wanted to put on a German auto
              festival to bring all BMW, Porsche, Audi and Volkswagen lovers
              together in one place.
            </p>
            <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6 justify-center">
              <div className="h-[1px] w-12 sm:w-16 bg-gray-600" />
              <p className="uppercase tracking-widest text-xs sm:text-sm text-gray-400">Organized by</p>
              <div className="h-[1px] w-12 sm:w-16 bg-gray-600" />
            </div>




          </div>
        </div>

        {/* Instagram Cards Section */}
        <div className="mt-8 sm:mt-11 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

          {members.map((member, index) => (
            <Link
              key={index}
              href={member.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full border border-gray-600  rounded-xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 hover:bg-black/10 transition cursor-pointer
               hover:scale-105 duration-300"
            >
              {/* Profile Picture */}
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0">
              <Image
                  src="/Instagram-Ring.webp"
                  alt="Instagram story ring"
                  fill
                  className="object-contain"
                />
                <div className="absolute  rounded-full overflow-hidden inset-[4px] sm:inset-[6px]">
                  <Image
                    src={member.profileImg}
                    alt={member.instagramId}
                    fill
                    className=" rounded-full object-cover bg-white"
                  />
                </div>
              </div>

              {/* ID */}
              <div className="ml-auto text-right">
                <p className="text-sm sm:text-lg">@{member.instagramId}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
