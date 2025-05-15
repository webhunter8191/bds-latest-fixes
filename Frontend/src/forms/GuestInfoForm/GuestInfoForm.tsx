import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  hotelId: string;
  pricePerNight: number;
  availableRooms: number;
  roomsId: string;
  priceCalendar?: { date: string; price: number }[]; // Optional price calendar
  defaultPrice: number; // Default price per night
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  roomCount: number;
  totalCost: number;
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
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  // Minimum and maximum date constraints
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  // Function to get the price for a specific date
  const getPriceForDate = (date: Date) => {
    const matchingEntry = priceCalendar.find(
      (entry) => new Date(entry.date).toDateString() === date.toDateString()
    );
    return matchingEntry ? matchingEntry.price : defaultPrice;
  };

  // Dynamically get the price for the selected check-in date
  const priceForSelectedDate = checkIn
    ? getPriceForDate(new Date(checkIn))
    : defaultPrice;

  // Calculate the total cost dynamically
  const calculateTotalCost = () => {
    if (!checkIn || !checkOut) return 0;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // If check-in and check-out dates are the same, charge for 1 day
    if (checkInDate.toDateString() === checkOutDate.toDateString()) {
      return getPriceForDate(checkInDate) * watch("roomCount");
    }

    let totalCost = 0;
    for (
      let currentDate = new Date(checkInDate);
      currentDate < checkOutDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      totalCost += getPriceForDate(currentDate);
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

    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.roomCount,
      totalWithTax
    );
    navigate("/sign-in", {
      state: { from: location, totalCost: totalWithTax },
    });
  };

  const onSubmit = (data: GuestInfoFormData) => {
    const subtotal = calculateTotalCost();
    const tax = calculateTax(subtotal);
    const totalWithTax = subtotal + tax;

    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.roomCount,
      totalWithTax
    );

    // Navigate with the total cost state including tax
    navigate(`/hotel/${hotelId}/booking`, {
      state: {
        totalCost: totalWithTax,
        subtotal: subtotal,
        tax: tax,
        roomsId,
      },
    });
  };

  // Custom render function for the date picker to show prices
  const renderDayContents = (day: number, date: Date) => {
    const price = getPriceForDate(date);
    const isSpecialPrice = price !== defaultPrice;

    // Check if this date is selected (either checkIn or checkOut)
    const isSelected =
      (checkIn &&
        new Date(date).toDateString() === new Date(checkIn).toDateString()) ||
      (checkOut &&
        new Date(date).toDateString() === new Date(checkOut).toDateString());

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

  return (
    <div className="max-w-md mx-auto  flex flex-col gap-4">
      {/* Header Section: Price, Discount, Taxes */}
      <div className="flex flex-col gap-1 border-b pb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-black">
              ₹{priceForSelectedDate}
            </span>
            <div className="text-sm text-gray-500">
              + taxes & fees: ₹{calculateTax(priceForSelectedDate)}
              {/* <span className="text-xs text-gray-400 ml-1">
                ({priceForSelectedDate < 7000 ? "12%" : "18%"} tax rate)
              </span> */}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg text-gray-400 line-through">
              ₹{priceForSelectedDate * 2}
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
        <div className="grid grid-cols-1 gap-4 items-center  bg-white p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <DatePicker
              required
              selected={checkIn}
              onChange={(date) => setValue("checkIn", date as Date)}
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
                className="w-full p-1 focus:outline-none font-bold  ml-2"
                type="number"
                min={1}
                max={availableRooms}
                {...register("roomCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least one room",
                  },
                  max: {
                    value: availableRooms,
                    message: `Maximum ${availableRooms} rooms available`,
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

          {/* Display the total price calculation */}
          <div className="bg-white px-2 py-1">
            <div className="font-semibold">Price Details</div>
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>₹{calculateTotalCost().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax ({priceForSelectedDate < 7000 ? "12%" : "18%"}):</span>
              <span>₹{calculateTax(calculateTotalCost()).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl mt-2 border-t pt-2">
              <span>Total:</span>
              <span>
                ₹
                {(
                  calculateTotalCost() + calculateTax(calculateTotalCost())
                ).toFixed(2)}
              </span>
            </div>
          </div>

          {isLoggedIn ? (
            <button
              className="bg-[#6A5631] text-white h-full p-2 font-bold hover:bg-[#6A5631] rounded-lg text-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!priceForSelectedDate || priceForSelectedDate === 0}
            >
              Book Now
            </button>
          ) : (
            <button
              className="bg-[#6A5631] text-white h-full p-2 font-bold hover:bg-[#6A5631] text-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!priceForSelectedDate || priceForSelectedDate === 0}
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
