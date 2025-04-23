// import { FormProvider, useForm } from "react-hook-form";
// import DetailsSection from "./DetailsSection";
// import TypeSection from "./TypeSection";
// import FacilitiesSection from "./FacilitiesSection";
// import GuestsSection from "./GuestsSection";
// import ImagesSection from "./ImagesSection";
// import { HotelType } from "../../../../backend/src/shared/types";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export type HotelFormData = {
//   name: string;
//   description: string;
//   type: string;
//   pricePerNight: number;
//   facilities: string[];
//   imageFiles: FileList;
//   imageUrls: string[];
//   roomCount: number;
//   nearbyTemple: string[];
//   location: string;
//   temples: { name: string; distance: number }[];
//   rooms: {
//     category: string;
//     totalRooms: number;
//     price: number;
//     images: File[];
//   }[];

//   policies: string[]; // Added policies field
// };

// type Props = {
//   hotel?: HotelType;
//   onSave: (hotelFormData: FormData) => void;
//   isLoading: boolean;
// };

// const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
//   const formMethods = useForm<HotelFormData>();
//   const { handleSubmit, reset } = formMethods;
//   const navigate = useNavigate();

//   // useEffect(() => {
//   //   reset(hotel);
//   // }, [hotel, reset]);
//   useEffect(() => {
//     if (hotel) {
//       reset({
//         ...hotel,
//         policies: hotel.policies || [], // ✅ Set existing policies
//       });
//     }
//   }, [hotel, reset]);
//   const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
//     console.log("in handle submit", formDataJson);

//     const formData = new FormData();
//     if (hotel) {
//       formData.append("hotelId", hotel._id);
//     }
//     formData.append("name", formDataJson.name);
//     formData.append("type", formDataJson.type);
//     formData.append("description", formDataJson.description);
//     formData.append("location", formDataJson.location);
//     formDataJson.nearbyTemple.forEach((temple) => {
//       formData.append("nearbyTemple[]", temple); // Allow multiple entries
//     });

//     formData.append("rooms", JSON.stringify(formDataJson.rooms));
//     formDataJson.rooms.forEach((room) => {
//       if (room.images && room.images.length > 0) {
//         room.images.forEach((image) => {
//           if (image instanceof File) {
//             formData.append(`roomImages${room.category}`, image);
//           }
//         });
//       }
//     });

//     formDataJson.facilities.forEach((facility, index) => {
//       formData.append(`facilities[${index}]`, facility);
//     });

//     if (formDataJson.imageUrls) {
//       formDataJson.imageUrls.forEach((url, index) => {
//         formData.append(`imageUrls[${index}]`, url);
//       });
//     }

//     (Array.isArray(formDataJson.policies)
//       ? formDataJson.policies
//       : [formDataJson.policies]
//     ).forEach((policy) => {
//       formData.append("policies[]", policy);
//     });

//     Array.from(formDataJson.imageFiles).forEach((imageFile) => {
//       formData.append(`imageFiles`, imageFile);
//     });

//     formDataJson.temples.forEach((temple, index) => {
//       formData.append(`temples[${index}][name]`, temple.name);
//       formData.append(
//         `temples[${index}][distance]`,
//         temple.distance.toString()
//       );
//     });

//     onSave(formData);
//   });

//   return (
//     <FormProvider {...formMethods}>
//       <form
//         className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto"
//         onSubmit={onSubmit}
//       >
//         <h1 className="text-3xl font-semibold text-center mb-6">
//           Manage Hotel
//         </h1>
//         <DetailsSection hotel={hotel} />
//         <TypeSection />
//         <FacilitiesSection />
//         <GuestsSection existingRooms={hotel?.rooms as []} />
//         <ImagesSection />
//         <div className="flex justify-end mt-6 space-x-4">
//           <button
//             type="button"
//             onClick={() => navigate("/my-hotels")}
//             className="bg-gray-600 text-white py-2 px-4 font-semibold rounded-md hover:bg-gray-500"
//           >
//             Back
//           </button>
//           <button
//             disabled={isLoading}
//             type="submit"
//             className="bg-blue-600 text-white py-2 px-4 font-semibold rounded-md hover:bg-blue-500 disabled:bg-gray-300"
//           >
//             {isLoading ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </form>
//     </FormProvider>
//   );
// };

// export default ManageHotelForm;
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HotelType } from "../../../../backend/src/shared/types";
import { RoomAvailability } from "../../../../backend/src/shared/types";

import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";

export interface HotelFormData {
  name: string;
  type: string;
  description: string;
  pricePerNight: number;
  facilities: string[];
  imageFiles: File[];
  imageUrls: string[];
  roomCount: number;
  nearbyTemple: string[];
  location: string;
  temples: { name: string; distance: string }[];
  rooms: {
    category: string; // Category of the room (adjust type accordingly)
    totalRooms: number;
    availableRooms: number;
    price: number;
    images: (string | File)[];
    adultCount: number;
    childCount: number;
    availability: RoomAvailability[];
  }[];
  policies: string[];
}

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset } = formMethods;
  const navigate = useNavigate();

  useEffect(() => {
    if (hotel) {
      // Convert room data to match HotelFormData type
      const hotelWithConvertedRooms = {
        ...hotel,
        rooms: hotel.rooms.map((room) => ({
          ...room,
          category: room.category.toString(), // Convert category to string
          images: room.images, // Keep images as a string array
          totalRooms: room.totalRooms || 0, // Provide default value
          availableRooms: room.availableRooms || 0, // Provide default value
          price: room.price || 0, // Provide default value
        })),
      };

      // Reset form with the modified hotel data
      reset({
        ...hotelWithConvertedRooms,
        policies: hotel.policies || [], // Ensure policies are set correctly
        imageFiles: [], // Provide default value for missing property
        temples: hotel.temples || [], // Provide default value for missing property
      } as HotelFormData); // Explicitly cast to HotelFormData
    }
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
      formData.append("nearbyTemple[]", temple); // Allow multiple entries
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
        <GuestsSection existingRooms={hotel?.rooms as []} />
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
