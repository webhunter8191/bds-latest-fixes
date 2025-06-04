import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/bg1.jpg";
import img2 from "../assets/bg2.jpg";
// import img3 from "../assets/bg3.jpg"; // Add more images as needed

const images = [img1, img2, img1, img2]; // Add more images to this array

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // change image every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div
      className="relative w-full min-h-[80vh] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.48)), url(${images[currentImageIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        transition: "background-image 5s fade-in-out ",
      }}
    >
      {/* Hero Content */}
      <div className="text-center p-4 sm:p-6 md:p-8 max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-2xl ">
        <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-5xl font-bold text-white leading-tight md:leading-snug md:mt-[-100px] ">
          Hotel for Every Moment Rich in Emotion
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-white mt-3  ">
          Book a Divine stay with Brij Divine Stay
        </p>
        <div className="mt-3 md:mb-10">
          <button
            className="bg-gray-100 rounded-lg border-2 text-black px-5 py-2.5 text-sm sm:text-base md:text-lg font-medium hover:bg-opacity-90 transition-all duration-300 shadow-lg inline-block  "
            onClick={() => navigate("/search")}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
