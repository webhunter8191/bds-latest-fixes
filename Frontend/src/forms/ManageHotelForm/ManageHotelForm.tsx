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
//   rooms: {
//     category: string;
//     totalRooms: number;
//     price: number;
//     images: File[];
//   }[];
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

//   useEffect(() => {
//     reset(hotel);
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

//     Array.from(formDataJson.imageFiles).forEach((imageFile) => {
//       formData.append(`imageFiles`, imageFile);
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

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";
import { HotelType } from "../../../../backend/src/shared/types";

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
  availableDates: Date[]; // Added availability dates
  rooms: {
    category: string;
    totalRooms: number;
    price: number;
    images: File[];
  }[];
};

type Props = {
  hotel?: HotelType;
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  const formMethods = useForm<HotelFormData>();
  const { handleSubmit, reset, setValue, watch } = formMethods;
  const navigate = useNavigate();

  const [selectedDates, setSelectedDates] = useState<Date[]>(
    hotel?.availableDates || []
  );

  useEffect(() => {
    reset(hotel);
    if (hotel?.availableDates) {
      setSelectedDates(hotel.availableDates);
    }
  }, [hotel, reset]);

  useEffect(() => {
    setValue("availableDates", selectedDates);
  }, [selectedDates, setValue]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    console.log("in handle submit", formDataJson);

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

    // Append availability dates
    formDataJson.availableDates.forEach((date) => {
      formData.append("availableDates[]", date.toISOString());
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

        {/* Date Picker for Availability */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Select Availability Dates:
          </label>
          <DatePicker
            selected={selectedDates[0]}
            onChange={(dates) => setSelectedDates(dates as Date[])}
            startDate={selectedDates[0]}
            endDate={selectedDates[selectedDates.length - 1]}
            selectsRange
            inline
            className="border p-2 w-full"
          />
        </div>

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
