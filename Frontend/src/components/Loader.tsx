import { useEffect } from "react";

const Loader = () => {
  useEffect(() => {
    // Example: Adding an event listener
    const handleEvent = () => {
      console.log("Event triggered");
    };
    window.addEventListener("resize", handleEvent);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleEvent);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
    </div>
  );
};

export default Loader;
