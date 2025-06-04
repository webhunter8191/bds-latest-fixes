import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";
import { useSearchContext } from "../contexts/SearchContext";
import { MapPin } from "lucide-react";

type Props = {
  hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
  const search = useSearchContext();

  // Determines room availability and price for the selected date
  const getRoomAvailabilityAndPrice = () => {
    let formattedDate = "";

    if (search.checkIn) {
      const checkIn = search.checkIn;
      formattedDate = `${checkIn.getFullYear()}-${String(
        checkIn.getMonth() + 1
      ).padStart(2, "0")}-${String(checkIn.getDate()).padStart(2, "0")}`;
    } else {
      const today = new Date();
      formattedDate = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    }

    const requiredRooms = search.roomCount || 1;
    let availableRooms = 0;
    let pricesForDate: number[] = [];

    // Check each room for availability and price on the selected date
    for (const room of hotel.rooms || []) {
      const calendarEntry = room.priceCalendar?.find((entry) => {
        if (!entry || !entry.date) {
          return false;
        }

        let entryDate = "";
        try {
          if (typeof entry.date === "string") {
            const dateStr = entry.date as string;
            if (dateStr.includes("T")) {
              entryDate = dateStr.split("T")[0];
            } else if (dateStr.includes("-")) {
              entryDate = dateStr.substring(0, 10);
            } else {
              const date = new Date(dateStr);
              entryDate = `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            }
          } else {
            const dateObj = new Date(entry.date);
            entryDate = `${dateObj.getFullYear()}-${String(
              dateObj.getMonth() + 1
            ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
          }
          return entryDate === formattedDate;
        } catch {
          return false;
        }
      });

      if (calendarEntry) {
        if (calendarEntry.availableRooms > 0) {
          availableRooms += calendarEntry.availableRooms;
          pricesForDate.push(calendarEntry.price);
        }
      } else {
        if (room.availableRooms > 0) {
          availableRooms += room.availableRooms;
          if (room.defaultPrice) {
            pricesForDate.push(room.defaultPrice);
          }
        }
      }
    }

    pricesForDate.sort((a, b) => a - b);

    return {
      hasEnoughRooms: availableRooms >= requiredRooms,
      price: pricesForDate.length > 0 ? pricesForDate[0] : "N/A",
    };
  };

  const { hasEnoughRooms, price } = getRoomAvailabilityAndPrice();

  // Do not render the card if there are not enough rooms available
  if (!hasEnoughRooms) {
    return null;
  }

  return (
    <div className="bg-white flex flex-col border border-slate-200 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 max-w-xs md:max-w-md lg:max-w-lg mx-auto overflow-hidden">
      {/* Image Container */}
      <div className="w-full h-[220px] md:h-[260px] lg:h-[320px] rounded-t-2xl overflow-hidden mb-2 group relative">
        <img
          src={hotel.imageUrls[0]}
          alt={`${hotel.name} image`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-brand text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
          {hotel.type}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-grow">
        {/* Hotel Name and Rating */}
        <div>
          <Link
            to={`/detail/${hotel._id}`}
            className="text-xl md:text-2xl font-bold text-brand hover:text-[#8B7442] transition-colors duration-200"
          >
            {hotel.name}
          </Link>
        </div>

        {/* Location */}
        {hotel.location && (
          <div className="flex items-center gap-1 text-gray-600 mb-1">
            <MapPin size={18} className="mt-0.5 text-brand" />
            <span className="text-sm font-medium">{hotel.location}</span>
          </div>
        )}

        {/* Nearby Temples */}
        {hotel.nearbyTemple && hotel.nearbyTemple.length > 0 && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 mb-1 font-semibold">
              Nearby Places:
            </p>
            <div className="flex flex-wrap gap-1">
              {hotel.nearbyTemple.slice(0, 4).map((temple, index) => (
                <span
                  key={index}
                  className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs font-medium"
                >
                  {temple}
                </span>
              ))}
              {hotel.nearbyTemple.length > 4 && (
                <span className="text-xs text-gray-500 py-1">
                  +{hotel.nearbyTemple.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Facilities */}
        <div className="flex flex-wrap gap-2 items-center mb-2">
          {hotel.facilities.slice(0, 3).map((facility, index) => (
            <span
              key={index}
              className="bg-brand/10 text-brand px-2 py-1 rounded-lg font-semibold text-xs md:text-sm whitespace-nowrap border border-brand/20"
            >
              {facility}
            </span>
          ))}
          {hotel.facilities.length > 3 && (
            <span className="text-xs md:text-sm text-gray-500">
              {`+${hotel.facilities.length - 3} more`}
            </span>
          )}
        </div>

        {/* Price and Call to Action */}
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-100">
          <div className="text-left">
            <span className="block font-bold text-xl md:text-2xl text-brand">
              Rs.{price}
            </span>
            <span className="text-sm font-normal text-gray-500">per night</span>
          </div>
          <Link
            to={`/detail/${hotel._id}`}
            className="bg-brand hover:bg-[#8B7442] text-white px-5 py-2 rounded-lg font-semibold text-center transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-brand/50"
            style={{ minWidth: "110px" }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;
