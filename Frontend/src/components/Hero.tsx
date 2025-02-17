import hotelImage from "../assets/bg1.jpg";

const Hero = () => {
  return (
    <div
      className="lg:min-h-[80vh] min-h-[70vh] flex flex-col items-center  lg:justify-center md:justify-center sm:justify-start"
      style={{
        // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.48)), url(${hotelImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // minHeight: '80vh',
      }}
    >
      {/* Hero Section */}
      <div className="text-center bg-opacity-75 p-6 rounded-md mt-0 mt-10 lg:mt-0 lg:mt-0">
        <h1 className="text-3xl text-xl md:text-4xl lg:text-5xl font-bold text-white leading-snug">
          {/* Hotel for Every Moment Rich in Emotion */}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-white mt-4">
          Every moment feels like the first time with a paradise view.
        </p>
        <div className="mt-4 space-x-4">
          <button className=" bg-black rounded-lg border-gray-600 border-2 text-white px-5 py-2 rounded-md text-sm sm:text-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg">
            Book Now
          </button>
          {/* Optional Button */}
          {/* <button className="px-6 py-3 text-sm sm:text-lg text-black border border-gray-300 rounded-md hover:bg-gray-100 transition-all duration-300">
        Take a Tour
      </button> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
