import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
const about = () => {
  return (

    <div className="bg-[#111518] text-white min-h-screen flex flex-col">
      <Nav />
    
          <div className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-20 lg:px-40 py-24 text-white">
            <h1 className="text-6xl font-semibold mb-4 font-Montserrat text-center w-full">
             ABOUT US
            </h1>
    
            <div className="h-[0.5px] bg-white w-full my-10" />
    
            <div className="flex flex-col lg:flex-row gap-10 items-center">
    
              <div className="flex flex-col justify-center text-white">
            
                <p className="text-md font-sans mb-5">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam, quas. Quia fugiat molestias eum praesentium officia enim? Animi voluptatem ratione excepturi blanditiis accusantium consequatur porro!Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam, quas. Quia fugiat molestias eum praesentium officia enim? Animi voluptatem ratione excepturi blanditiis accusantium consequatur porro!Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam, quas. Quia fugiat molestias eum praesentium officia enim? Animi voluptatem ratione excepturi blanditiis accusantium consequatur porro!Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam, quas. Quia fugiat molestias eum praesentium officia enim? Animi voluptatem ratione excepturi blanditiis accusantium consequatur porro!Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam, quas. Quia fugiat molestias eum praesentium officia enim? Animi voluptatem ratione excepturi blanditiis accusantium consequatur porro!Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam, quas. Quia fugiat molestias eum praesentium officia enim? Animi voluptatem ratione excepturi blanditiis accusantium consequatur porro!
                  
                </p>
                
              </div>
            </div>
          </div>

          
        <Footer />
      </div>
  )
}

export default about