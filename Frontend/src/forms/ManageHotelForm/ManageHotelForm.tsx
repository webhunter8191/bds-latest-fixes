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
    maxPrice?: number; // Maximum price threshold for commission calculation
    maxPriceSet?: boolean; // Flag to track if maxPrice has been set
    priceCalendar: { date: Date; price: number; availableRooms?: number }[]; // Dynamic pricing
    images: File[];
    features: string[]; // <-- Added for room features
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

    // Log the imageFiles specifically
    if (formDataJson.imageFiles) {
      console.log("ImageFiles in submission:", {
        length: formDataJson.imageFiles.length,
        type: formDataJson.imageFiles.item(0)?.type,
        name: formDataJson.imageFiles.item(0)?.name,
      });
    }

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

    // Add console log to debug room features
    console.log(
      "Submitting rooms with features:",
      formDataJson.rooms.map((room) => ({
        category: room.category,
        features: room.features,
      }))
    );

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

    // Append imageFiles for hotel images
    if (formDataJson.imageFiles && formDataJson.imageFiles.length > 0) {
      console.log("Adding imageFiles to FormData:", formDataJson.imageFiles);

      try {
        // Check if imageFiles is valid
        console.log(
          "imageFiles type:",
          Object.prototype.toString.call(formDataJson.imageFiles)
        );
        console.log("imageFiles length:", formDataJson.imageFiles.length);
        console.log("First file type:", formDataJson.imageFiles[0]?.type);
        console.log("First file name:", formDataJson.imageFiles[0]?.name);
        console.log("First file size:", formDataJson.imageFiles[0]?.size);

        for (let i = 0; i < formDataJson.imageFiles.length; i++) {
          console.log(`Adding file ${i + 1} to FormData`);
          formData.append("imageFiles", formDataJson.imageFiles[i]);
        }

        // Log all formData entries to verify
        console.log("FormData entries after adding files:");
        for (const pair of formData.entries()) {
          const value = pair[1];
          const displayValue =
            typeof value === "object" && value instanceof File
              ? `File: ${value.name}`
              : value;
          console.log(`${pair[0]}: ${displayValue}`);
        }
      } catch (error) {
        console.error("Error adding image files to FormData:", error);
      }
    } else {
      console.log(
        "No imageFiles found in formDataJson:",
        formDataJson.imageFiles
      );
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
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#6A5631] px-6 py-8 sm:px-8">
              <h1 className="text-3xl font-bold text-white text-center">
                {hotel ? "Edit Hotel Details" : "Add New Hotel"}
              </h1>
              <p className="mt-2 text-center text-gray-200">
                {hotel
                  ? "Update your hotel information and room details"
                  : "Fill in the details to create your hotel listing"}
              </p>
            </div>

            {/* Form Content */}
            <form onSubmit={onSubmit} className="space-y-8 p-6 sm:p-8">
              <div className="space-y-6">
                <DetailsSection hotel={hotel} />
                <TypeSection />

                <FacilitiesSection />

                <div className="bg-gray-50 rounded-xl p-0">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Room Management
                  </h2>
                  <GuestsSection
                    existingRooms={(hotel?.rooms || []).map((room) => ({
                      ...room,
                      category: String(room.category),
                      price: room.defaultPrice,
                      priceCalendar: (room.priceCalendar || []).map(
                        (entry) => ({
                          ...entry,
                          date: entry.date
                            ? new Date(entry.date).toISOString()
                            : "",
                          availableRooms:
                            (
                              entry as {
                                date: any;
                                price: any;
                                availableRooms?: any;
                              }
                            ).availableRooms ?? 0,
                        })
                      ),
                      features: room.features || [],
                    }))}
                  />
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Hotel Images
                  </h2>
                  <ImagesSection />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/my-hotels")}
                  className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A5631] transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#6A5631] text-white font-semibold rounded-lg hover:bg-[#5A4728] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A5631] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default ManageHotelForm;
