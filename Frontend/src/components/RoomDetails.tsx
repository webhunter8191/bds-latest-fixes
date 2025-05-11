import React, { memo } from "react";

const RoomCard = memo(({ room, categories, handleRoomSelection, selectedRooms }: any) => {
  const getPriceForToday = (room: any) => {
    const today = new Date().toISOString().split("T")[0];
    const priceEntry = room.priceCalendar?.find(
      (entry: { date: string; price: number }) =>
        new Date(entry.date).toISOString().split("T")[0] === today
    );
    return priceEntry ? priceEntry.price : room.defaultPrice;
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md grid grid-cols-1 gap-4">
      {/* Room image */}
      <div className="flex justify-center">
        <img
          src={room.images[0]}
          alt={`${room.type} Room`}
          className="rounded-md w-full h-60 sm:h-40 md:h-25 lg:h-50 object-cover"
        />
      </div>

      {/* Room details */}
      <div className="flex flex-col justify-start gap-4">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-4">
          {categories[room.category as keyof typeof categories]}
        </h3>
        <div className="text-gray-600 text-sm sm:text-base">
          <p>Price: ₹ {getPriceForToday(room)} /night</p>
          <p>Available Rooms: {room.availableRooms}</p>
          <p>Adults Allowed: {room.adultCount}</p>
          <p>Children Allowed: {room.childCount}</p>
        </div>

        {/* Price-wise Calendar */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Price Calendar:</h4>
          <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-7 gap-3 text-center">
              {/* Weekday Headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                <div key={idx} className="font-bold text-gray-700">
                  {day}
                </div>
              ))}

              {/* Dates with Prices */}
              {Array.from({ length: 42 }).map((_, idx) => {
                const currentDate = new Date();
                currentDate.setDate(1);
                const firstDayOfWeek = currentDate.getDay();
                const date = new Date(currentDate);
                date.setDate(idx - firstDayOfWeek + 1);

                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const priceEntry = room.priceCalendar?.find(
                  (entry: { date: string; price: number }) =>
                    new Date(entry.date).toDateString() === date.toDateString()
                );

                const priceToShow = priceEntry ? priceEntry.price : room.defaultPrice;

                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center h-10 justify-center p-2 border rounded-sm ${
                      isCurrentMonth ? "" : "bg-gray-200"
                    }`}
                  >
                    <div className="font-bold text-sm">{isCurrentMonth ? date.getDate() : ""}</div>
                    {isCurrentMonth && (
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 text-black text-xs font-semibold rounded-full mt-1">
                        ₹{priceToShow}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            handleRoomSelection(
              room.availableRooms,
              room.category,
              getPriceForToday(room),
              room._id
            )
          }
          className="w-full bg-[#6A5631] text-white py-2 rounded-lg hover:bg-[#5A4728] transition duration-200"
        >
          {selectedRooms[room.category] ? "Unselect Room" : "Select Room"}
        </button>
      </div>
    </div>
  );
});

export default RoomCard;