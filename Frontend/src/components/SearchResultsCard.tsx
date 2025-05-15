import { Link } from "react-router-dom";
import { HotelType } from "../../../backend/src/shared/types";
import { useSearchContext } from "../contexts/SearchContext";

type Props = {
  hotel: HotelType;
};

const SearchResultsCard = ({ hotel }: Props) => {
  const search = useSearchContext();

  // Helper function to check room availability and get price for the selected date
  const getRoomAvailabilityAndPrice = () => {
    const checkInDate = search.checkIn.toISOString().split("T")[0]; // Get check-in date in YYYY-MM-DD format
    const requiredRooms = search.roomCount;

    let availableRooms = 0;
    let priceForDate: string | number = "N/A";

    // Ensure hotel.rooms is an array and loop through each room
    for (const room of hotel.rooms || []) {
      // Find the price and availability entry that matches the check-in date
      const calendarEntry = room.priceCalendar?.find(
        (entry) =>
          new Date(entry.date).toISOString().split("T")[0] === checkInDate
      );

      if (calendarEntry) {
        // If we have a calendar entry for this date, use its price and availability
        if (calendarEntry.availableRooms > 0) {
          availableRooms += calendarEntry.availableRooms;
          priceForDate = calendarEntry.price;
        }
      } else {
        // If no calendar entry, check if the room is generally available
        if (room.availableRooms > 0) {
          availableRooms += room.availableRooms;
          priceForDate = room.defaultPrice || "N/A";
        }
      }
    }

    return {
      hasEnoughRooms: availableRooms >= requiredRooms,
      price: priceForDate,
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
      <div className="w-full h-[200px] md:h-[250px] lg:h-[300px] rounded-t-lg overflow-hidden mb-4">
        <img
          src={hotel.imageUrls[0]}
          alt={`${hotel.name} image`}
          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        {/* Details Container */}
        <div className="flex flex-col justify-between gap-4 flex-grow">
          {/* Hotel Name and Rating */}
          <div>
            <div className="flex items-center gap-2 mb-2">
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

          {/* Facilities */}
          <div className="flex flex-wrap gap-2 items-center mb-4">
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
