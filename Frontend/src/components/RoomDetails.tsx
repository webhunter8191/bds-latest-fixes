import { memo, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSearchContext } from "../contexts/SearchContext";

interface Room {
  _id: string;
  category: number;
  type: string;
  images: string[];
  availableRooms: number;
  adultCount: number;
  childCount: number;
  defaultPrice: number;
  features: string[];
  priceCalendar: {
    date: string;
    price: number;
    availableRooms: number;
  }[];
}

interface RoomCardProps {
  room: Room;
  categories: Record<number, string>;
  handleRoomSelection: (
    availableRooms: number,
    category: number,
    price: number,
    roomId: string
  ) => void;
  selectedRooms: Record<number, boolean>;
}

const RoomCard = memo(
  ({ room, categories, handleRoomSelection, selectedRooms }: RoomCardProps) => {
    const search = useSearchContext();
    const [checkIn, setCheckIn] = useState<Date | null>(null);
    const [checkOut, setCheckOut] = useState<Date | null>(null);

    // Function to get room info for a specific date
    const getRoomInfoForDate = (date: Date) => {
      // Format the input date as YYYY-MM-DD without timezone issues
      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      const priceEntry = room.priceCalendar?.find((entry) => {
        // Format entry date consistently
        const entryDateString =
          typeof entry.date === "string"
            ? entry.date.substring(0, 10)
            : `${new Date(entry.date).getFullYear()}-${String(
                new Date(entry.date).getMonth() + 1
              ).padStart(2, "0")}-${String(
                new Date(entry.date).getDate()
              ).padStart(2, "0")}`;

        return entryDateString === dateString;
      });

      return {
        price: priceEntry ? priceEntry.price : room.defaultPrice,
        availableRooms: priceEntry?.availableRooms ?? room.availableRooms,
      };
    };

    // Get room info for the search date
    const getRoomInfoForSearchDate = () => {
      if (!search.checkIn)
        return {
          price: room.defaultPrice,
          availableRooms: room.availableRooms,
        };

      return getRoomInfoForDate(new Date(search.checkIn));
    };

    // Get room info for the selected check-in date
    const roomInfoForSelectedDate = checkIn
      ? getRoomInfoForDate(new Date(checkIn))
      : getRoomInfoForSearchDate();

    // Function to get minimum available rooms across date range
    const getMinAvailableRooms = () => {
      if (!checkIn || !checkOut) return room.availableRooms;

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      let minAvailableRooms = Infinity;

      for (
        let currentDate = new Date(checkInDate);
        currentDate < checkOutDate;
        currentDate.setDate(currentDate.getDate() + 1)
      ) {
        const { availableRooms } = getRoomInfoForDate(currentDate);
        minAvailableRooms = Math.min(minAvailableRooms, availableRooms);
      }

      return minAvailableRooms === Infinity
        ? room.availableRooms
        : minAvailableRooms;
    };

    // Get minimum available rooms for the selected date range
    const minAvailableRooms = getMinAvailableRooms();

    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="flex flex-col lg:flex-row">
          {/* Room image with overlaid category badge */}
          <div className="relative lg:w-2/5 overflow-hidden">
            <img
              src={
                room.images && room.images.length > 0
                  ? room.images[0]
                  : "https://via.placeholder.com/600x400?text=Room+Image"
              }
              alt={`${categories[room.category] || "Room"}`}
              className="w-full h-[280px] object-cover transition-transform duration-500 hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src =
                  "https://via.placeholder.com/600x400?text=Room+Image";
              }}
            />
            <div className="absolute top-4 left-0 bg-[#6A5631] text-white py-1 px-3 rounded-r-full shadow-md">
              <span className="font-medium">
                {categories[room.category] || "Room"}
              </span>
            </div>
          </div>

          {/* Room details */}
          <div className="lg:w-3/5 p-5 lg:p-6 flex flex-col">
            <div className="space-y-5">
              {/* Room Title and Price */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 pb-3 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">
                  {categories[room.category]}
                </h3>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-500 line-through">
                    ₹{Math.round(roomInfoForSelectedDate.price * 1.2)}
                  </span>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-[#6A5631]">
                      ₹{roomInfoForSelectedDate.price}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">/night</span>
                  </div>
                </div>
              </div>

              {/* Room Stats - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <span className="text-gray-500 text-sm block">Available</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {roomInfoForSelectedDate.availableRooms} Rooms
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <span className="text-gray-500 text-sm block">Capacity</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {room.adultCount + room.childCount} Guests
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <span className="text-gray-500 text-sm block">Adults</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {room.adultCount}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <span className="text-gray-500 text-sm block">Children</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {room.childCount}
                  </span>
                </div>
              </div>

              {/* Room Features */}
              {room.features && room.features.length > 0 && (
                <div>
                  <h4 className="text-base font-medium text-gray-800 mb-2">
                    Room Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6A5631] bg-opacity-10 text-[#6A5631] rounded-full text-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Date Selection */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <h4 className="text-base font-medium text-gray-800 mb-3">
                  Select Dates
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in Date
                    </label>
                    <DatePicker
                      selected={checkIn}
                      onChange={(date) => setCheckIn(date)}
                      selectsStart
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={new Date()}
                      placeholderText="Select date"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A5631] focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out Date
                    </label>
                    <DatePicker
                      selected={checkOut}
                      onChange={(date) => setCheckOut(date)}
                      selectsEnd
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={checkIn || new Date()}
                      placeholderText="Select date"
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A5631] focus:border-transparent text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Simplified Price Calendar */}
              <div className="hidden sm:block">
                <h4 className="text-base font-medium text-gray-800 mb-2">
                  Price Calendar
                </h4>
                <div className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                  <div className="grid grid-cols-7 border-b border-gray-200">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                      <div
                        key={idx}
                        className="text-center p-2 text-xs font-semibold text-gray-600 border-r last:border-r-0 border-gray-200"
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-gray-200 text-center">
                    {Array.from({ length: 28 }).map((_, idx) => {
                      const currentDate = new Date();
                      currentDate.setDate(1);
                      const firstDayOfWeek = currentDate.getDay();
                      const date = new Date(currentDate);
                      date.setDate(idx - firstDayOfWeek + 1);

                      const isCurrentMonth =
                        date.getMonth() === currentDate.getMonth();
                      const { price, availableRooms } =
                        getRoomInfoForDate(date);
                      const isSpecialPrice = price !== room.defaultPrice;
                      const isInRange =
                        checkIn &&
                        checkOut &&
                        date >= checkIn &&
                        date < checkOut;

                      // Format date for display
                      const dateString = date.getDate();

                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center justify-center h-full py-1 ${
                            !isCurrentMonth
                              ? "opacity-40 bg-gray-100"
                              : isInRange
                              ? "bg-yellow-50 border border-yellow-200"
                              : isSpecialPrice
                              ? "bg-white border border-[#6A5631] border-opacity-20"
                              : "bg-white"
                          }`}
                        >
                          {isCurrentMonth ? (
                            <>
                              <div
                                className={`text-xs font-medium ${
                                  isSpecialPrice
                                    ? "text-[#6A5631]"
                                    : "text-gray-800"
                                }`}
                              >
                                {dateString}
                              </div>
                              <div
                                className={`text-[10px] font-medium ${
                                  isSpecialPrice
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                ₹{price}
                              </div>
                              {availableRooms < room.availableRooms && (
                                <div className="text-[8px] text-blue-600">
                                  {availableRooms} left
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-xs text-gray-400">
                              {dateString}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Calendar - Simplified list view for dates with special pricing */}
              <div className="sm:hidden">
                <h4 className="text-base font-medium text-gray-800 mb-2">
                  Special Pricing
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {room.priceCalendar && room.priceCalendar.length > 0 ? (
                    room.priceCalendar.map((entry, idx) => {
                      const entryDate = new Date(entry.date);
                      const formattedDate = new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(entryDate);

                      return (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-2 bg-white border border-gray-100 rounded-lg"
                        >
                          <span className="text-sm font-medium">
                            {formattedDate}
                          </span>
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-bold text-[#6A5631]">
                              ₹{entry.price}
                            </span>
                            <span className="text-xs text-blue-600">
                              {entry.availableRooms} rooms
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-gray-500 italic p-2">
                      No special pricing dates available
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Select Button */}
            <button
              type="button"
              onClick={() =>
                handleRoomSelection(
                  minAvailableRooms,
                  room.category,
                  roomInfoForSelectedDate.price,
                  room._id
                )
              }
              className={`w-full mt-5 py-3.5 px-4 rounded-lg font-semibold transition-colors duration-200 text-white ${
                selectedRooms[room.category]
                  ? "bg-gray-700 hover:bg-gray-800"
                  : "bg-[#6A5631] hover:bg-[#5A4728]"
              }`}
            >
              {selectedRooms[room.category] ? (
                <span className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Unselect Room
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Select Room
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default RoomCard;
