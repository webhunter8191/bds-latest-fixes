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
    "ISKON",
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
      const lowerCaseTemples = hotel.nearbyTemple.map((temple: string) => temple.toLowerCase());
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
    <div className="space-y-6">
      <label className="block text-sm font-semibold text-gray-700">
        Name
        <input
          type="text"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </label>
      <label className="block text-sm font-semibold text-gray-700">
        Location
        <input
          type="text"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          {...register("location", { required: "This field is required" })}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </label>
      <label className="text-gray-700 text-sm font-bold flex-1">
        Description
        <textarea
          rows={10}
          className="border rounded w-full py-1 px-2 font-normal"
          {...register("description", { required: "This field is required" })}
        ></textarea>
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </label>

      <div className="flex space-x-6">
        <div className="text-gray-700 text-sm font-bold max-w-[50%]">
          <span>Attach a Tag</span>
          {nearbyTemples.map((temple) => (
            <label key={temple} className="flex items-center">
              <input
                type="checkbox"
                value={temple}
                checked={nearbyTempleValues.includes(temple.toLowerCase())} // Convert to lowercase here
                onChange={handleTempleChange}
              />
              <span className="ml-2">{temple}</span>
            </label>
          ))}
          {errors.nearbyTemple && (
            <span className="text-red-500">{errors.nearbyTemple.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;
