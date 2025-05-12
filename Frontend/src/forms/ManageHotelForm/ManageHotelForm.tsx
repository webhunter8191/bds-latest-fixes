import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  temples: { name: string; distance: number }[];
  rooms: {
    category: string;
    totalRooms: number;
    defaultPrice: number; // Default price for unspecified dates
    priceCalendar: { date: Date; price: number }[]; // Dynamic pricing
    images: File[];
  }[];

  policies: string[]; // Policies field
};

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  const formMethods = useForm<HotelFormData>({
    defaultValues: {
      name: "",
      description: "",
      type: "",
      pricePerNight: 0,
      facilities: [],
      imageFiles: undefined,
      imageUrls: [],
      roomCount: 0,
      nearbyTemple: [],
      location: "",
      temples: [], // Default value for temples
      rooms: [],
      policies: [],
    },
  });

  const { handleSubmit, reset } = formMethods;
  const navigate = useNavigate();

  useEffect(() => {
    if (hotel) {
      reset({
        ...hotel,
        policies: hotel.policies || [], // Set existing policies
        rooms: hotel.rooms.map((room) => ({
          ...room,
          category: String(room.category), // Ensure category is a string
          priceCalendar: room.priceCalendar || [], // Ensure priceCalendar exists
          images: [], // Default to an empty array for compatibility
        })),
        temples: hotel.temples || [], // Ensure temples is initialized
      });
    }
  }, [hotel, reset]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    console.log("in handle submit", formDataJson);

    const formData = new FormData();
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }

    // Append basic hotel details
    formData.append("name", formDataJson.name);
    formData.append("type", formDataJson.type);
    formData.append("description", formDataJson.description);
    formData.append("location", formDataJson.location);

    // Append nearby temples
    formDataJson.nearbyTemple.forEach((temple) => {
      formData.append("nearbyTemple[]", temple.toLowerCase()); // Normalize to lowercase
    });

    // Append rooms
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

    // Append facilities
    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    // Append image URLs (if any)
    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }

    // Append policies
    (Array.isArray(formDataJson.policies) ? formDataJson.policies : []).forEach(
      (policy) => {
        formData.append("policies[]", policy);
      }
    );

    // Append temples
    if (formDataJson.temples && Array.isArray(formDataJson.temples)) {
      formDataJson.temples.forEach((temple, index) => {
        formData.append(`temples[${index}][name]`, temple.name);
        formData.append(
          `temples[${index}][distance]`,
          temple.distance.toString()
        );
      });
    }

    onSave(formData);
  });

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

        <GuestsSection
          existingRooms={(hotel?.rooms || []).map((room) => ({
            ...room,
            category: String(room.category), // Ensure category is a string
            price: room.defaultPrice, // Map defaultPrice to price
            priceCalendar: (room.priceCalendar || []).map((entry) => ({
              ...entry,
              date: entry.date ? new Date(entry.date).toISOString() : "", // Ensure date is converted to a Date object
            })),
          }))}
        />

        <ImagesSection />
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
