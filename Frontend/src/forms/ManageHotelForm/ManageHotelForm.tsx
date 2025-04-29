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
<<<<<<< HEAD
    defaultPrice: number; // Default price for unspecified dates
    priceCalendar: { date: Date; price: number }[]; // Dynamic pricing
    images: File[];
  }[];

  policies: string[]; // Policies field
=======
    price: number;
    images: File[];
  }[];

  policies: string[];
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
};

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
<<<<<<< HEAD
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

=======
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset } = formMethods;
  const navigate = useNavigate();

  // useEffect(() => {
  //   reset(hotel);
  // }, [hotel, reset]);
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
  useEffect(() => {
    if (hotel) {
      reset({
        ...hotel,
<<<<<<< HEAD
        policies: hotel.policies || [], // Set existing policies
        rooms: hotel.rooms.map((room) => ({
          ...room,
          priceCalendar: room.priceCalendar || [], // Ensure priceCalendar exists
        })),
        temples: hotel.temples || [], // Ensure temples is initialized
      });
    }
  }, [hotel, reset]);

=======
        policies: hotel.policies || [], // ✅ Set existing policies
      });
    }
  }, [hotel, reset]);
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    console.log("in handle submit", formDataJson);

    const formData = new FormData();
    if (hotel) {
      formData.append("hotelId", hotel._id);
    }
<<<<<<< HEAD

    // Append basic hotel details
=======
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
    formData.append("name", formDataJson.name);
    formData.append("type", formDataJson.type);
    formData.append("description", formDataJson.description);
    formData.append("location", formDataJson.location);
<<<<<<< HEAD

    // Append nearby temples
    formDataJson.nearbyTemple.forEach((temple) => {
      formData.append("nearbyTemple[]", temple.toLowerCase()); // Normalize to lowercase
    });

    // Append rooms
=======
    formDataJson.nearbyTemple.forEach((temple) => {
      formData.append("nearbyTemple[]", temple); // Allow multiple entries
    });

>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
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

<<<<<<< HEAD
    // Append facilities
=======
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

<<<<<<< HEAD
    // Append image URLs (if any)
=======
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }

<<<<<<< HEAD
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
        formData.append(`temples[${index}][distance]`, temple.distance.toString());
      });
    }
=======
    (Array.isArray(formDataJson.policies)
      ? formDataJson.policies
      : [formDataJson.policies]
    ).forEach((policy) => {
      formData.append("policies[]", policy);
    });

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    formDataJson.temples.forEach((temple, index) => {
      formData.append(`temples[${index}][name]`, temple.name);
      formData.append(
        `temples[${index}][distance]`,
        temple.distance.toString()
      );
    });
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c

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
<<<<<<< HEAD
        <GuestsSection existingRooms={hotel?.rooms || []} />
=======
        <GuestsSection existingRooms={hotel?.rooms as []} />
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
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

<<<<<<< HEAD
export default ManageHotelForm;
=======
export default ManageHotelForm;
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
