import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#6A5631] text-white py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {/* Testimonial Section */}
        <div className="col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold italic">
            Brij Divine Stay-
            <span className="font-normal">
              {" "}
              "Live the Divine, Love the Stay"
            </span>
          </h2>
          {/* <p className="mt-2">
            "Find your perfect stay in the divine lands of Vrindavan & Mathura.
            Book comfortable hotels with ease and experience the spiritual
            essence of Brij. Safe, secure, and hassle-free bookings – your
            journey begins here!"
          </p> */}
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg">Quick links</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li className="cursor-pointer hover:underline">
              <Link to="/search" className=" hover:underline">
                Room booking
              </Link>
            </li>
            {/* <li className="cursor-pointer hover:underline">Rooms</li>
            <li className="cursor-pointer hover:underline">F.A.Q</li> */}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-lg">Company</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li className="cursor-pointer hover:underline">
              <Link to="/privacy-policy"> Privacy policy</Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/terms-and-conditions" className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/contact" className=" hover:underline">
                Contact
              </Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link to="/about" className=" hover:underline">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-lg">Connect With Us</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li className="cursor-pointer hover:underline">
              <Link
                to="https://www.facebook.com/share/1BX2LzHXdg/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link
                to="https://www.instagram.com/brijdivinestay/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </Link>
            </li>
            <li className="cursor-pointer hover:underline">
              <Link
                to="https://wa.me/message/HRXXOHRS5OYCC1"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp{" "}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-6">
        © {new Date().getFullYear()} Brij Divine Stay. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
