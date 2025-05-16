import {
  useState,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import {
  FaArrowLeft,
  FaArrowRight,
  FaWifi,
  FaSwimmingPool,
  FaConciergeBell,
  FaParking,
  FaDumbbell,
  FaCoffee,
  FaUtensils,
  FaSpa,
  FaHotel,
} from "react-icons/fa";

import { MdLocalLaundryService, MdOutlineRoomService } from "react-icons/md";
import { GiBathtub } from "react-icons/gi";
import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import Slider from "react-slick";
import Modal from "react-modal"; // Install react-modal if not already installed
// import Calendar from "react-calendar"; // Import React-Calendar
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSearchContext } from "../contexts/SearchContext";

Modal.setAppElement("#root"); // Replace "#root" with the ID of your app's root element

// Facility to icon mapping
const facilityIcons = {
  "Free WiFi": FaWifi,
  "Swimming Pool": FaSwimmingPool,
  "Concierge Service": FaConciergeBell,
  Parking: FaParking,
  Gym: FaDumbbell,
  "Breakfast Included": FaCoffee,
  Restaurant: FaUtensils,
  Spa: FaSpa,
  "Laundry Service": MdLocalLaundryService,
  "Room Service": MdOutlineRoomService,
  Bathtub: GiBathtub,
  Hotel: FaHotel,
};

// Custom Next Arrow Component
const NextArrow = (props: { onClick: any }) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-4 transform -translate-y-1/2 p-3 rounded-full text-xl text-white bg-black hover:bg-black transition duration-200 shadow-lg"
      style={{ zIndex: 1 }}
    >
      <FaArrowRight />
    </button>
  );
};

// Custom Prev Arrow Component
const PrevArrow = (props: { onClick: any }) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-4 transform -translate-y-1/2  p-3 rounded-full text-xl text-white bg-black hover:bg-[#6A5631]-700 transition duration-200 shadow-lg"
      style={{ zIndex: 1 }}
    >
      <FaArrowLeft />
    </button>
  );
};

const Detail = () => {
  const { hotelId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient(); // Add queryClient for cache management

  const { data: hotel, isFetching } = useQuery(
    ["fetchHotelById", hotelId],
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
      onSuccess: (data) => {
        console.log("Raw hotel data received:", data);
        console.log("Hotel rooms data:", data.rooms);

        if (data.rooms && data.rooms.length > 0) {
          console.log("Room features before processing:");
          data.rooms.forEach((room, idx) => {
            console.log(
              `Room ${idx} (category ${room.category}) features:`,
              room.features
            );
            console.log(`Room ${idx} features type:`, typeof room.features);
          });

          // Fix any feature arrays that might be missing or malformed
          data.rooms = data.rooms.map((room) => {
            // Ensure features is always an array
            if (!room.features || !Array.isArray(room.features)) {
              console.log(`Fixing features for room ${room.category}`);

              let fixedFeatures = [];

              // Try to parse features if it's a string
              if (typeof room.features === "string") {
                try {
                  const parsed = JSON.parse(room.features);
                  fixedFeatures = Array.isArray(parsed) ? parsed : [];
                  console.log("Parsed string features:", fixedFeatures);
                } catch (e) {
                  console.log("Failed to parse string features:", e);
                  fixedFeatures = [room.features];
                }
              } else if (room.features && typeof room.features === "object") {
                // In case features is an object but not an array
                fixedFeatures = Object.values(room.features);
                console.log(
                  "Converted object features to array:",
                  fixedFeatures
                );
              }

              room.features = fixedFeatures;
            }

            return room;
          });

          // Log the fixed data
          console.log("Room features after processing:");
          data.rooms.forEach((room, index) => {
            console.log(`Room ${index} fixed features:`, {
              category: room.category,
              features: room.features,
            });
          });
        }

        setIsLoading(false);
      },
    }
  );

  // Add function to refresh data
  const refreshData = () => {
    console.log("Manually refreshing data...");
    setIsLoading(true);
    queryClient.invalidateQueries(["fetchHotelById", hotelId]);
  };

  // Helper function to safely parse room features
  const parseRoomFeatures = (room: any): string[] => {
    if (!room.features) {
      return [];
    }

    if (Array.isArray(room.features)) {
      return room.features;
    }

    if (typeof room.features === "string") {
      try {
        const parsed = JSON.parse(room.features);
        return Array.isArray(parsed) ? parsed : [room.features];
      } catch {
        return [room.features];
      }
    }

    return [];
  };

  // Helper to get default bed configuration based on room category
  const getDefaultBedConfiguration = (category: number): string => {
    if (category === 1 || category === 2) {
      return "Double Bed";
    } else if (category === 3 || category === 4) {
      return "Double Bed + Single Bed";
    } else if (category === 5 || category === 6) {
      return "Double Bed + Double Bed";
    } else if (category === 7) {
      return "Large Hall";
    }
    return "";
  };

  const getRoomInfoForDate = (room: any, date: Date) => {
    // Format the input date as YYYY-MM-DD
    const dateString = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    // Find matching entry by direct string comparison
    const priceEntry = room.priceCalendar?.find(
      (entry: { date: string; price: number; availableRooms?: number }) => {
        const entryDateString =
          typeof entry.date === "string"
            ? entry.date.substring(0, 10)
            : new Date(entry.date).toISOString().substring(0, 10);
        return entryDateString === dateString;
      }
    );

    return {
      price: priceEntry ? priceEntry.price : room.defaultPrice,
      availableRooms:
        priceEntry?.availableRooms !== undefined
          ? priceEntry.availableRooms
          : room.availableRooms,
    };
  };

  const categories = {
    1: "Double Bed AC",
    2: "Double Bed Non AC",
    3: "3 Bed AC",
    4: "3 Bed Non AC",
    5: "4 Bed AC",
    6: "4 Bed Non AC",
    7: "Community Hall",
  };

  const [selectedRooms, setSelectedRooms] = useState<{
    [key: string]: boolean;
  }>({});
  const [, setSelectedRoomPrice] = useState<number>(0);
  const [availableRooms, setAvailableRooms] = useState<number>(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const handleRoomSelection = (
    availableRooms: number,
    category: string,
    price: number,
    roomId: string
  ) => {
    setSelectedRooms((prev) => {
      if (prev[category]) {
        return {};
      }
      return {
        [category]: true,
      };
    });

    if (!selectedRooms[category]) {
      setAvailableRooms(availableRooms);
      setSelectedRoomPrice(price);
      setSelectedRoomId(roomId);
    } else {
      setAvailableRooms(0);
      setSelectedRoomPrice(0);
      setSelectedRoomId("");
    }
  };

  const search = useSearchContext();
  const selectedDate = search.checkIn ? new Date(search.checkIn) : null;

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!hotel) {
    return <></>;
  }

  // Slider settings with custom arrows
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: <NextArrow onClick={undefined} />,
    prevArrow: <PrevArrow onClick={undefined} />,
  };

  return (
    <div className="space-y-5 p-4 sm:p-6 mx-auto min-h-screen">
      {/* Refresh button */}
      <div className="flex justify-end mb-2">
        <button
          onClick={refreshData}
          className="px-4 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Image Slider */}
      <div className="relative mx-auto shadow-xl rounded-lg overflow-hidden">
        <Slider {...sliderSettings}>
          {hotel.imageUrls.map((image, index) => (
            <div
              key={index}
              className="h-[250px] sm:h-[250px] md:h-[200px] lg:h-[600px]"
            >
              <img
                src={image}
                alt={hotel.name}
                className="rounded-md w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Hotel Header */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: hotel.starRating }).map((_, index) => (
            <AiFillStar
              key={index}
              className="fill-yellow-400 text-xl transition transform hover:scale-125"
            />
          ))}
          <span className="text-gray-500 text-sm">{hotel.type}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-black animate-fadeIn">
          {hotel.name}{" "}
          {hotel.nearbyTemple?.[0] ? `near ${hotel.nearbyTemple[0]}` : ""}
        </h1>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
        <div className="space-y-8">
          {/* Hotel Description */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              About the Hotel
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {hotel.description}
            </p>
          </div>

          {/* Facilities */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Amenities
            </h2>
            <div className="flex flex-wrap gap-2">
              {hotel.facilities.map((facility, index) => (
                <div
                  key={index}
                  className="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200"
                >
                  {facility}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-rows-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {hotel.rooms.map((room: any, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-lg shadow-md grid grid-cols-1 gap-4"
              >
                {/* Room image */}
                <div className="flex justify-center">
                  <img
                    src={room.images[0]}
                    alt={`${room.type} Room`}
                    className="rounded-md w-full h-60 sm:h-40 md:h-25 lg:h-50 object-cover"
                    onLoad={() => {
                      console.log("Room features:", room.features);
                    }}
                  />
                </div>

                {/* Room details */}
                <div className="flex flex-col justify-start gap-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-2 sm:mb-4">
                    {categories[room.category as keyof typeof categories]}
                  </h3>
                  <div className="text-gray-600 text-sm sm:text-base">
                    <p>
                      Price: ₹{" "}
                      {
                        getRoomInfoForDate(room, selectedDate || new Date())
                          .price
                      }
                      /night
                    </p>
                    <p>Available Rooms: {room.availableRooms}</p>
                    <p>Adults Allowed: {room.adultCount}</p>
                    <p>Children Allowed: {room.childCount}</p>
                  </div>

                  {/* Room Features - Simplified and More Prominent */}
                  <div className="mt-0  p-3 ">
                    <h4 className="text-base font-semibold mb-2 text-[#6A5631]">
                      Room Includes
                    </h4>

                    <div className="grid grid-cols-2 gap-2">
                      {(() => {
                        // Get processed features array
                        const features = parseRoomFeatures(room);

                        // Add default bed configuration as first feature
                        const bedConfig = getDefaultBedConfiguration(
                          room.category
                        );

                        if (features.length > 0 || bedConfig) {
                          return (
                            <>
                              {bedConfig && (
                                <div className="flex items-center gap-1 text-xs font-semibold text-gray-800 p-0">
                                  {bedConfig}
                                </div>
                              )}
                              {features.map((feature: string, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-1 text-xs text-gray-700 p-0"
                                >
                                  {feature}
                                </div>
                              ))}
                            </>
                          );
                        } else {
                          return (
                            <div className="col-span-2 text-xs text-gray-500 italic">
                              Standard features based on room type
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  {/* Price-wise Calendar */}
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold mb-2">
                      Price Calendar:
                    </h4>
                    <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {/* Weekday Headers */}
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                          (day, idx) => (
                            <div
                              key={idx}
                              className="font-bold text-gray-700 text-xs sm:text-sm py-2"
                            >
                              {day}
                            </div>
                          )
                        )}

                        {/* Dates with Prices */}
                        {(() => {
                          const currentDate = new Date();
                          const year = currentDate.getFullYear();
                          const month = currentDate.getMonth();

                          // First day of the month
                          const firstDay = new Date(year, month, 1);
                          const firstDayOfWeek = firstDay.getDay();

                          // Last day of the month
                          const lastDay = new Date(year, month + 1, 0);
                          const daysInMonth = lastDay.getDate();

                          // Create array for calendar cells
                          const calendarCells = [];

                          // Add empty cells for days before the first day of month
                          for (let i = 0; i < firstDayOfWeek; i++) {
                            calendarCells.push(
                              <div
                                key={`empty-start-${i}`}
                                className="h-16 sm:h-20 border border-gray-100 rounded-md opacity-0"
                              ></div>
                            );
                          }

                          // Add cells for days in month
                          for (let day = 1; day <= daysInMonth; day++) {
                            const date = new Date(year, month, day);
                            const today = new Date();
                            // Set hours to 0 for pure date comparison
                            today.setHours(0, 0, 0, 0);
                            const isPastDate = date < today;

                            // Format date as YYYY-MM-DD for comparison
                            const dateString = `${date.getFullYear()}-${String(
                              date.getMonth() + 1
                            ).padStart(2, "0")}-${String(
                              date.getDate()
                            ).padStart(2, "0")}`;

                            const priceEntry = room.priceCalendar?.find(
                              (entry: {
                                date: string;
                                price: number;
                                availableRooms?: number;
                              }) => {
                                const entryDateString =
                                  typeof entry.date === "string"
                                    ? entry.date.substring(0, 10)
                                    : new Date(entry.date)
                                        .toISOString()
                                        .substring(0, 10);
                                return entryDateString === dateString;
                              }
                            );

                            const priceToShow = priceEntry
                              ? priceEntry.price
                              : room.defaultPrice;

                            // Get available rooms - use date-specific value if set, otherwise fall back to room's default
                            const availableRoomsToShow =
                              priceEntry?.availableRooms !== undefined
                                ? priceEntry.availableRooms
                                : room.availableRooms;

                            const hasSpecialPrice =
                              priceEntry &&
                              priceEntry.price !== room.defaultPrice;

                            // Highlight if this date matches the selected check-in date
                            const isSelected =
                              selectedDate &&
                              date.toDateString() ===
                                selectedDate.toDateString();

                            calendarCells.push(
                              <div
                                key={`day-${day}`}
                                className={`relative flex flex-col items-center justify-start p-1 border ${
                                  hasSpecialPrice
                                    ? "border-[#6A5631] border-opacity-40"
                                    : "border-gray-200"
                                } ${
                                  isSelected
                                    ? "bg-yellow-100 border-yellow-500"
                                    : ""
                                } ${
                                  isPastDate ? "opacity-50 bg-gray-100" : ""
                                } rounded-md overflow-hidden h-16 sm:h-20`}
                              >
                                <div
                                  className={`font-bold text-xs w-full text-center py-1 ${
                                    hasSpecialPrice
                                      ? "bg-[#6A5631] text-white"
                                      : "bg-gray-50 text-gray-700"
                                  } ${
                                    isPastDate
                                      ? "bg-gray-200 text-gray-500"
                                      : ""
                                  }`}
                                >
                                  {day}
                                </div>
                                <div className="flex flex-col items-center justify-center w-full h-full">
                                  <div
                                    className={`text-xs font-semibold ${
                                      hasSpecialPrice
                                        ? "text-[#6A5631]"
                                        : "text-gray-700"
                                    } ${isPastDate ? "text-gray-500" : ""}`}
                                  >
                                    ₹{priceToShow}
                                  </div>
                                  <div
                                    className={`text-[9px] mt-0.5 ${
                                      isPastDate
                                        ? "text-gray-500"
                                        : availableRoomsToShow > 0
                                        ? "text-blue-700"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {availableRoomsToShow}{" "}
                                    {availableRoomsToShow === 1
                                      ? "room"
                                      : "rooms"}
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          // Add empty cells to complete the calendar grid if needed
                          const totalCells = firstDayOfWeek + daysInMonth;
                          const rowsNeeded = Math.ceil(totalCells / 7);
                          const cellsNeeded = rowsNeeded * 7;
                          const remainingCells = cellsNeeded - totalCells;

                          for (let i = 0; i < remainingCells; i++) {
                            calendarCells.push(
                              <div
                                key={`empty-end-${i}`}
                                className="h-16 sm:h-20 border border-gray-100 rounded-md opacity-0"
                              ></div>
                            );
                          }

                          return calendarCells;
                        })()}
                      </div>
                    </div>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()}>
                    {/* Form content */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("Button clicked!"); // Debugging log
                        handleRoomSelection(
                          room.availableRooms,
                          room.category,
                          getRoomInfoForDate(room, selectedDate || new Date())
                            .price,
                          room._id
                        );
                      }}
                      className="w-full bg-[#6A5631] text-white py-2 rounded-lg hover:bg-[#5A4728] transition duration-200"
                    >
                      {selectedRooms[room.category]
                        ? "Unselect Room"
                        : "Select Room"}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          {hotel?.policies && hotel?.policies.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
                Hotel Policies
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {hotel.policies.map((policy: string, index: number) => (
                  <p key={index} className="text-sm text-gray-700 py-1">
                    {policy}
                  </p>
                ))}
              </div>
            </div>
          )}

          {hotel?.temples?.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 my-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
                Distance from Temples
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                {hotel.temples.map(
                  (
                    temple: { name: string; distance: number },
                    index: number
                  ) => (
                    <div key={index} className="flex justify-between py-1">
                      <span className="text-sm text-gray-700">
                        {temple.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {temple.distance} km
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
          {/* Location Section */}
          <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">
              Location
            </h2>
            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {hotel.location ? (
                  <>
                    <p className="mb-2">Address: {hotel.location}</p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        hotel.location
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6A5631] hover:underline inline-flex items-center gap-2"
                    >
                      View on Google Maps
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </>
                ) : (
                  "No location available."
                )}
              </p>
            </div>
            {/* Google Maps Embed */}
            {hotel.location && (
              <div className="w-full h-80 sm:h-96 mt-4">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
                    hotel.location
                  )}&key=AIzaSyBfdU1HrvqgUUy-rsXNbvqCJRdQGMshjEE`}
                  className="w-full h-full border-none rounded-lg shadow-md"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </div>

        {/* Guest Info Form Dialog */}

        {/* Debugging: Modal state can be logged here if needed */}
        <div className="p-4 sm:p-6 border border-slate-200 rounded-lg shadow-lg bg-white">
          <GuestInfoForm
            pricePerNight={
              selectedRoomId
                ? getRoomInfoForDate(
                    hotel.rooms.find((room) => room._id === selectedRoomId) ||
                      {},
                    selectedDate || new Date()
                  ).price
                : 0
            }
            availableRooms={availableRooms}
            roomsId={selectedRoomId}
            hotelId={hotel._id}
            priceCalendar={
              hotel.rooms
                .find((room) => room._id === selectedRoomId)
                ?.priceCalendar?.map(({ date, price, availableRooms }) => ({
                  date:
                    typeof date === "string"
                      ? (date as string).substring(0, 10)
                      : date instanceof Date
                      ? `${date.getFullYear()}-${String(
                          date.getMonth() + 1
                        ).padStart(2, "0")}-${String(date.getDate()).padStart(
                          2,
                          "0"
                        )}`
                      : new Date().toISOString().substring(0, 10), // fallback
                  price,
                  availableRooms:
                    availableRooms !== undefined ? availableRooms : 0,
                })) || []
            }
            defaultPrice={
              hotel.rooms.find((room) => room._id === selectedRoomId)
                ?.defaultPrice || 0
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Detail;
