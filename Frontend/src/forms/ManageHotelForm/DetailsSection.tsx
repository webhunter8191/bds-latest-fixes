import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import React from "react";

const DetailsSection = ({ hotel }: any) => {
  const {
    register,
    setValue, // Add setValue to update the selected values
    // watch, // Use watch to get the selected values for the nearbyTemple
    formState: { errors },
  } = useFormContext<HotelFormData>();
  const [nearbyTempleValues, setNearbyTempleValues] = React.useState<string[]>(
    []
  );
  const nearbyTemples = [
    "Prem Mandir",
    "Banke Bihari",
    "Dwarikadish",
    "Iskcon Temple",
    "Radha Raman Temple",
    "Radha Damodar Temple",
    "Radha Vallabh Temple",
    "Gauri Gopal Ashram",
    "Harinikunj Chauraha",
    "Govind Dev Ji Temple",
    "Bus Stand Vrindavan",
    "100 feet road vrindavan",
    "Multilevel Car Parking",
    "Shri Radha Ras Bihari Ashta Sakhi Temple",
    "Attalla Chungi",
    "Vidhyapeeth Chauraha",
    "Pagal Baba Temple",
    "Baba Neem Karori Ashram Vrindavan",
    "Mayavati Hospital Vrindavan",
    "Nidhi Van",
    "Krishna Janmbhoomi",
    "Mathura",
    "Vrindavan",
    "Gokul",
    "Goverdhan",
    "Barsana",
  ];

  React.useEffect(() => {
    if (hotel) {
      // Convert to lowercase when setting initial values
      const lowerCaseTemples = hotel.nearbyTemple.map((temple: string) =>
        temple.toLowerCase()
      );
      setNearbyTempleValues(lowerCaseTemples);
      setValue("nearbyTemple", lowerCaseTemples);
    }
  }, [hotel, setValue]);

  const handleTempleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    // Convert to lowercase when handling changes
    const lowerCaseValue = value.toLowerCase();
    setNearbyTempleValues((prevValues) => {
      const updatedValues = checked
        ? [...prevValues, lowerCaseValue]
        : prevValues.filter((temple) => temple !== lowerCaseValue);
      setValue("nearbyTemple", updatedValues);
      return updatedValues;
    });
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Hotel Details
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Hotel Name
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent transition-colors duration-200"
              placeholder="Enter hotel name"
              {...register("name", { required: "Hotel name is required" })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm font-medium">
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent transition-colors duration-200"
              placeholder="Enter hotel location"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <span className="text-red-500 text-sm font-medium">
                {errors.location.message}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent transition-colors duration-200 resize-none"
            placeholder="Describe your hotel..."
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <span className="text-red-500 text-sm font-medium">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nearby Temples
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 bg-white rounded-lg border border-gray-200">
            {nearbyTemples.map((temple) => (
              <label
                key={temple}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <input
                  type="checkbox"
                  value={temple}
                  checked={nearbyTempleValues.includes(temple.toLowerCase())}
                  onChange={handleTempleChange}
                  className="w-4 h-4 text-[#6A5631] border-gray-300 rounded focus:ring-[#6A5631]"
                />
                <span className="text-sm text-gray-700">{temple}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;
