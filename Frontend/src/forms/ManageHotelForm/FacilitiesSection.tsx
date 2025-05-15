import { useFormContext } from "react-hook-form";
import { hotelFacilities } from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const FacilitiesSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Facilities</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {hotelFacilities.map((facility) => (
          <label
            key={facility}
            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:border-[#6A5631] hover:bg-gray-50 cursor-pointer transition-all duration-200"
          >
            <input
              type="checkbox"
              value={facility}
              {...register("facilities", {
                validate: (facilities) => {
                  if (facilities && facilities.length > 0) {
                    return true;
                  } else {
                    return "At least one facility is required";
                  }
                },
              })}
              className="w-4 h-4 text-[#6A5631] border-gray-300 rounded focus:ring-[#6A5631]"
            />
            <span className="text-sm text-gray-700">{facility}</span>
          </label>
        ))}
      </div>
      {errors.facilities && (
        <span className="text-red-500 text-sm font-medium mt-2 inline-block">
          {errors.facilities.message}
        </span>
      )}
    </div>
  );
};

export default FacilitiesSection;
