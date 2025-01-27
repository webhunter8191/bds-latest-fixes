// import { NavLink, useNavigate } from "react-router-dom";
// import { useAppContext } from "../contexts/AppContext";
// import SignOutButton from "./SignOutButton";
// import { FaUserCircle, FaSearch } from "react-icons/fa";
// import Swal from "sweetalert2";

// const Header = () => {
//   const { isLoggedIn, isAdmin } = useAppContext();
//   const navigate = useNavigate();

//   // Function to handle search button click
//   const handleSearchClick = () => {
   
//     navigate("/search")
//   };

//   return (
//     <div className="bg-white py-6 shadow-md transition duration-500">
//       <div className="container mx-auto flex justify-between items-center animate__animated animate__fadeInDown">
//         {/* Site Logo */}
//         <span className="text-3xl text-black font-bold tracking-tight">
//           <NavLink
//             to="/"
//             className="hover:text-gray-300 transition duration-300"
//           >
//             Brij Divine Stay
//           </NavLink>
//         </span>

//         {/* Navigation Links and Actions */}
//         <span className="flex items-center space-x-4">
//           {/* Always Visible Links */}
//           <button
//             onClick={handleSearchClick}
//             className="flex items-center bg-[#5B3B3B] text-white px-4 py-2 rounded-lg hover:bg-[#4A2D2D] transition duration-300"
//           >
//             <FaSearch className="mr-2" size={18} />
//             Search
//           </button>

//           {isLoggedIn ? (
//             <>
//               {!isAdmin ? (
//                 <NavLink
//                   className={({ isActive }) =>
//                     `flex items-center px-4 py-2 rounded-lg transition duration-300 ${
//                       isActive ? "bg-[#3B4A5B]" : "bg-[#4A5B6A]"
//                     } text-white hover:bg-[#374257]`
//                   }
//                   to="/my-bookings"
//                 >
//                   My Bookings
//                 </NavLink>
//               ) : (
//                 <NavLink
//                   className={({ isActive }) =>
//                     `flex items-center px-4 py-2 rounded-lg transition duration-300 ${
//                       isActive ? "bg-[#6A4A3C]" : "bg-[#7C5C4A]"
//                     } text-white hover:bg-[#5C3E32]`
//                   }
//                   to="/my-hotels"
//                 >
//                   My Hotels
//                 </NavLink>
//               )}
//               <SignOutButton />
//             </>
//           ) : (
//             <NavLink
//               to="/sign-in"
//               className="flex items-center bg-[#4A3B5B] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#372D4A] transition duration-300"
//             >
//               <FaUserCircle className="mr-2" size={20} />
//               Sign In
//             </NavLink>
//           )}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default Header;


// import { NavLink, useNavigate } from "react-router-dom";
// import { useAppContext } from "../contexts/AppContext";
// import SignOutButton from "./SignOutButton";
// import { FaUserCircle, FaSearch, FaBars } from "react-icons/fa";
// import { useState } from "react";

// const Header = () => {
//   const { isLoggedIn, isAdmin } = useAppContext();
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // Function to handle search button click
//   const handleSearchClick = () => {
//     navigate("/search");
//   };

//   // Function to toggle mobile menu
//   const toggleMenu = () => {
//     setIsMenuOpen((prev) => !prev);
//   };

//   return (
//     <div className="bg-white-100 py-4 shadow-md transition duration-500">
//       <div className="container mx-auto flex items-center justify-between px-4 md:px-8">
//         {/* Site Logo */}
//         <span className="text-2xl sm:text-3xl text-black font-bold tracking-tight">
//           <NavLink to="/" className="hover:text-gray-600 transition duration-300">
//             Brij Divine Stay
//           </NavLink>
//         </span>

//         {/* Mobile Menu Toggle */}
//         <button
//           className="block lg:hidden text-black focus:outline-none"
//           onClick={toggleMenu}
//           aria-label="Toggle Menu"
//         >
//           <FaBars size={24} />
//         </button>

//         {/* Navigation Links */}
//         <div
//           className={`w-full lg:w-auto flex-grow lg:flex items-center justify-end space-y-4 lg:space-y-0 lg:space-x-4 mt-4 lg:mt-0 ${
//             isMenuOpen ? "block" : "hidden"
//           }`}
//         >
//           {/* Search Button */}
//           {/* <button
//             onClick={handleSearchClick}
//             className="flex items-center bg-[#5B3B3B] text-white px-4 py-2 rounded-lg hover:bg-[#4A2D2D] transition duration-300"
//           >
//             <FaSearch className="mr-2" size={18} />
//             Search
//           </button> */}

//           {isLoggedIn ? (
//             <>
//               {!isAdmin ? (
//                 <NavLink
//                   className={({ isActive }) =>
//                     `flex items-center px-4 py-2 rounded-lg transition duration-300 ${
//                       isActive ? "bg-[#3B4A5B]" : "bg-[#4A5B6A]"
//                     } text-white hover:bg-[#374257]`
//                   }
//                   to="/my-bookings"
//                 >
//                   My Bookings
//                 </NavLink>
//               ) : (
//                 <NavLink
//                   className={({ isActive }) =>
//                     `flex items-center px-4 py-2 rounded-lg transition duration-300 ${
//                       isActive ? "bg-[#6A4A3C]" : "bg-[#7C5C4A]"
//                     } text-white hover:bg-[#5C3E32]`
//                   }
//                   to="/my-hotels"
//                 >
//                   My Hotels
//                 </NavLink>
//               )}
//               <SignOutButton />
//             </>
//           ) : (
//             <NavLink
//               to="/sign-in"
//               className="flex items-center bg-[#4A3B5B] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#372D4A] transition duration-300"
//             >
//               <FaUserCircle className="mr-2" size={20} />
//               Sign In
//             </NavLink>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;


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
          className={`fixed inset-0  bg-opacity-50 backdrop-blur-lg z-50 ${isMenuOpen ? "block" : "hidden"} lg:hidden`}
        >
          <nav className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center  shadow-lg p-4">
            {/* Close Button */}
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-black text-3xl z-60"
            >
              <FaTimes />
            </button>

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
        <nav className="hidden lg:flex items-center space-x-4">
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


