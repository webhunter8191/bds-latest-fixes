import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import * as apiClient from "./../api-client";
import { AiFillStar } from "react-icons/ai";
import { FaArrowLeft, FaArrowRight, FaStar, FaRegStar } from "react-icons/fa";
import React from "react";

import GuestInfoForm from "../forms/GuestInfoForm/GuestInfoForm";
import Slider from "react-slick";
import Modal from "react-modal"; // Install react-modal if not already installed
// import Calendar from "react-calendar"; // Import React-Calendar
import "react-calendar/dist/Calendar.css"; // Import calendar styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSearchContext } from "../contexts/SearchContext";
import { useAppContext } from "../contexts/AppContext";

Modal.setAppElement("#root"); // Replace "#root" with the ID of your app's root element

// Custom Next Arrow Component
const NextArrow = (props: { onClick: any }) => {
  const { onClick } = props;
  return (
    <button
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
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
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
      className="absolute top-1/2 left-4 transform -translate-y-1/2  p-3 rounded-full text-xl text-white bg-black hover:bg-[#6A5631]-700 transition duration-200 shadow-lg"
      style={{ zIndex: 1 }}
    >
      <FaArrowLeft />
    </button>
  );
};

// Define a Review type for better type safety
interface Review {
  id: string;
  hotelId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const Detail = () => {
  const { hotelId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient(); // Add queryClient for cache management
  const initialLoadRef = React.useRef(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState({
    rating: 0,
    comment: "",
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { isLoggedIn, currentUser } = useAppContext();
  const navigate = useNavigate();

  // Add these state variables with the other state declarations
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const [showGuestFormOverlay, setShowGuestFormOverlay] = useState(false);

  // Auto-refresh data on initial load
  useEffect(() => {
    // Only run this effect once when the component mounts
    if (!initialLoadRef.current && hotelId) {
      console.log("Initial data load for hotelId:", hotelId);
      initialLoadRef.current = true;
      setIsLoading(true);
      // Force a fresh fetch
      queryClient.invalidateQueries(["fetchHotelById", hotelId]);
    }
  }, [hotelId, queryClient]);

  // Update the useEffect for fetching reviews to use localStorage and check if user has already reviewed
  useEffect(() => {
    const fetchReviews = () => {
      if (!hotelId) return;

      try {
        // Get reviews from localStorage
        const storedReviews = localStorage.getItem("hotelReviews");
        const allReviews: Review[] = storedReviews
          ? JSON.parse(storedReviews)
          : [];

        // Filter reviews for the current hotel
        const hotelReviews = allReviews.filter(
          (review) => review.hotelId === hotelId
        );

        // Sort reviews by date (newest first)
        hotelReviews.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setReviews(hotelReviews);
      } catch (error) {
        console.error("Error fetching reviews from localStorage:", error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [hotelId]);

  // Check if the current user has already reviewed this hotel
  const hasUserAlreadyReviewed = useMemo(() => {
    if (!currentUser || !hotelId) return false;

    return reviews.some((review) => review.userId === currentUser._id);
  }, [reviews, currentUser, hotelId]);

  const { data: hotel, isFetching } = useQuery(
    ["fetchHotelById", hotelId],
    () => apiClient.fetchHotelById(hotelId || ""),
    {
      enabled: !!hotelId,
      staleTime: 0, // Ensure data is considered stale immediately
      refetchOnMount: true, // Refetch on component mount
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
    if (category === 1 || category === 2 || category === 8) {
      return "Double Bed";
    } else if (category === 3 || category === 4 || category === 9) {
      return "Double Bed + Single Bed";
    } else if (category === 5 || category === 6 || category === 10) {
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
    8: "Double Bed Deluxe",
    9: "Triple Bed Deluxe",
    10: "Four Bed Deluxe",
  };

  const [selectedRooms, setSelectedRooms] = useState<{
    [key: string]: boolean;
  }>({});
  const [availableRooms, setAvailableRooms] = useState<number>(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  // Handle room selection with explicit event prevention
  const handleRoomSelection = (
    availableRooms: number,
    category: string,
    roomId: string,
    e?: React.MouseEvent
  ) => {
    // Explicitly stop event if provided
    if (e) {
      e.stopPropagation();
      if (e.preventDefault) e.preventDefault();
    }

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
      setSelectedRoomId(roomId);
    } else {
      setAvailableRooms(0);
      setSelectedRoomId("");
    }
  };

  const search = useSearchContext();
  const selectedDate = search.checkIn ? new Date(search.checkIn) : null;

  const handleRatingClick = (rating: number) => {
    setUserReview((prev) => ({ ...prev, rating }));
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserReview((prev) => ({ ...prev, comment: e.target.value }));
  };

  // Update handleReviewSubmit to show a different error message
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hotelId || !isLoggedIn || !userReview.rating) {
      setSubmissionError("Please select a rating before submitting");
      return;
    }

    if (hasUserAlreadyReviewed) {
      setSubmissionError(
        "You have already reviewed this hotel. Only one review per hotel is allowed."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmissionError("");
    setSubmissionSuccess(false);

    try {
      // Create a new review with real user data from context
      const newReview: Review = {
        id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        hotelId: hotelId,
        userId: currentUser?._id || "unknown",
        userName: currentUser
          ? `${currentUser.firstName} ${currentUser.lastName}`
          : "Guest User",
        rating: userReview.rating,
        comment: userReview.comment.trim(),
        createdAt: new Date().toISOString(),
      };

      // Get existing reviews from localStorage
      const storedReviews = localStorage.getItem("hotelReviews");
      const allReviews: Review[] = storedReviews
        ? JSON.parse(storedReviews)
        : [];

      // Add the new review
      allReviews.push(newReview);

      // Save back to localStorage
      localStorage.setItem("hotelReviews", JSON.stringify(allReviews));

      // Update the reviews state
      const hotelReviews = allReviews.filter(
        (review) => review.hotelId === hotelId
      );
      hotelReviews.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setReviews(hotelReviews);

      // Handle successful submission
      console.log("Review submitted successfully:", newReview);
      setSubmissionSuccess(true);

      // Reset form after successful submission
      setUserReview({
        rating: 0,
        comment: "",
      });

      // Hide the form after successful submission
      setTimeout(() => {
        setShowReviewForm(false);
        setSubmissionSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving review to localStorage:", error);
      setSubmissionError("Failed to save your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/sign-in", {
      state: { from: { pathname: `/hotel/${hotelId}` } },
    });
  };

  // Utility: Tax Calculation Function (if not present)
  // Function removed to eliminate unused code warning

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
    <div className="space-y-8 p-4 sm:p-6 mx-auto min-h-screen bg-gray-50">
      {/* Image Slider - Enhanced */}
      <div className="relative mx-auto shadow-xl rounded-xl overflow-hidden">
        <Slider {...sliderSettings}>
          {hotel.imageUrls.map((image, index) => (
            <div
              key={index}
              className="h-[280px] sm:h-[350px] md:h-[450px] lg:h-[600px]"
            >
              <img
                src={image}
                alt={hotel.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Hotel Header - Enhanced */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {Array.from({ length: hotel.starRating }).map((_, index) => (
                  <AiFillStar
                    key={index}
                    className="fill-yellow-400 text-2xl"
                  />
                ))}
              </div>
              <span className="text-gray-500 text-sm px-3 py-1 bg-gray-100 rounded-full">
                {hotel.type}
              </span>
              {reviews.length > 0 && (
                <span className="text-sm text-white bg-[#6A5631] px-3 py-1 rounded-full flex items-center gap-1">
                  <FaStar className="text-yellow-300" />
                  {(
                    reviews.reduce((sum, review) => sum + review.rating, 0) /
                    reviews.length
                  ).toFixed(1)}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
              {hotel.name}
            </h1>
            {hotel.nearbyTemple?.[0] && (
              <div className="mt-2 text-gray-600 flex items-center gap-2">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Near {hotel.nearbyTemple[0]}
              </div>
            )}
          </div>
          {hotel.location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                hotel.location
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6A5631] hover:bg-[#6A5631] hover:text-white px-4 py-2 border border-[#6A5631] rounded-lg transition-colors duration-300 flex items-center gap-2 whitespace-nowrap text-sm font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              View on Map
            </a>
          )}
        </div>
      </div>

      {/* Content Section - Enhanced Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 items-start">
        <div className="space-y-8">
          {/* Hotel Description */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#6A5631]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              About this Hotel
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
              {hotel.description}
            </p>
          </div>

          {/* Facilities - Enhanced */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#6A5631]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {hotel.facilities.map((facility, index) => (
                <div
                  key={index}
                  className="text-sm bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg border border-gray-200 flex items-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-[#6A5631]"></div>
                  {facility}
                </div>
              ))}
            </div>
          </div>

          {/* Rooms Section - Enhanced */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 bg-white p-4 rounded-xl shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#6A5631]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Select Your Room
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotel.rooms.map((room: any, index) => {
                // Enhanced debugging for priceCalendar
                console.log(
                  "Room:",
                  room.category,
                  "PriceCalendar:",
                  room.priceCalendar,
                  "Type:",
                  room.priceCalendar ? typeof room.priceCalendar : "undefined",
                  "Is Array:",
                  Array.isArray(room.priceCalendar),
                  "Length:",
                  room.priceCalendar?.length
                );

                // Check if price calendar exists but don't create fake data
                if (
                  !Array.isArray(room.priceCalendar) ||
                  room.priceCalendar.length === 0
                ) {
                  console.log(
                    "No price calendar data available for room:",
                    room.category
                  );
                  // Just leave it as is - don't generate sample data
                }

                return (
                  <div
                    key={index}
                    className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
                      selectedRooms[room.category]
                        ? "ring-2 ring-[#6A5631] transform scale-[1.02]"
                        : "hover:shadow-lg"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {/* Room image */}
                    <div className="relative">
                      <img
                        src={room.images[0]}
                        alt={`${room.type} Room`}
                        className="w-full h-60 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-2 px-4">
                        <h3 className="text-xl font-semibold text-white">
                          {categories[room.category as keyof typeof categories]}
                        </h3>
                      </div>
                    </div>

                    {/* Room details */}
                    <div className="p-5 space-y-4">
                      <span className="text-xs text-green-600">
                        {selectedDate
                          ? `Showing prices for ${selectedDate.toLocaleDateString()}`
                          : "Showing current prices"}
                      </span>
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-[#6A5631]">
                          ₹{" "}
                          {
                            getRoomInfoForDate(room, selectedDate || new Date())
                              .price
                          }
                          <span className="text-sm font-normal text-gray-600">
                            /night
                          </span>
                        </div>
                        <div className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                          {room.availableRooms} rooms available
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          {room.adultCount} Adults
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          {room.childCount} Children
                        </div>
                      </div>

                      {/* Room Features */}
                      <div className="border-t border-b py-4 my-2">
                        <h4 className="text-base font-semibold mb-3 text-gray-800 flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[#6A5631]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          Room Includes
                        </h4>

                        <div className="grid grid-cols-2 gap-2">
                          {(() => {
                            const features = parseRoomFeatures(room);
                            const bedConfig = getDefaultBedConfiguration(
                              room.category
                            );

                            if (features.length > 0 || bedConfig) {
                              return (
                                <>
                                  {bedConfig && (
                                    <div className="flex items-center gap-2 text-sm text-gray-800">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-[#6A5631]"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      {bedConfig}
                                    </div>
                                  )}
                                  {features.map(
                                    (feature: string, idx: number) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-2 text-sm text-gray-700"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-4 w-4 text-[#6A5631]"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                        {feature}
                                      </div>
                                    )
                                  )}
                                </>
                              );
                            } else {
                              return (
                                <div className="col-span-2 text-sm text-gray-500 italic">
                                  Standard features based on room type
                                </div>
                              );
                            }
                          })()}
                        </div>
                      </div>

                      {/* Display price calendar if available */}
                      {Array.isArray(room.priceCalendar) &&
                      room.priceCalendar.length > 0 ? (
                        <div className="mt-2">
                          <div className="font-semibold text-sm text-gray-700 mb-1 flex items-center justify-between">
                            <span>Price Calendar</span>
                          </div>
                          <div className="flex overflow-x-auto gap-2 pb-1">
                            {room.priceCalendar
                              .slice(0, 14)
                              .map((entry: any, idx: number) => {
                                const entryDate = new Date(entry.date);
                                const isSelectedDate =
                                  selectedDate &&
                                  entryDate.getDate() ===
                                    selectedDate.getDate() &&
                                  entryDate.getMonth() ===
                                    selectedDate.getMonth() &&
                                  entryDate.getFullYear() ===
                                    selectedDate.getFullYear();

                                return (
                                  <div
                                    key={idx}
                                    className={`min-w-[70px] ${
                                      isSelectedDate
                                        ? "bg-[#6A5631] text-white"
                                        : "bg-gray-50 text-gray-700"
                                    } border border-gray-200 rounded p-1 flex flex-col items-center`}
                                  >
                                    <span
                                      className={`text-xs ${
                                        isSelectedDate
                                          ? "text-white"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      {new Date(entry.date).toLocaleDateString(
                                        undefined,
                                        {
                                          month: "short",
                                          day: "numeric",
                                        }
                                      )}
                                    </span>
                                    <span
                                      className={`text-sm font-bold ${
                                        isSelectedDate
                                          ? "text-white"
                                          : "text-[#6A5631]"
                                      }`}
                                    >
                                      ₹{entry.price}
                                    </span>
                                    {entry.availableRooms > 0 && (
                                      <span
                                        className={`text-xs ${
                                          isSelectedDate
                                            ? "text-white"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {entry.availableRooms} left
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-2 border-t pt-2">
                          <div className="text-sm text-[#6A5631] py-2 px-3 bg-amber-50 border border-amber-100 rounded flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <div>
                              <span className="font-medium">
                                No calendar pricing available.
                              </span>
                              <span className="block text-xs text-gray-600">
                                Base price of ₹{room.defaultPrice || "N/A"} per
                                night will be used.
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          handleRoomSelection(
                            room.availableRooms,
                            room.category,
                            room._id,
                            e
                          );
                        }}
                        className={`w-full py-3 rounded-lg text-center font-semibold transition-colors duration-300 ${
                          selectedRooms[room.category]
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-[#6A5631] text-white hover:bg-[#5A4728]"
                        }`}
                      >
                        {selectedRooms[room.category] ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Cancel Selection
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Select Room
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hotel Policies */}
          {hotel?.policies && hotel?.policies.length > 0 && (
            <div className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#6A5631]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Hotel Policies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {hotel.policies.map((policy: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 min-w-[20px] text-[#6A5631] mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{policy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Temple Distances */}
          {hotel?.temples?.length > 0 && (
            <div className="bg-white shadow-md rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#6A5631]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Nearby Temples
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                {hotel.temples.map(
                  (
                    temple: { name: string; distance: number },
                    index: number
                  ) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-dashed"
                    >
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-[#6A5631]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-gray-800 font-medium">
                          {temple.name}
                        </span>
                      </div>
                      <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {temple.distance} km
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Location Section */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#6A5631]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Location
            </h2>
            <div className="mb-6">
              {hotel.location ? (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="text-sm uppercase text-gray-500 mb-1">
                    Address
                  </h3>
                  <p className="text-gray-800 font-medium mb-3">
                    {hotel.location}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      hotel.location
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6A5631] hover:text-[#5A4728] inline-flex items-center gap-2 font-medium"
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
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  No location available.
                </div>
              )}
            </div>
            {/* Google Maps Embed */}
            {hotel.location && (
              <div className="rounded-xl overflow-hidden shadow border border-gray-200">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
                    hotel.location
                  )}&key=AIzaSyBfdU1HrvqgUUy-rsXNbvqCJRdQGMshjEE`}
                  className="w-full h-96 border-none"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6">
              <div className="mb-3 sm:mb-0">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Guest Reviews
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {reviews.length > 0
                    ? `${reviews.length} reviews from our guests`
                    : "No reviews yet"}
                </p>
              </div>
              {isLoggedIn ? (
                hasUserAlreadyReviewed ? (
                  <div className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-lg">
                    You have already reviewed this hotel
                  </div>
                ) : (
                  <button
                    className="bg-[#6A5631] text-white px-5 py-2.5 rounded-lg hover:bg-[#5A4728] transition-colors duration-300 shadow-sm flex items-center gap-2"
                    onClick={() => setShowReviewForm((prev) => !prev)}
                  >
                    {showReviewForm ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Cancel
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Write a Review
                      </>
                    )}
                  </button>
                )
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <span className="text-sm text-gray-600 text-center sm:text-left mb-2 sm:mb-0">
                    Sign in to leave a review
                  </span>
                  <button
                    className="bg-[#6A5631] text-white px-5 py-2 rounded-lg hover:bg-[#5A4728] transition-colors duration-300 shadow-sm w-full sm:w-auto"
                    onClick={handleLoginRedirect}
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Review Form for logged-in users */}
            {isLoggedIn && showReviewForm && (
              <div className="bg-gray-50 p-5 rounded-lg mb-8 shadow-sm border border-gray-200 transition-all duration-300">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Share Your Experience
                </h3>

                {submissionSuccess && (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4 flex items-center border border-green-200">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Review submitted successfully! Thank you for your feedback.
                  </div>
                )}

                {submissionError && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 flex items-center border border-red-200">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {submissionError}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-3xl focus:outline-none transition-transform hover:scale-110"
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          onClick={() => handleRatingClick(star)}
                        >
                          {star <= (hoveredRating || userReview.rating) ? (
                            <FaStar className="text-yellow-400" />
                          ) : (
                            <FaRegStar className="text-yellow-400" />
                          )}
                        </button>
                      ))}
                      <span className="ml-3 text-sm text-gray-500">
                        {userReview.rating
                          ? `${userReview.rating} out of 5 stars`
                          : "Select a rating"}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Your Review
                    </label>
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#6A5631] focus:outline-none transition-colors duration-200 text-gray-700 resize-none"
                      rows={4}
                      value={userReview.comment}
                      onChange={handleCommentChange}
                      placeholder="Share details about your stay to help other travelers..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#6A5631] text-white px-6 py-2.5 rounded-lg hover:bg-[#5A4728] transition-colors duration-300 flex items-center gap-2 shadow-sm"
                      disabled={isSubmitting || !userReview.rating}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Submit Review
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Login prompt for non-logged-in users */}
            {!isLoggedIn && (
              <div className="bg-gray-50 p-6 rounded-lg mb-8 text-center border border-gray-200 shadow-sm">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    Share Your Experience
                  </h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Your review helps other travelers make better choices. Sign in
                  to leave your feedback about this hotel.
                </p>
                <button
                  className="bg-[#6A5631] text-white px-6 py-2.5 rounded-lg hover:bg-[#5A4728] transition-colors duration-300 mx-auto shadow-sm"
                  onClick={handleLoginRedirect}
                >
                  Sign In to Review
                </button>
              </div>
            )}

            {/* Average Rating Summary */}
            {reviews.length > 0 && (
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <div className="bg-[#faf6eb] p-4 rounded-lg text-center min-w-[120px]">
                    <div className="text-3xl font-bold text-[#6A5631] mb-1">
                      {(
                        reviews.reduce(
                          (sum, review) => sum + review.rating,
                          0
                        ) / reviews.length
                      ).toFixed(1)}
                    </div>
                    <div className="flex justify-center mb-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const avgRating =
                          reviews.reduce(
                            (sum, review) => sum + review.rating,
                            0
                          ) / reviews.length;
                        return (
                          <span key={i} className="text-yellow-400 text-sm">
                            {i < Math.round(avgRating) ? (
                              <FaStar />
                            ) : (
                              <FaRegStar />
                            )}
                          </span>
                        );
                      })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {reviews.length} reviews
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-700 mb-2">
                      Rating Breakdown
                    </h4>
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter(
                        (review) => review.rating === rating
                      ).length;
                      const percentage = (count / reviews.length) * 100;
                      return (
                        <div key={rating} className="flex items-center mb-1">
                          <div className="text-sm text-gray-600 w-12">
                            {rating} stars
                          </div>
                          <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-yellow-400 h-2.5 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-500 w-10">
                            {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Display reviews */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Guest Feedback
                  </h3>
                  {reviews.map((review, index) => (
                    <div
                      key={review.id || index}
                      className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-300 mb-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                        <div className="flex items-center mb-2 sm:mb-0">
                          <div className="w-10 h-10 rounded-full bg-[#6A5631] text-white flex items-center justify-center mr-3 uppercase font-semibold">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {review.userName}
                            </h4>
                            <div className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className="text-yellow-400 text-sm mx-0.5"
                            >
                              {i < review.rating ? <FaStar /> : <FaRegStar />}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment || (
                            <span className="text-gray-400 italic">
                              No comment provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <h4 className="text-xl font-semibold text-gray-700 mb-2">
                    No Reviews Yet
                  </h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Be the first to review this hotel and help other travelers
                    make informed decisions!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guest Info Form - Enhanced */}
        <div className="hidden sm:block lg:sticky lg:top-4">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#6A5631]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Booking Details
            </h3>
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

      {/* Sticky Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white shadow-xl rounded-t-xl mx-2 mb-2 flex items-center justify-between px-4 py-3 border border-gray-200">
        <div className="flex items-center gap-2">
          <svg
            className="w-7 h-7 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <div>
            <div className="text-lg font-bold text-black">
              ₹
              {selectedRoomId
                ? getRoomInfoForDate(
                    hotel.rooms.find((room) => room._id === selectedRoomId) ||
                      {},
                    selectedDate || new Date()
                  ).price
                : 0}
            </div>
          </div>
        </div>
        <button
          className="flex items-center gap-2 bg-[#6A5631] text-white font-bold px-5 py-2 rounded-lg shadow hover:bg-[#5a4827] transition"
          onClick={() => setShowGuestFormOverlay(true)}
        >
          <span>More Details</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Guest Info Overlay for Mobile */}
      {showGuestFormOverlay && (
        <div className="fixed inset-0 z-50 flex items-end sm:hidden transition-all">
          <div className="bg-white w-full rounded-t-2xl p-0 max-h-[92vh] overflow-y-auto relative shadow-2xl animate-slideUp">
            {/* Custom Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-2xl">
              <span className="font-bold text-black text-lg">
                Complete Your Booking
              </span>
              <button
                className="text-2xl text-black font-bold"
                onClick={() => setShowGuestFormOverlay(false)}
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="p-3">
              <GuestInfoForm
                pricePerNight={
                  selectedRoomId
                    ? getRoomInfoForDate(
                        hotel.rooms.find(
                          (room) => room._id === selectedRoomId
                        ) || {},
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
                            ).padStart(2, "0")}-${String(
                              date.getDate()
                            ).padStart(2, "0")}`
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
      )}
    </div>
  );
};

export default Detail;
