// import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <div className="bg-[#7C6A46] py-8 shadow-md transition duration-500">
//       <div className="container mx-auto flex flex-col md:flex-row justify-between items-center animate__animated animate__fadeInUp">
//         {/* Logo and Title */}
//         <span className="text-2xl text-white font-bold tracking-tight">
//           <a href="/" className="hover:text-gray-300 transition duration-300">
//             Brij Divine Stay
//           </a>
//         </span>

//         {/* Social Media Links */}
//         <div className="flex space-x-6 mt-4 md:mt-0">
//           <a
//             href="#"
//             className="text-white text-xl hover:text-gray-300 transition duration-300"
//           >
//             <FaFacebookF />
//           </a>
//           <a
//             href="#"
//             className="text-white text-xl hover:text-gray-300 transition duration-300"
//           >
//             <FaTwitter />
//           </a>
//           <a
//             href="#"
//             className="text-white text-xl hover:text-gray-300 transition duration-300"
//           >
//             <FaInstagram />
//           </a>
//         </div>

//         {/* Footer Links */}
//         <div className="text-white flex gap-6 mt-4 md:mt-0">
//           <p className="cursor-pointer hover:text-gray-300 transition duration-300">
//             Privacy Policy
//           </p>
//           <p className="cursor-pointer hover:text-gray-300 transition duration-300">
//             Terms of Service
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Footer;

import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#6A5631] text-white py-5 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Testimonial Section */}
        <div>
          <h2 className="text-xl font-semibold italic">Brij Divine Stay</h2>
          <p className="mt-2 text-sm">
            The service at the Hotel Monteleone was exceptional. There was
            absolutely no issue that was not addressed timely and with
            satisfactory results. We were particularly impressed with how the
            hotel staff anticipated our needs (periodically coming by the Board
            Room to check with us).
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg">Quick links</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Room booking</li>
            <li>Rooms</li>
            <li>Contact</li>
            <li>Explore</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-lg">Company</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Privacy policy</li>
            <li>Refund policy</li>
            <li>F.A.Q</li>
            <li>About</li>
          </ul>
        </div>

        {/* Social Media & Newsletter */}
        <div>
          <h3 className="font-semibold text-lg">Social media</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mt-6">Newsletter</h3>
          <p className="text-sm mt-2">
            Kindly subscribe to our newsletter to get latest deals on our rooms
            and vacation discount.
          </p>
          <div className="mt-3 flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded-l-md text-black flex-1"
            />
            <button className="bg-[#5C432B] px-4 py-2 rounded-r-md text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="text-center text-sm mt-6">Paradise view 2023</div>
    </footer>
  );
};

export default Footer;
