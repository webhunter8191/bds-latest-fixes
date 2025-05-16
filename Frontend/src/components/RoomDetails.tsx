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
      const dateString = date.toISOString().split("T")[0];
      const priceEntry = room.priceCalendar?.find(
        (entry) =>
          new Date(entry.date).toISOString().split("T")[0] === dateString
      );
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

      const dateString = new Date(search.checkIn).toISOString().split("T")[0];
      const priceEntry = room.priceCalendar?.find(
        (entry) =>
          new Date(entry.date).toISOString().split("T")[0] === dateString
      );
      return {
        price: priceEntry ? priceEntry.price : room.defaultPrice,
        availableRooms: priceEntry?.availableRooms ?? room.availableRooms,
      };
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
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room image */}
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={room.images[0]}
              alt={`${room.type} Room`}
              className="w-full h-[250px] sm:h-[300px] object-cover transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Room details */}
          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                {categories[room.category as keyof typeof categories]}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Price per night</span>
                  <span className="text-lg font-semibold text-[#6A5631]">
                    ₹{roomInfoForSelectedDate.price}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Available Rooms</span>
                  <span className="text-lg font-semibold text-[#6A5631]">
                    {roomInfoForSelectedDate.availableRooms}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 block text-sm">Adults</span>
                    <span className="font-semibold">{room.adultCount}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 block text-sm">
                      Children
                    </span>
                    <span className="font-semibold">{room.childCount}</span>
                  </div>
                </div>

                {/* Room Features */}
                {room.features && room.features.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Room Features
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {room.features.map((feature: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6A5631] bg-opacity-10 text-[#6A5631] rounded-lg text-sm"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
              </div>

              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-4 mt-4">
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
                    placeholderText="Check-in Date"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
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
                    placeholderText="Check-out Date"
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Price Calendar */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Price Calendar
                </h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {/* Weekday Headers */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day, idx) => (
                        <div
                          key={idx}
                          className="font-semibold text-gray-600 text-sm"
                        >
                          {day}
                        </div>
                      )
                    )}

                    {/* Dates with Prices */}
                    {Array.from({ length: 42 }).map((_, idx) => {
                      const currentDate = new Date();
                      currentDate.setDate(1);
                      const firstDayOfWeek = currentDate.getDay();
                      const date = new Date(currentDate);
                      date.setDate(idx - firstDayOfWeek + 1);

                      const isCurrentMonth =
                        date.getMonth() === currentDate.getMonth();
                      const { price } = getRoomInfoForDate(date);

                      const isInRange =
                        checkIn &&
                        checkOut &&
                        date >= checkIn &&
                        date < checkOut;

                      return (
                        <div
                          key={idx}
                          className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                            isCurrentMonth
                              ? isInRange
                                ? "bg-yellow-100"
                                : "hover:bg-gray-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {isCurrentMonth ? date.getDate() : ""}
                          </div>
                          {isCurrentMonth && (
                            <div className="text-xs text-[#6A5631] font-medium mt-1">
                              ₹{price}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

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
              className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                selectedRooms[room.category]
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-[#6A5631] hover:bg-[#5A4728] text-white"
              }`}
            >
              {selectedRooms[room.category] ? "Unselect Room" : "Select Room"}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default RoomCard;
