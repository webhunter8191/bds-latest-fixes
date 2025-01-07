import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/SearchContext";
import { useAppContext } from "../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  roomCount: number;
  totalCost: number;
};

const GuestInfoForm = ({ hotelId, pricePerNight }: Props) => {
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

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignInClick = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.roomCount
    );
    navigate("/sign-in", { state: { from: location } });
  };

  const onSubmit = (data: GuestInfoFormData) => {
    // Calculate the number of nights
    const numberOfNights =
      Math.abs(data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24);

    // Calculate the total cost
    const totalCost = numberOfNights * pricePerNight * data.roomCount;

    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.roomCount
    );

    // Navigate with the total cost state
    navigate(`/hotel/${hotelId}/booking`, { state: { totalCost } });
  };

  return (
    <div className="flex flex-col p-4 bg-blue-200 gap-4">
      <h3 className="text-md font-bold">₹{pricePerNight} per night</h3>
      <form
        onSubmit={isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)}
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
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
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div>
            <DatePicker
              required
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-out Date"
              className="min-w-full bg-white p-2 focus:outline-none"
              wrapperClassName="min-w-full"
            />
          </div>
          <div className="flex bg-white px-2 py-1 gap-2">
            <label className="items-center flex">
              Rooms:
              <input
                className="w-full p-1 focus:outline-none font-bold"
                type="number"
                min={1}
                max={20}
                {...register("roomCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least one room",
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
            <div className="font-semibold">Total Price</div>
            <div className="font-bold text-xl">
              ₹{
                (pricePerNight *
                  watch("roomCount") *
                  Math.abs(watch("checkOut").getTime() - watch("checkIn").getTime()) /
                  (1000 * 60 * 60 * 24)).toFixed(2)
              }
            </div>
          </div>

          {isLoggedIn ? (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Book Now
            </button>
          ) : (
            <button className="bg-blue-600 text-white h-full p-2 font-bold hover:bg-blue-500 text-xl">
              Sign in to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GuestInfoForm;
