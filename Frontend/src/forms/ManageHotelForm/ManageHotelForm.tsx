import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect,  } from "react";
import { useNavigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";

export type HotelFormData = {
  name: string;
  description: string;
  type: string;
  pricePerNight: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  roomCount: number;
  nearbyTemple: string[];
  location: string;
  rooms: {
    category: string;
    totalRooms: number;
    price: number;
    images: File[];
    // Added availability field
  }[];
};

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset, watch, setValue } = formMethods;
  const navigate = useNavigate();

  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    const formData = new FormData();
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }
    formData.append("name", formDataJson.name);
    formData.append("type", formDataJson.type);
    formData.append("description", formDataJson.description);
    formData.append("location", formDataJson.location);
    formDataJson.nearbyTemple.forEach((temple) => {
      formData.append("nearbyTemple[]", temple);
    });

    formData.append("rooms", JSON.stringify(formDataJson.rooms));
    formDataJson.rooms.forEach((room) => {
      if (room.images && room.images.length > 0) {
        room.images.forEach((image) => {
          if (image instanceof File) {
            formData.append(`roomImages${room.category}`, image);
          }
        });
      }
    });

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });
    onSave(formData);
  });

  // const handleDateClick = (date: Date) => {
  //   if (selectedRoomIndex !== null) {
  //     const price = prompt("Enter price for the selected date:");
  //     if (price) {
  //       const rooms = watch("rooms");
  //       const roomAvailability = rooms[selectedRoomIndex].availability || [];
  //       roomAvailability.push({ date, price: Number(price) });
  //       rooms[selectedRoomIndex].availability = roomAvailability;
  //       setValue("rooms", rooms);
  //     }
  //   }
  // };

  return (
    <FormProvider {...formMethods}>
      <form
        className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto"
        onSubmit={onSubmit}
      >
        <h1 className="text-3xl font-semibold text-center mb-6">
          Manage Hotel
        </h1>
        <DetailsSection hotel={hotel} />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection existingRooms={hotel?.rooms as []} />
        <ImagesSection />

        {/* Calendar Section */}
        {/* <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Set Room Availability</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Select Room
            </label>
            <select
              className="border rounded-md p-2 w-full"
              onChange={(e) => setSelectedRoomIndex(Number(e.target.value))}
            >
              <option value="">Select a room</option>
              {watch("rooms")?.map((room, index) => (
                <option key={index} value={index}>
                  {room.category}
                </option>
              ))}
            </select>
          </div>
          {selectedRoomIndex !== null && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Select Dates
              </label>
              <DatePicker
                inline
                onChange={(date) => handleDateClick(date as Date)}
                highlightDates={watch("rooms")[
                  selectedRoomIndex
                ]?.availability?.map((item) => item.date)}
              />
              <div className="mt-4">
                <h3 className="text-lg font-medium">Availability:</h3>
                <ul className="list-disc pl-5">
                  {watch("rooms")[selectedRoomIndex]?.availability?.map(
                    (item, index) => (
                      <li key={index}>
                        {item.date.toDateString()} - ${item.price}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          )}
        </div> */}

        <div className="flex justify-end mt-6 space-x-4">
          <button
            type="button"
            onClick={() => navigate("/my-hotels")}
            className="bg-gray-600 text-white py-2 px-4 font-semibold rounded-md hover:bg-gray-500"
          >
            Back
          </button>
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-md hover:bg-blue-500 disabled:bg-gray-300"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ManageHotelForm;
