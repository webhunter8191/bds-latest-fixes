
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { useAppContext } from "../contexts/AppContext"; // Assuming this provides isLoggedIn and isAdmin
import SignOutButton from "./SignOutButton";

const Header = () => {
  const { isLoggedIn, isAdmin } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <header className="bg-white py-4 shadow-md relative">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <span className="text-2xl font-bold text-black">
          <NavLink to="/">Brij Divine Stay</NavLink>
        </span>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-black focus:outline-none"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Full-Screen Dropdown Menu for small screens */}
        <div
          className={`fixed inset-0  bg-opacity-50 backdrop-blur-lg z-50 ${
            isMenuOpen ? "block" : "hidden"
          } lg:hidden`}
        >
          <nav className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center  shadow-lg p-4">
            {/* Close Button */}
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-black text-3xl z-60"
            >
              <FaTimes />
            </button>

            <NavLink
              to="/tours"
              className="inline-block text-[#6A5631] font-bold text-xl hover:text-black transition duration-300 mb-8"
              onClick={() => setIsMenuOpen(false)}
            >
              Tours
            </NavLink>

            {isLoggedIn ? (
              <>
                {/* Show My Bookings or My Hotels based on user role */}
                {!isAdmin ? (
                  <NavLink
                    to="/my-bookings"
                    className="inline-block bg-[#6A5631] text-white px-4 py-2 rounded-lg hover:bg-[#6A5631] transition duration-300 mb-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </NavLink>
                ) : (
                  <NavLink
                    to="/my-hotels"
                    className="inline-block bg-[#6A5631] text-white px-4 py-2 rounded-lg hover:bg-[#6A5631] transition duration-300 mb-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Hotels
                  </NavLink>
                )}
                <SignOutButton />
              </>
            ) : (
              // Show Sign In if the user is not logged in
              <NavLink
                to="/sign-in"
                className="inline-block bg-[#6A5631] text-white px-4 py-2 rounded-lg hover:bg-black transition duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserCircle className="inline-block mr-2" />
                Sign In
              </NavLink>
            )}
          </nav>
        </div>

        {/* Normal Navigation for Larger Screens */}
        <nav className="hidden lg:flex items-center space-x-6">
          <NavLink
            to="/tours"
            className="text-gray-700 font-semibold hover:text-[#6A5631] transition duration-300"
          >
            Tours
          </NavLink>
          {isLoggedIn ? (
            <>
              {/* Show My Bookings or My Hotels based on user role */}
              {!isAdmin ? (
                <NavLink
                  to="/my-bookings"
                  className="bg-bg-[#6A5631] text-white px-4 py-2 rounded-lg hover:bg-[#6A5631] transition duration-300"
                >
                  My Bookings
                </NavLink>
              ) : (
                <NavLink
                  to="/my-hotels"
                  className="bg-[#6A5631] text-white px-4 py-2 rounded-lg hover:bg-[#6A5631] transition duration-300"
                >
                  My Hotels
                </NavLink>
              )}
              <SignOutButton />
            </>
          ) : (
            <NavLink
              to="/sign-in"
              className="bg-[#6A5651] text-white px-4 py-2 rounded-lg hover:bg-black transition duration-300"
            >
              <FaUserCircle className="inline-block mr-2" />
              Sign In
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
