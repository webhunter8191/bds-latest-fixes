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
            <li className="cursor-pointer hover:underline">Room booking</li>
            <li className="cursor-pointer hover:underline">Rooms</li>
            <li className="cursor-pointer hover:underline">F.A.Q</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-lg">Company</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li className="cursor-pointer hover:underline">Privacy policy</li>
            <li className="cursor-pointer hover:underline">Refund policy</li>
            <li className="cursor-pointer hover:underline">Contact</li>
            <li className="cursor-pointer hover:underline">
              <Link to="/about" className=" hover:underline">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-lg">Follow us</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li className="cursor-pointer hover:underline">Facebook</li>
            <li className="cursor-pointer hover:underline">Twitter</li>
            <li className="cursor-pointer hover:underline">Instagram</li>
            <li className="cursor-pointer hover:underline">LinkedIn</li>
          </ul>
        </div>

        {/* Newsletter */}
        {/* <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h3 className="font-semibold text-lg">Newsletter</h3>
          <p className="text-sm mt-2">
            Subscribe to our newsletter for the latest deals and discounts.
          </p>
          <div className="mt-3 flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded-md text-black flex-1 mb-2 sm:mb-0 sm:mr-2"
            />
            <button className="bg-[#5C432B] px-4 py-2 rounded-md text-white w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div> */}
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-6">
        © {new Date().getFullYear()} Brij Divine Stay. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
