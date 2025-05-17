import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  checkIn: Date;
  checkOut: Date;
  roomCount: number;
  numberOfNights: number;
  hotel: HotelType;
  selectedRoomCategory?: string;
  selectedRoomPrice?: number;
  paymentOption?: "full" | "partial";
  fullAmount?: number;
  totalCost?: number;
};

const BookingDetailsSummary = ({
  checkIn,
  checkOut,
  roomCount,
  numberOfNights,
  hotel,
  selectedRoomCategory,
  selectedRoomPrice,
  paymentOption = "full",
  fullAmount,
  totalCost,
}: Props) => {
  // Calculate remaining amount for partial payment
  const displayFullAmount = fullAmount || totalCost || 0;
  const displayPartialAmount = totalCost || displayFullAmount * 0.3;
  const remainingAmount =
    paymentOption === "partial" ? displayFullAmount * 0.7 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-6 w-6 rounded-full bg-[#6A5631] flex items-center justify-center">
          <span className="text-white text-sm">📋</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Booking Details</h2>
      </div>

      {/* Hotel Details */}
      <div className="border-b border-gray-200 py-4">
        <div className="font-bold text-lg text-gray-800">{hotel.name}</div>
        <div className="text-gray-600 mt-1">{hotel.type}</div>
        <div className="flex flex-wrap gap-2 mt-3">
          {hotel.facilities.slice(0, 3).map((facility, index) => (
            <span
              key={index}
              className="bg-[#6A5631]/10 text-[#6A5631] px-3 py-1 rounded-full text-sm font-medium"
            >
              {facility}
            </span>
          ))}
        </div>
      </div>

      {/* Room Details */}
      {selectedRoomCategory && (
        <div className="border-b border-gray-200 py-4">
          <div className="text-gray-600 text-sm">Selected Room</div>
          <div className="font-semibold text-gray-800 mt-1">
            {selectedRoomCategory}
          </div>
          {selectedRoomPrice && (
            <div className="text-[#6A5631] font-bold mt-1">
              ₹{selectedRoomPrice} per night
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-200">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-600 text-sm">Check-in</div>
          <div className="font-semibold text-gray-800 mt-1">
            {checkIn.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-600 text-sm">Check-out</div>
          <div className="font-semibold text-gray-800 mt-1">
            {checkOut.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4 border-b border-gray-200">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-600 text-sm">Length of Stay</div>
          <div className="font-semibold text-gray-800 mt-1">
            {numberOfNights} nights
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-600 text-sm">Rooms</div>
          <div className="font-semibold text-gray-800 mt-1">
            {roomCount} {roomCount === 1 ? "Room" : "Rooms"}
          </div>
        </div>
      </div>

      {/* Payment Information */}
      {(displayFullAmount > 0 || displayPartialAmount > 0) && (
        <div className="py-4">
          <div className="text-gray-600 text-sm mb-3">Payment Option</div>
          <div className="bg-[#6A5631]/5 p-3 rounded-lg">
            <div className="font-semibold text-gray-800">
              {paymentOption === "partial"
                ? "Partial Payment (30%)"
                : "Full Payment"}
            </div>

            {paymentOption === "partial" && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Total Amount:</span>
                  <span className="font-medium">
                    ₹{Math.round(displayFullAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pay Now (30%):</span>
                  <span className="font-medium text-[#6A5631]">
                    ₹{Math.round(displayPartialAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Pay at Check-in (70%):</span>
                  <span>₹{Math.round(remainingAmount).toLocaleString()}</span>
                </div>
              </div>
            )}

            {paymentOption === "full" && (
              <div className="mt-2">
                <div className="flex justify-between text-sm">
                  <span>Total Amount:</span>
                  <span className="font-medium text-[#6A5631]">
                    ₹{Math.round(displayFullAmount).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsSummary;
