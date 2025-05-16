import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const TypeSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  const typeWatch = watch("type");

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Hotel Type</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {hotelTypes.map((type) => (
          <label
            key={type}
            className={`relative flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              typeWatch === type
                ? "border-[#6A5631] bg-[#6A5631] text-white shadow-md"
                : "border-gray-200 hover:border-[#6A5631] hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              value={type}
              {...register("type", { required: "Please select a hotel type" })}
              className="sr-only"
            />
            <span className="text-sm font-medium">{type}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-500 text-sm font-medium mt-2 inline-block">
          {errors.type.message}
        </span>
      )}
    </div>
  );
};

export default TypeSection;
