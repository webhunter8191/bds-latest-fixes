import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-gray-100 p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">About Us - Brij Divine Stay</h1>
      <p className="text-gray-700 text-lg text-center mb-6">
        Welcome to <span className="font-semibold">Brij Divine Stay</span>, your trusted partner for comfortable and spiritual stays in the sacred lands of <span className="font-semibold">Brij, Mathura, and Vrindavan</span>. Our mission is to provide pilgrims, tourists, and travelers with the perfect blend of divine serenity and modern comfort while experiencing the holy essence of these sacred destinations.
      </p>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Story</h2>
        <p className="text-gray-700">
          Brij Divine Stay was founded with a vision to simplify hotel room bookings in one of the most spiritually significant regions of India. We understand the unique needs of devotees and travelers visiting Mathura and Vrindavan, and we strive to offer hassle-free, reliable, and affordable accommodations that enhance their journey.
        </p>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">What We Offer</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li><span className="font-semibold">Wide Range of Hotels</span> – From budget-friendly guest houses to luxurious stays.</li>
          <li><span className="font-semibold">Easy & Secure Booking</span> – A seamless and stress-free reservation experience.</li>
          <li><span className="font-semibold">Proximity to Sacred Sites</span> – Stay close to key temples and spiritual landmarks.</li>
          <li><span className="font-semibold">Comfort & Hygiene</span> – High hospitality standards for a pleasant stay.</li>
          <li><span className="font-semibold">24/7 Customer Support</span> – Always available to assist you.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Why Choose Brij Divine Stay?</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li><span className="font-semibold">Devotional Experience</span> – Stays curated with spiritual ambiance.</li>
          <li><span className="font-semibold">Affordable & Transparent Pricing</span> – No hidden charges.</li>
          <li><span className="font-semibold">Local Expertise</span> – Best recommendations with in-depth knowledge.</li>
        </ul>
      </section>
      <p className="text-center text-gray-700 font-medium">
        At <span className="font-semibold">Brij Divine Stay</span>, we believe that a peaceful and comfortable stay is an integral part of a fulfilling spiritual journey. Whether you are visiting for pilgrimage, leisure, or exploration, we are here to make your trip memorable and divine.
      </p>
      <p className="text-center text-blue-700 font-bold mt-6">Plan your stay with us today and immerse yourself in the sacred beauty of Brij!</p>
    </div>
  );
};

export default AboutUs;

