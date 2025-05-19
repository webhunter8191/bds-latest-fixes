import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";
import { useSearchContext } from "../contexts/SearchContext";
import { MapPin } from "lucide-react";

type Props = {
  hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
  const search = useSearchContext();

  // Helper function to check room availability and get price for the selected date
  const getRoomAvailabilityAndPrice = () => {
    // Format the date in YYYY-MM-DD, ensuring no timezone issues
    let formattedDate = "";

    if (search.checkIn) {
      // The critical part: use local date values instead of ISO strings to avoid timezone issues
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

    // Debug the search date being used
    console.log("🔍 Searching for price on date:", formattedDate);
    console.log("🗓️ Original search.checkIn:", search.checkIn);

    const requiredRooms = search.roomCount || 1;

    let availableRooms = 0;
    let pricesForDate: number[] = [];

    // Add logging for the hotel rooms data
    console.log(
      "🏨 Processing hotel:",
      hotel.name,
      "with",
      hotel.rooms?.length || 0,
      "rooms"
    );

    // Ensure hotel.rooms is an array and loop through each room
    for (const room of hotel.rooms || []) {
      console.log("🛏️ Room category:", room.category);
      console.log(
        "📅 Price calendar entries:",
        room.priceCalendar?.length || 0
      );

      // Find the price and availability entry that matches the check-in date
      const calendarEntry = room.priceCalendar?.find((entry) => {
        if (!entry || !entry.date) {
          return false;
        }

        let entryDate = "";
        try {
          // Handle both string and Date object formats
          if (typeof entry.date === "string") {
            // Parse date string, handling various formats
            const dateStr = entry.date as string; // Type assertion
            if (dateStr.includes("T")) {
              // If it's an ISO format with time
              entryDate = dateStr.split("T")[0];
            } else if (dateStr.includes("-")) {
              // If it's already YYYY-MM-DD
              entryDate = dateStr.substring(0, 10);
            } else {
              // Try to parse other formats
              const date = new Date(dateStr);
              entryDate = `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
            }
          } else {
            // It's a Date object or timestamp
            const dateObj = new Date(entry.date);
            entryDate = `${dateObj.getFullYear()}-${String(
              dateObj.getMonth() + 1
            ).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`;
          }

          const isMatch = entryDate === formattedDate;
          if (isMatch) {
            console.log(
              "✅ MATCH FOUND! Entry date:",
              entryDate,
              "Price:",
              entry.price
            );
          }
          return isMatch;
        } catch (error) {
          console.error("⚠️ Error parsing date:", error);
          return false;
        }
      });

      if (calendarEntry) {
        // If we have a calendar entry for this date, use its price and availability
        if (calendarEntry.availableRooms > 0) {
          availableRooms += calendarEntry.availableRooms;
          pricesForDate.push(calendarEntry.price);
          console.log("💰 Using calendar price:", calendarEntry.price);
        }
      } else {
        // If no calendar entry, check if the room is generally available
        if (room.availableRooms > 0) {
          availableRooms += room.availableRooms;
          if (room.defaultPrice) {
            pricesForDate.push(room.defaultPrice);
            console.log("💰 Using default price:", room.defaultPrice);
          }
        }
      }
    }

    // Sort prices to get the lowest available
    pricesForDate.sort((a, b) => a - b);
    console.log(
      "💲 Final prices:",
      pricesForDate,
      "Selected:",
      pricesForDate.length > 0 ? pricesForDate[0] : "N/A"
    );

    return {
      hasEnoughRooms: availableRooms >= requiredRooms,
      price: pricesForDate.length > 0 ? pricesForDate[0] : "N/A",
    };
  };

  const { hasEnoughRooms, price } = getRoomAvailabilityAndPrice();

  // If not enough rooms are available, don't render the card
  if (!hasEnoughRooms) {
    return null;
  }

  return (
    <div className="bg-white flex flex-col border border-slate-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 max-w-xs md:max-w-md lg:max-w-lg mx-auto">
      {/* Image Container */}
      <div className="w-full h-[200px] md:h-[250px] lg:h-[300px] rounded-t-lg overflow-hidden mb-2">
        <img
          src={hotel.imageUrls[0]}
          alt={`${hotel.name} image`}
          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        {/* Details Container */}
        <div className="flex flex-col justify-between gap-3 flex-grow">
          {/* Hotel Name and Rating */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-500 capitalize">
                {hotel.type}
              </span>
            </div>
            <Link
              to={`/detail/${hotel._id}`}
              className="text-lg md:text-xl font-bold text-blue-800 hover:text-blue-600 transition-colors duration-200"
            >
              {hotel.name}
            </Link>
          </div>

          {/* Location */}
          {hotel.location && (
            <div className="flex items-start gap-1 text-gray-600 mb-2">
              <MapPin size={16} className="mt-0.5" />
              <span className="text-sm">{hotel.location}</span>
            </div>
          )}

          {/* Nearby Temples */}
          {hotel.nearbyTemple && hotel.nearbyTemple.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Nearby Places:</p>
              <div className="flex flex-wrap gap-1">
                {hotel.nearbyTemple.slice(0, 4).map((temple, index) => (
                  <span
                    key={index}
                    className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-xs"
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
          <div className="flex flex-wrap gap-2 items-center mb-3">
            {hotel.facilities.slice(0, 3).map((facility, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-600 px-2 py-1 rounded-lg font-semibold text-xs md:text-sm whitespace-nowrap"
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

          {/* Price and CTA */}
          <div className="flex justify-between items-center mt-auto">
            <div className="text-left">
              <span className="block font-bold text-lg md:text-xl text-blue-800">
                Rs.{price}
              </span>
              <span className="text-sm font-normal text-gray-500">
                per night
              </span>
            </div>
            <Link
              to={`/detail/${hotel._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-blue-500 transition-colors duration-200"
              style={{ minWidth: "100px" }}
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsCard;
