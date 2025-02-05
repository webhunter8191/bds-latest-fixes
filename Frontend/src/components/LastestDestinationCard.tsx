import { useState } from "react";
import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  hotel: HotelType;
  onImageLoad: () => void; // Notify parent when image loads
};

const LatestDestinationCard = ({ hotel, onImageLoad }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Link
      to={`/detail/${hotel._id}`}
      className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg transform transition-transform hover:scale-105"
    >
      {/* Image Container */}
      <div className="relative w-full h-48 sm:h-56 md:h-55 lg:h-72 xl:h-70 overflow-hidden rounded-t-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300 animate-pulse">
            <span className="text-gray-500 text-sm">Loading...</span>
          </div>
        )}

        <img
          src={hotel.imageUrls[0]}
          alt={hotel.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => {
            setIsLoading(false);
            onImageLoad(); // Notify parent component
          }}
        />
      </div>

      {/* Overlay with text */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-b-lg">
        <span className="text-white font-bold tracking-tight text-base sm:text-lg md:text-xl lg:text-2xl">
          {hotel.name}
        </span>
      </div>
    </Link>
  );
};

export default LatestDestinationCard;
