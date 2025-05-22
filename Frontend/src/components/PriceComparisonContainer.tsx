import React, { useState } from "react";
import PriceComparisonByLocation from "./PriceComparisonByLocation";
import { useNavigate } from "react-router-dom";

const PriceComparisonContainer: React.FC = () => {
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleHotelSelect = (hotelId: string) => {
    setSelectedHotelId(hotelId);
    // Navigate to the hotel detail page
    navigate(`/detail/${hotelId}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Price Comparison Tool
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find the best hotel deals across different locations. Compare prices,
          view statistics, and discover accommodations that offer great value
          for your stay.
        </p>
      </div>

      <PriceComparisonByLocation onHotelSelect={handleHotelSelect} />

      <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-inner">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          Why Compare Hotel Prices?
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-[#6A5631] mr-2">✓</span>
            <span>
              Save up to 30% by finding hotels priced below location average
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-[#6A5631] mr-2">✓</span>
            <span>
              Compare facilities and amenities across similarly priced options
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-[#6A5631] mr-2">✓</span>
            <span>Discover nearby temple locations to optimize your stay</span>
          </li>
          <li className="flex items-start">
            <span className="text-[#6A5631] mr-2">✓</span>
            <span>Find the best balance of price, quality, and location</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PriceComparisonContainer;
