import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Info } from "lucide-react";

type Props = {
  hotelId: string;
  pricePerNight: number;
  availableRooms: number;
  roomsId: string;
  priceCalendar: {
    date: string;
    price: number;
    availableRooms: number;
  }[];
  defaultPrice: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  roomCount: number;
  totalCost: number;
  paymentOption: "full" | "partial";
};

const GuestInfoForm = ({
  hotelId,
  availableRooms,
  roomsId,
  priceCalendar = [],
  defaultPrice,
}: Props) => {
  const search = useSearchContext();
  const { isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [showFullPaymentPolicy, setShowFullPaymentPolicy] = useState(false);
  const [showPartialPaymentPolicy, setShowPartialPaymentPolicy] =
    useState(false);

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      roomCount: search.roomCount,
      totalCost: 0,
      paymentOption: "full",
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const paymentOption = watch("paymentOption");

  // Minimum and maximum date constraints
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  // Function to get the price and available rooms for a specific date
  const getRoomInfoForDate = (date: Date) => {
    // Format the input date as YYYY-MM-DD without timezone issues
    const dateString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    const matchingEntry = priceCalendar.find((entry) => {
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
      price: matchingEntry ? matchingEntry.price : defaultPrice,
      availableRooms: matchingEntry?.availableRooms ?? availableRooms,
    };
  };

  // Function to get minimum available rooms across date range
  const getMinAvailableRooms = () => {
    if (!checkIn || !checkOut) return availableRooms;

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

    return minAvailableRooms === Infinity ? availableRooms : minAvailableRooms;
  };

  // Get room info for the selected check-in date
  const roomInfoForSelectedDate = checkIn
    ? getRoomInfoForDate(new Date(checkIn))
    : { price: defaultPrice, availableRooms };

  // Get minimum available rooms for the selected date range
  const minAvailableRooms = getMinAvailableRooms();

  // Calculate the total cost dynamically
  const calculateTotalCost = () => {
    if (!checkIn || !checkOut) return 0;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Format dates as YYYY-MM-DD for comparison
    const checkInString = `${checkInDate.getFullYear()}-${String(
      checkInDate.getMonth() + 1
    ).padStart(2, "0")}-${String(checkInDate.getDate()).padStart(2, "0")}`;
    const checkOutString = `${checkOutDate.getFullYear()}-${String(
      checkOutDate.getMonth() + 1
    ).padStart(2, "0")}-${String(checkOutDate.getDate()).padStart(2, "0")}`;

    // If check-in and check-out dates are the same, charge for 1 day
    if (checkInString === checkOutString) {
      return getRoomInfoForDate(checkInDate).price * watch("roomCount");
    }

    let totalCost = 0;
    for (
      let currentDate = new Date(checkInDate);
      currentDate < checkOutDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      totalCost += getRoomInfoForDate(currentDate).price;
    }

    return totalCost * watch("roomCount");
  };

  // Calculate tax based on room price
  const calculateTax = (price: number) => {
    const taxRate = price < 7000 ? 0.12 : 0.18;
    return Math.round(price * taxRate);
  };

  const onSignInClick = (data: GuestInfoFormData) => {
    const subtotal = calculateTotalCost();
    const tax = calculateTax(subtotal);
    const totalWithTax = subtotal + tax;
    const finalAmount =
      data.paymentOption === "partial" ? totalWithTax * 0.3 : totalWithTax;

    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.roomCount,
      finalAmount
    );
    navigate("/sign-in", {
      state: {
        from: location,
        totalCost: finalAmount,
        paymentOption: data.paymentOption,
        fullAmount: totalWithTax,
      },
    });
  };

  const onSubmit = (data: GuestInfoFormData) => {
    const subtotal = calculateTotalCost();
    const tax = calculateTax(subtotal);
    const totalWithTax = subtotal + tax;
    const finalAmount =
      data.paymentOption === "partial" ? totalWithTax * 0.3 : totalWithTax;

    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.roomCount,
      finalAmount
    );

    navigate(`/hotel/${hotelId}/booking`, {
      state: {
        totalCost: finalAmount,
        subtotal: subtotal,
        tax: tax,
        roomsId,
        paymentOption: data.paymentOption,
        fullAmount: totalWithTax,
      },
    });
  };

  // Function to set check-out date to next day
  const handleCheckInChange = (date: Date | null) => {
    if (date) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      setValue("checkIn", date);
      setValue("checkOut", nextDay);
    } else {
      setValue("checkIn", null as unknown as Date);
    }
  };

  // Custom render function for the date picker to show prices and availability
  const renderDayContents = (day: number, date: Date) => {
    const { price } = getRoomInfoForDate(date);
    const isSpecialPrice = price !== defaultPrice;

    // Format current date as YYYY-MM-DD
    const dateString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    // Format checkIn and checkOut dates consistently
    const checkInString = checkIn
      ? `${checkIn.getFullYear()}-${String(checkIn.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(checkIn.getDate()).padStart(2, "0")}`
      : "";

    const checkOutString = checkOut
      ? `${checkOut.getFullYear()}-${String(checkOut.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(checkOut.getDate()).padStart(2, "0")}`
      : "";

    // Check if this date is selected (either checkIn or checkOut)
    const isSelected =
      dateString === checkInString || dateString === checkOutString;

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <span className="text-[15px] font-semibold">{day}</span>
        <span
          className={`mt-0 px-1 rounded block
            ${
              isSelected
                ? "text-white font-bold"
                : isSpecialPrice
                ? "text-white-800 "
                : "text-gray-400"
            } text-[8px]`}
          style={{ minWidth: 20, textAlign: "center" }}
        >
          ₹{price}
        </span>
      </div>
    );
  };

  // Calculate remaining amount for partial payment
  const calculateRemainingAmount = () => {
    const subtotal = calculateTotalCost();
    const tax = calculateTax(subtotal);
    const totalWithTax = subtotal + tax;
    return totalWithTax * 0.7; // 70% remaining
  };

  return (
    <div className="max-w-md mx-auto flex flex-col gap-4">
      {/* Header Section: Price, Discount, Taxes */}
      <div className="flex flex-col gap-1 border-b pb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-black">
              ₹{roomInfoForSelectedDate.price}
            </span>
            <div className="text-sm text-gray-500">
              + taxes & fees: ₹{calculateTax(roomInfoForSelectedDate.price)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg text-gray-400 line-through">
              ₹{roomInfoForSelectedDate.price * 2}
            </span>
            <span className="text-md text-yellow-600 font-semibold">
              50% off
            </span>
          </div>
        </div>
      </div>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center bg-white p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <DatePicker
              required
              selected={checkIn}
              onChange={handleCheckInChange}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-in Date"
              renderDayContents={renderDayContents}
              className="min-w-full bg-white p-2 border rounded focus:outline-none"
              wrapperClassName="min-w-full"
              dateFormat="dd/MM/yyyy"
              calendarClassName="custom-datepicker-calendar"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date
            </label>
            <DatePicker
              required
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsEnd
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-out Date"
              renderDayContents={renderDayContents}
              className="min-w-full bg-white p-2 border rounded focus:outline-none"
              wrapperClassName="min-w-full"
              dateFormat="dd/MM/yyyy"
              calendarClassName="custom-datepicker-calendar"
            />
          </div>
          <div className="flex bg-white px-2 py-1 gap-2 border rounded items-center">
            <label className="items-center flex">
              Rooms:
              <input
                className="w-full p-1 focus:outline-none font-bold ml-2"
                type="number"
                min={1}
                max={minAvailableRooms}
                {...register("roomCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least one room",
                  },
                  max: {
                    value: minAvailableRooms,
                    message: `Maximum ${minAvailableRooms} rooms available for selected dates`,
                  },
                  valueAsNumber: true,
                })}
              />
            </label>

            {errors.roomCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.roomCount.message}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {minAvailableRooms} rooms available for selected dates
          </div>
          {/* Payment Options */}
          <div className="mt-4 mb-2">
            <h3 className="font-medium text-gray-700 mb-2">Payment Option</h3>
            <div className="flex flex-col gap-2">
              <div className="relative">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="full"
                    {...register("paymentOption")}
                    className="text-[#6A5631]"
                  />
                  <span>
                    Pay full amount (₹
                    {(
                      calculateTotalCost() + calculateTax(calculateTotalCost())
                    ).toFixed(2)}
                    )
                  </span>
                  <button
                    type="button"
                    className="text-[#6A5631] hover:text-[#5a4827]"
                    onClick={() => {
                      setShowFullPaymentPolicy(!showFullPaymentPolicy);
                      setShowPartialPaymentPolicy(false);
                    }}
                  >
                    <Info size={16} />
                  </button>
                </label>
                {showFullPaymentPolicy && (
                  <div className="absolute left-0 mt-1 p-3 bg-white border border-[#6A5631]/20 rounded-md shadow-md z-10 text-sm text-gray-700 max-w-xs">
                    <strong className="block mb-1">Cancellation Policy:</strong>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        If you cancel at least 12 hours before check-in: 100%
                        refund.
                      </li>
                      <li>
                        If you cancel less than 12 hours before check-in: No
                        refund.
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="partial"
                    {...register("paymentOption")}
                    className="text-[#6A5631]"
                  />
                  <span>
                    Pay 30% now (₹
                    {(
                      (calculateTotalCost() +
                        calculateTax(calculateTotalCost())) *
                      0.3
                    ).toFixed(2)}
                    )
                  </span>
                  <button
                    type="button"
                    className="text-[#6A5631] hover:text-[#5a4827]"
                    onClick={() => {
                      setShowPartialPaymentPolicy(!showPartialPaymentPolicy);
                      setShowFullPaymentPolicy(false);
                    }}
                  >
                    <Info size={16} />
                  </button>
                </label>
                {showPartialPaymentPolicy && (
                  <div className="absolute left-0 mt-1 p-3 bg-white border border-[#6A5631]/20 rounded-md shadow-md z-10 text-sm text-gray-700 max-w-xs">
                    <strong className="block mb-1">Cancellation Policy:</strong>
                    <p>
                      No cancellations allowed under any circumstances. No
                      refund will be issued for the 30% booking amount.
                    </p>
                  </div>
                )}
              </div>

              {paymentOption === "partial" && (
                <div className="text-sm text-gray-600 mt-1 pl-6">
                  Remaining amount of ₹{calculateRemainingAmount().toFixed(2)}{" "}
                  to be paid at check-in
                </div>
              )}
            </div>
          </div>
          {/* Price Details */}
          <div className="p-3 bg-gray-50 rounded-lg space-y-2 mt-4">
            <div className="font-semibold">Price Details</div>
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₹{calculateTotalCost().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>
                Tax ({roomInfoForSelectedDate.price < 7000 ? "12%" : "18%"}):
              </span>
              <span>₹{calculateTax(calculateTotalCost()).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl mt-2 border-t pt-2">
              <span>
                {paymentOption === "partial" ? "Pay Now (30%):" : "Total:"}
              </span>
              <span>
                ₹
                {paymentOption === "partial"
                  ? (
                      (calculateTotalCost() +
                        calculateTax(calculateTotalCost())) *
                      0.3
                    ).toFixed(2)
                  : (
                      calculateTotalCost() + calculateTax(calculateTotalCost())
                    ).toFixed(2)}
              </span>
            </div>
            {paymentOption === "partial" && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Pay Later (70%):</span>
                <span>₹{calculateRemainingAmount().toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Terms and conditions agreement */}
          <div className="text-xs text-gray-600 text-center px-2">
            By clicking "Book Now", you agree to our{" "}
            <a
              href="/terms-and-conditions"
              className="text-[#6A5631] hover:underline"
              target="_blank"
            >
              Terms &amp; Conditions
            </a>{" "}
            and{" "}
            <a
              href="/privacy-policy"
              className="text-[#6A5631] hover:underline"
              target="_blank"
            >
              Privacy Policy
            </a>
          </div>

          {isLoggedIn ? (
            <button
              className="bg-[#6A5631] text-white h-full p-2 font-bold hover:bg-[#6A5631] rounded-lg text-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={
                !roomInfoForSelectedDate.price ||
                roomInfoForSelectedDate.price === 0
              }
            >
              Book Now
            </button>
          ) : (
            <button
              className="bg-[#6A5631] text-white h-full p-2 font-bold hover:bg-[#6A5631] text-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={
                !roomInfoForSelectedDate.price ||
                roomInfoForSelectedDate.price === 0
              }
            >
              Sign in to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GuestInfoForm;
