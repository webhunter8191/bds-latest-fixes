import React, { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { tokenService } from "../utils/token";
import tourData from "../data/tour.json";
import img1 from "../assets/bg1.png";
import img2 from "../assets/bg2.jpg";
import img3 from "../assets/bg3.png";
import img4 from "../assets/mathura.png";
import img5 from "../assets/agra.png";
import {
  Clock,
  Banknote,
  MapPin,
  ArrowRight,
  Car,
  Rainbow,
  UserCheck,
  Coffee,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
const imageMap: Record<string, string> = {
  "bg1.png": img1,
  "bg2.jpg": img2,
  "bg3.png": img3,
  "mathura.png": img4,
  "agra.png": img5,
};
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const Tours: React.FC = () => {
  const { slug } = useParams();
  const tour = tourData.tours.find((tour) => tour.slug === slug);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, showToast } = useAppContext();

  // const startRazorpayPayment = async () => {
  //   const totalAmount = calculateTotal();

  //   const res = await fetch(`${API_BASE_URL}/api/payment/order`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${tokenService.getToken()}`,
  //     },
  //     body: JSON.stringify({
  //       amount: totalAmount,
  //     }),
  //   });

  //   if (!res.ok) {
  //     console.error(
  //       "API request to create Razorpay order failed:",
  //       res.status,
  //       res.statusText
  //     );
  //     const errorBody = await res.text();
  //     console.error("API error response body:", errorBody);
  //     showToast({
  //       message: `Failed to create Razorpay order: ${res.statusText}`,
  //       type: "ERROR",
  //     });
  //     return;
  //   }

  //   const { data: order } = await res.json();

  //   console.log("Razorpay Order Data:", order);

  //   if (!order || !order.id) {
  //     showToast({ message: "Failed to create Razorpay order", type: "ERROR" });
  //     return;
  //   }

  //   if (!import.meta.env.VITE_API_RAZORPAY_KEY_ID) {
  //     showToast({ message: "Razorpay key is not configured", type: "ERROR" });
  //     console.error("Razorpay: VITE_API_RAZORPAY_KEY_ID is not defined.");
  //     return;
  //   }

  //   const options = {
  //     key: import.meta.env.VITE_API_RAZORPAY_KEY_ID,
  //     amount: order.amount,
  //     currency: "INR",
  //     name: "Brij Divine Stay",
  //     description: "Tour Booking",
  //     order_id: order.id,

  //     handler: function (response: any) {
  //       console.log("Razorpay payment response:", response);
  //       verifyPayment(response);
  //     },
  //   };

  //   console.log("Razorpay Options:", options);

  //   try {
  //     new window.Razorpay(options).open();
  //   } catch (razorpayError) {
  //     console.error("Error opening Razorpay:", razorpayError);
  //     showToast({ message: "Failed to open payment gateway", type: "ERROR" });
  //   }
  // };
  const getAmountToPay = () =>
    paymentOption === "partial" ? calculateTotal() * 0.3 : calculateTotal();

  const startRazorpayPayment = async () => {
    const amountToPay = getAmountToPay();

    // ✅ 1️⃣ Get token safely
    const token = tokenService.getToken();

    if (!token) {
      showToast({
        message: "Please login to continue payment",
        type: "ERROR",
      });
      navigate("/auth-choice", {
        state: { redirectTo: location.pathname },
      });
      return;
    }

    try {
      // ✅ 2️⃣ Create Razorpay order WITH token (charge 30% or full based on option)
      const res = await fetch(`${API_BASE_URL}/api/payment/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amountToPay }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Order API failed:", errorText);

        showToast({
          message: "Failed to create payment order",
          type: "ERROR",
        });
        return;
      }

      const { data: order } = await res.json();

      if (!order?.id) {
        showToast({
          message: "Invalid payment order received",
          type: "ERROR",
        });
        return;
      }

      // ✅ 3️⃣ Razorpay config
      const options = {
        key: import.meta.env.VITE_API_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Brij Divine Stay",
        description: "Tour Booking",
        order_id: order.id,

        handler: (response: any) => {
          verifyPayment(response);
        },
      };

      // ✅ 4️⃣ Open Razorpay ONLY after order success
      new (window as any).Razorpay(options).open();
    } catch (err) {
      console.error("Payment init error:", err);
      showToast({
        message: "Unable to start payment",
        type: "ERROR",
      });
    }
  };

  // const verifyPayment = async (response: any) => {
  //   const res = await fetch(`${API_BASE_URL}/api/payment/verify`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${tokenService.getToken()}`,
  //     },
  //     body: JSON.stringify({
  //       ...response,
  //       amount: calculateTotal(),
  //     }),
  //   });

  //   if (res.ok) {
  //     createTourBooking(response.razorpay_payment_id);
  //   } else {
  //     showToast({ message: "Payment failed", type: "ERROR" });
  //   }
  // };
  const verifyPayment = async (response: any) => {
    const token = tokenService.getToken();

    if (!token) {
      showToast({
        message: "Session expired. Please login again.",
        type: "ERROR",
      });
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/payment/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...response,
        amount: Math.round(getAmountToPay() * 100),
      }),
    });

    if (res.ok) {
      createTourBooking(response.razorpay_payment_id);
    } else {
      showToast({ message: "Payment verification failed", type: "ERROR" });
    }
  };

  const createTourBooking = async (paymentId: string) => {
    const res = await fetch(
      `${API_BASE_URL}/api/my-bookings/booking/${tour?.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenService.getToken()}`,
        },
        body: JSON.stringify({
          tourId: tour?.id,
          tourName: tour?.title,
          tourDate,
          guests,
          includeFood,
          includeStay,
          totalAmount: getAmountToPay(),
          fullAmount: calculateTotal(),
          paymentOption,
          paymentStatus: "paid",
          paymentIntentId: paymentId,
        }),
      }
    );

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      showToast({
        message: msg || "Failed to save tour booking",
        type: "ERROR",
      });
      return;
    }

    showToast({
      message: "Tour booked successfully!",
      type: "SUCCESS",
    });

    navigate("/my-bookings");
  };

  const handleBookTour = async () => {
    // 2️⃣ Date validation
    if (!tourDate) {
      // If mobile overlay is open, show inline message instead of toast
      setTourDateError("Please select tour start date");
      if (!showMobileOverlay) {
        showToast({
          message: "Please select tour start date",
          type: "ERROR",
        });
      }
      return;
    }
    // 1️⃣ Login check
    if (!currentUser) {
      navigate("/auth-choice", {
        state: { redirectTo: location.pathname },
      });
      return;
    }

    // 3️⃣ Go to payment
    startRazorpayPayment();
  };

  if (!tour) {
    return (
      <div className="text-center py-20 text-gray-500">Tour not found</div>
    );
  }
  const [guests, setGuests] = useState(4);
  const [includeFood, setIncludeFood] = useState(false);
  const [includeStay, setIncludeStay] = useState(false);
  const [tourDate, setTourDate] = useState("");
  const [paymentOption, setPaymentOption] = useState<"full" | "partial">(
    "full"
  );
  const [tourDateError, setTourDateError] = useState("");

  useEffect(() => {
    if (location.state && (location.state as any).fromSignIn) {
      const state = location.state as any;
      if (state.guests !== undefined)
        setGuests(Math.max(4, Number(state.guests)));
      if (state.includeFood !== undefined) setIncludeFood(state.includeFood);
      if (state.includeStay !== undefined) setIncludeStay(state.includeStay);
      if (state.tourDate !== undefined) setTourDate(state.tourDate);
      if (state.paymentOption !== undefined)
        setPaymentOption(state.paymentOption);
    }
  }, [location.state]);

  // Pricing configuration
  const pricing = tour.pricing;

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel slides data
  const slides = tour.heroSlides;
  const itinerary = tour.itinerary;
  const DAYS = tour.days;
  const NIGHTS = tour.nights;

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const calculateStayCost = (guests: number) => {
    if (guests <= 3) return pricing.stay.upto3;
    if (guests === 4) return pricing.stay.extra4th;
    if (guests <= 6) return pricing.stay.fiveToSix;
    return pricing.stay.sevenToEight;
  };

  const calculateTotal = () => {
    let total = pricing.baseTour * guests;
    if (includeFood) total += pricing.food * guests * DAYS; // 3 days
    if (includeStay) total += calculateStayCost(guests) * DAYS; // Stay cost for 3 days
    return total;
  };

  // Compact Vertical Card - Desktop calculator styled similar to mobile overlay
  const PricingCalculator = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-[#EBC486]/40 overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#2D241C] to-[#1a1611] px-4 py-3">
          <h3 className="text-base font-semibold text-white text-center">
            Complete Your Booking
          </h3>
          <p className="text-[11px] text-amber-100 text-center mt-0.5">
            {DAYS} Days / {NIGHTS} Nights • {guests} Guests
          </p>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Price & payment label */}
          <div className="bg-[#FAF5EB] rounded-xl px-3 py-2.5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                {paymentOption === "partial" ? "Pay Now (30%)" : "Total Amount"}
              </p>
              <p className="text-xl font-bold text-[#2D241C]">
                ₹
                {paymentOption === "partial"
                  ? Math.round(calculateTotal() * 0.3).toLocaleString()
                  : calculateTotal().toLocaleString()}
              </p>
              {paymentOption === "partial" && (
                <p className="text-[10px] text-gray-600 mt-0.5">
                  Total package: ₹{calculateTotal().toLocaleString()}
                </p>
              )}
            </div>
            <div className="hidden sm:flex flex-col items-end text-[10px] text-gray-500">
              <span>Secure online payment</span>
              <span>Powered by Razorpay</span>
            </div>
          </div>

          {/* Guests */}
          <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-800">Guests</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGuests(Math.max(4, guests - 1))}
                className="bg-[#EBC486] text-[#2D241C] w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition"
              >
                <Minus size={12} />
              </button>
              <div className="min-w-[28px] text-center">
                <p className="text-sm font-semibold">{guests}</p>
                <p className="text-[10px] text-gray-500 -mt-0.5">Guests</p>
              </div>
              <button
                onClick={() => setGuests(Math.min(20, guests + 1))}
                className="bg-[#EBC486] text-[#2D241C] w-6 h-6 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {/* Base tour (always included) */}
            <div className="rounded-xl border border-green-500/70 bg-green-50 px-3 py-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Tour Package
                </p>
                <p className="text-xs text-gray-600">
                  Sacred journey itinerary
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">
                  ₹{(pricing.baseTour * guests).toLocaleString()}
                </span>
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              </div>
            </div>

            {/* Meals */}
            <button
              type="button"
              onClick={() => setIncludeFood(!includeFood)}
              className={`w-full rounded-xl border px-3 py-2 flex items-center justify-between text-left transition ${
                includeFood
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-green-300"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <Coffee size={14} className="text-[#EBC486]" />
                  Meals
                </p>
                <p className="text-xs text-gray-600">
                  All meals for {DAYS} days
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  ₹{(pricing.food * guests * DAYS).toLocaleString()}
                </span>
                {includeFood && (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
            </button>

            {/* Stay */}
            <button
              type="button"
              onClick={() => setIncludeStay(!includeStay)}
              className={`w-full rounded-xl border px-3 py-2 flex items-center justify-between text-left transition ${
                includeStay
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-green-300"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                  <UserCheck size={14} className="text-[#EBC486]" />
                  Stay
                </p>
                {/* <p className="text-xs text-gray-600">
                  {guests <= 4 ? "1 Room" : "2 Rooms"} • {DAYS}
                </p> */}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  ₹{(calculateStayCost(guests) * DAYS).toLocaleString()}
                </span>
                {includeStay && (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Date */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-800">
              Tour Start Date
            </label>
            <input
              type="date"
              value={tourDate}
              onChange={(e) => setTourDate(e.target.value)}
              className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#EBC486]"
            />
          </div>

          {/* Payment option – dropdown */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-800">
              Payment Option
            </p>
            <select
              value={paymentOption}
              onChange={(e) =>
                setPaymentOption(e.target.value as "full" | "partial")
              }
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#EBC486]"
            >
              <option value="full">
                Pay full amount (₹{calculateTotal().toLocaleString()})
              </option>
              <option value="partial">
                Pay 30% now (₹
                {Math.round(calculateTotal() * 0.3).toLocaleString()})
              </option>
            </select>
            {paymentOption === "partial" ? (
              <p className="text-[10px] text-gray-600">
                Remaining ₹{Math.round(calculateTotal() * 0.7).toLocaleString()}{" "}
                at tour start
              </p>
            ) : (
              <p className="text-[10px] text-gray-600">
                Recommended for hassle-free experience
              </p>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={handleBookTour}
            className="w-full mt-1 bg-gradient-to-r from-[#EBC486] to-[#D4AF37] text-[#2D241C] py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile Bottom Bar Component
  const [showMobileOverlay, setShowMobileOverlay] = useState(false);
  const WhatsAppFloatingButton = () => (
    <a
      href={`https://wa.me/919258010200?text=${encodeURIComponent(
        `Hello! I am interested in your tour package.`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-50 lg:hidden w-14 h-14 bg-[#25D366] rounded-full shadow-xl flex items-center justify-center text-white hover:bg-[#1ebe5d] transition-all duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.373 0 0 5.373 0 12a11.94 11.94 0 001.78 6.23L0 24l5.81-1.76A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12 0-3.18-1.23-6.18-3.48-8.52zM12 22c-2.04 0-3.95-.63-5.53-1.7l-.39-.24-3.45 1.04 1.04-3.36-.26-.39A9.97 9.97 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.55-7.2c-.31-.16-1.83-.9-2.12-1-.28-.12-.48-.16-.68.16-.2.31-.77 1-0.95 1.21-.17.2-.34.23-.64.08-.3-.16-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.07-.17-.31-.02-.48.14-.64.14-.14.31-.36.46-.54.15-.18.2-.31.3-.52.1-.2.05-.38-.02-.54-.08-.16-.68-1.64-.93-2.25-.24-.58-.49-.5-.68-.51l-.58-.01c-.2 0-.52.07-.79.38-.27.3-1.03 1.01-1.03 2.45 0 1.44 1.06 2.83 1.21 3.03.16.2 2.09 3.2 5.07 4.48.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.83-.74 2.08-1.46.26-.71.26-1.32.18-1.45-.08-.13-.28-.2-.59-.36z" />
      </svg>
    </a>
  );

  const MobileBottomBar = () => (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white shadow-xl rounded-t-xl mx-2 mb-2 flex items-center justify-between px-4 py-3 border border-gray-200">
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
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <div>
          <div className="text-lg font-bold text-black">
            ₹{calculateTotal().toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">
            for {guests} guest{guests > 1 ? "s" : ""}
          </div>
        </div>
      </div>
      <button
        className="flex items-center gap-2 bg-[#EBC486] text-[#2D241C] font-bold px-5 py-2 rounded-lg shadow hover:bg-[#D4AF37] transition"
        onClick={() => setShowMobileOverlay(true)}
      >
        <span>Book Tour</span>
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );

  const MobileOverlay = () => (
    <div className="fixed inset-0 z-50 flex items-end lg:hidden bg-black/40">
      <div className="bg-white w-full rounded-t-2xl h-[95vh] shadow-2xl overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-bold text-lg">Complete Your Booking</span>
          <button
            onClick={() => setShowMobileOverlay(false)}
            className="text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* HERO */}
        <div className="px-3 py-3 bg-gradient-to-br from-[#2D241C] to-[#1a1611] text-white">
          <div className="text-center mb-3">
            <h2 className="text-base font-bold">Begin Your Sacred Journey</h2>
            <p className="text-[11px] text-gray-300">
              Customize your spiritual tour
            </p>
          </div>

          {/* GUEST COUNTER */}
          <div className="bg-black/30 rounded-xl px-3 py-2.5 flex items-center justify-between">
            <button
              onClick={() => setGuests(Math.max(4, guests - 1))}
              className="bg-[#EBC486] text-[#2D241C] p-2 rounded-full"
            >
              <Minus size={16} />
            </button>

            <div className="text-center">
              <p className="text-xl font-bold">{guests}</p>
              <p className="text-xs text-gray-300">Guests</p>
            </div>

            <button
              onClick={() => setGuests(Math.min(20, guests + 1))}
              className="bg-[#EBC486] text-[#2D241C] p-2 rounded-full"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* OPTIONS */}
        <div className="px-3 py-3 space-y-2">
          {/* DATE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Tour Start Date
            </label>
            <input
              type="date"
              value={tourDate}
              onChange={(e) => {
                setTourDate(e.target.value);
                if (tourDateError) setTourDateError("");
              }}
              className="w-full mt-1 border rounded-xl px-3 py-2 text-sm"
            />
            {tourDateError && (
              <p className="mt-1 text-xs text-red-500">{tourDateError}</p>
            )}
          </div>

          {/* TOUR PACKAGE – ALWAYS SELECTED */}
          <div className="rounded-xl border border-green-500 bg-green-50 px-3 py-2.5 flex justify-between items-center">
            <div>
              <p className="font-semibold text-sm text-gray-900">
                Tour Package
              </p>
              <p className="text-xs text-gray-600">3 Days Spiritual</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">
                ₹{(pricing.baseTour * guests).toLocaleString()}
              </span>
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            </div>
          </div>

          {/* MEALS */}
          <div
            onClick={() => setIncludeFood(!includeFood)}
            className={`cursor-pointer rounded-xl border px-3 py-2.5 flex justify-between items-center transition ${
              includeFood
                ? "border-green-500 bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div>
              <p className="font-semibold text-sm text-gray-900">Meals</p>
              <p className="text-xs text-gray-600">3 Days</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                ₹{(pricing.food * guests * 3).toLocaleString()}
              </span>

              {includeFood && (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </div>
          </div>

          {/* STAY */}
          <div
            onClick={() => setIncludeStay(!includeStay)}
            className={`cursor-pointer rounded-xl border px-3 py-2.5 flex justify-between items-center transition ${
              includeStay
                ? "border-green-500 bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div>
              <p className="font-semibold text-sm text-gray-900">Stay</p>
              <p className="text-xs text-gray-600">
                {guests <= 4 ? "1 Room" : "2 Rooms"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                ₹{(calculateStayCost(guests) * DAYS).toLocaleString()}
              </span>

              {includeStay && (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </div>
          </div>

          {/* PAYMENT OPTION (mobile overlay) */}
          <div className="pt-1 space-y-2">
            <p className="text-sm font-semibold text-gray-800">
              Payment Option
            </p>
            <select
              value={paymentOption}
              onChange={(e) =>
                setPaymentOption(e.target.value as "full" | "partial")
              }
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#EBC486]"
            >
              <option value="full">
                Pay full amount (₹{calculateTotal().toLocaleString()})
              </option>
              <option value="partial">
                Pay 30% now (₹
                {Math.round(calculateTotal() * 0.3).toLocaleString()})
              </option>
            </select>
            {paymentOption === "partial" ? (
              <p className="text-[11px] text-gray-600">
                Remaining ₹{Math.round(calculateTotal() * 0.7).toLocaleString()}{" "}
                at tour start
              </p>
            ) : (
              <p className="text-[11px] text-gray-600">
                Single secure payment for entire tour
              </p>
            )}
          </div>
        </div>

        {/* STICKY TOTAL */}
        <div className="sticky bottom-0 bg-white border-t p-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-600">
              {paymentOption === "partial"
                ? "Amount to pay now"
                : "Total amount"}
            </span>
            <span className="text-lg font-bold text-[#EBC486]">
              ₹{getAmountToPay().toLocaleString()}
            </span>
          </div>
          {paymentOption === "partial" && (
            <p className="text-[11px] text-gray-500 mb-3">
              Total package: ₹{calculateTotal().toLocaleString()}
            </p>
          )}

          <button
            onClick={handleBookTour}
            className="w-full mt-1 py-4 rounded-xl font-bold bg-gradient-to-r from-[#EBC486] to-[#D4AF37] text-[#2D241C] active:scale-[0.98]"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FAF9F6] text-[#2D241C] relative">
      {/* Mobile Bottom Bar */}
      <MobileBottomBar />
      <WhatsAppFloatingButton />
      {/* HERO CAROUSEL */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background with images */}
        {slides.map((_, index) => (
          <div
            key={`bg-${index}`}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={index % 2 === 0 ? img1 : img2}
              alt={`Slide ${index + 1} background`}
              className="w-full h-full object-cover"
            />
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        {/* Carousel Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 transform ${
                index === currentSlide
                  ? "opacity-100 translate-x-0"
                  : index < currentSlide
                  ? "opacity-0 -translate-x-full absolute inset-0"
                  : "opacity-0 translate-x-full absolute inset-0"
              }`}
            >
              <div className="text-center text-white">
                <span className="inline-block px-4 py-1 bg-[#EBC486]/20 text-[#EBC486] text-xs sm:text-sm tracking-widest uppercase rounded-full border border-[#EBC486]/30 mb-4">
                  {slide.highlight}
                </span>
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold leading-tight mb-4">
                  {slide.title}
                </h1>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed px-2 mb-6">
                  {slide.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button className="mx-auto bg-[#EBC486] text-[#2D241C]  px-6 sm:px-6 py-3 sm:py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-white transition text-sm sm:text-base shadow-lg hover:shadow-xl">
                    Book Your Tour{" "}
                    <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                  {/* <button className="border border-white/40 px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-white/10 transition text-sm sm:text-base">
                    View Gallery
                  </button> */}
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          {/* <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-2 rounded-full transition-all duration-200 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#EBC486]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 p-2 rounded-full transition-all duration-200 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#EBC486]" />
          </button> */}

          {/* Slide Indicators */}
          {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-[#EBC486] w-6'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div> */}
        </div>
      </section>

      {/* META */}
      <section className="mt-6 sm:-mt-8 md:-mt-10 relative z-20 px-3 sm:px-4 md:px-6 pb-0 lg:pb-0">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {[
            {
              icon: Clock,
              label: "Duration",
              value: DAYS + " Days / " + NIGHTS + " Nights",
            },
            {
              icon: Car,
              label: "Customizable Tour Package",
              value: "Meals • Stay • Travel",
            },
            {
              icon: Banknote,
              label: "Transparent Pricing",
              value: "Clear & honest pricing",
            },
            {
              icon: Rainbow,
              label: "Spiritual Experience",
              value: "Guided temple visits",
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-white p-2 sm:p-3 md:p-4 lg:p-5 rounded-lg sm:rounded-xl text-center shadow-sm"
            >
              <Icon className="mx-auto mb-1.5 sm:mb-2 text-[#6A5631] w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              <p className="text-xs sm:text-sm uppercase text-gray-400">
                {label}
              </p>
              <p className="font-bold text-xs sm:text-sm md:text-base">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT LAYOUT */}
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FAF9F6]/50 to-transparent pointer-events-none" />
        {/* Section Header */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 xl:py-20">
          <section className="max-w-7xl mx-auto px-4 mb-16">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2D241C] mb-4">
                Your Spiritual Journey
              </h2>

              <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Experience the divine path through sacred places and timeless
                traditions
              </p>

              <div className="w-24 h-1 bg-gradient-to-r from-[#EBC486] to-[#D4AF37] mx-auto mt-6 rounded-full"></div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16">
            {/* ITINERARY SECTION - Left Column */}
            <div className="lg:col-span-8 xl:col-span-7">
              <div className="space-y-8 lg:space-y-12 xl:space-y-16">
                {/* Itinerary Days */}
                {itinerary.map((day) => (
                  <div key={day.day} className="group">
                    {/* Day Header with elegant styling */}
                    <div className="flex items-center gap-4 mb-6 lg:mb-8">
                      <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#6A5631] to-[#5a4a2a] rounded-full shadow-lg">
                        <span className="text-lg lg:text-xl font-bold text-white">
                          {day.day}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[#2D241C] mb-1">
                          {day.title}
                        </h3>
                        <div className="w-16 h-0.5 bg-[#EBC486] rounded-full"></div>
                      </div>
                    </div>

                    {/* Day Content Card */}
                    <div className="bg-white rounded-2xl lg:rounded-3xl shadow-xl border border-gray-100 overflow-hidden group-hover:shadow-2xl transition-all duration-300">
                      <div className="grid grid-rows-1  lg:grid-rows-1 gap-0 ">
                        {/* Image Section */}
                        <div className="relative overflow-hidden h">
                          <img
                            src={imageMap[day.image]}
                            alt={day.title}
                            className="w-full h-50 sm:h-80 lg:h-50 object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                          {/* Day number overlay */}
                          <div className="absolute top-0 left-4 lg:top-6 lg:left-6">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 lg:px-4 lg:py-2">
                              <span className="text-sm lg:text-base font-semibold text-[#2D241C]">
                                Day {day.day}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 lg:p-8 xl:p-10 space-y-6 lg:space-y-8">
                          {/* Morning Session */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#EBC486]/10 rounded-lg">
                                <Car className="w-5 h-5 lg:w-6 lg:h-6 text-[#6A5631]" />
                              </div>
                              <h4 className="text-lg lg:text-xl font-semibold text-[#2D241C]">
                                {day.morning.title}
                              </h4>
                            </div>
                            <ul className="space-y-3 lg:space-y-4">
                              {day.morning.items.map((item, i) => (
                                <li key={i} className="flex gap-3">
                                  <div className="w-2 h-2 bg-[#EBC486] rounded-full mt-2 flex-shrink-0"></div>
                                  <div>
                                    <p className="font-semibold text-[#2D241C] text-sm lg:text-base">
                                      {item.name}
                                      {/* {item.time && (
                                        <span className="text-[#6A5631] ml-2 font-medium">
                                          ({item.time})
                                        </span>
                                      )} */}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed mt-1">
                                      {item.desc}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Afternoon Session */}
                          <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-[#EBC486]/10 rounded-lg">
                                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-[#6A5631]" />
                              </div>
                              <h4 className="text-lg lg:text-xl font-semibold text-[#2D241C]">
                                {day.afternoon.title}
                              </h4>
                            </div>
                            <ul className="space-y-3 lg:space-y-4">
                              {day.afternoon.items.map((item, i) => (
                                <li key={i} className="flex gap-3">
                                  <div className="w-2 h-2 bg-[#EBC486] rounded-full mt-2 flex-shrink-0"></div>
                                  <div>
                                    <p className="font-semibold text-[#2D241C] text-sm lg:text-base">
                                      {item.name}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed mt-1">
                                      {item.desc}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PRICING CALCULATOR - Right Column */}
            <div className="hidden lg:block lg:col-span-4 xl:col-span-5 ">
              <div className="lg:sticky lg:top-8 xl:top-12">
                {/* Section Header */}
                <div className="text-center lg:text-left mb-8">
                  <h3 className="text-xl lg:text-2xl font-serif font-bold text-[#2D241C] mb-2">
                    Customize Your Package
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                    Personalize your spiritual journey with our flexible pricing
                    options
                  </p>
                </div>

                {/* Calculator Card */}
                <div className="flex flex-col gap-4 overflow-hidden">
                  <PricingCalculator />
                  <div className="mt-4 text-center">
                    <a
                      href={`https://wa.me/919258010200?text=${encodeURIComponent(
                        `Hello! I am interested in the ${DAYS}-day / ${NIGHTS}-night tour for ${guests} guest(s).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" group relative inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full border border-green-500/30 bg-green-500/10 text-green-600 font-semibold text-sm sm:text-base transition-all duration-300 hover:bg-green-500 hover:text-white hover:shadow-xl"
                    >
                      <FaWhatsapp
                        size={20}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />

                      <span>Enquire on WhatsApp</span>
                    </a>
                  </div>
                </div>
                {/* WhatsApp Enquiry Button */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="px-3 sm:px-4 md:px-6 pb-24 sm:pb-24 md:pb-24 lg:pb-0">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-[#EBC486]/20 to-[#D4AF37]/20 rounded-2xl p-8 sm:p-10 md:p-12 backdrop-blur-sm border border-[#EBC486]/30">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#2D241C] mb-4">
              Ready for Your Divine Journey?
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
              Use the pricing calculator on the right to customize your
              spiritual tour package. Experience the sacred lands of Lord
              Krishna with personalized service and authentic hospitality.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Expert Spiritual Guides</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Authentic Local Cuisine</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Sacred Site Access</span>
              </div>
            </div>
          </div>

          {/* PRICING SUMMARY */}
          <section className="px-3 sm:px-4 md:px-4 py-6 sm:py-8 md:py-12 lg:py-16 pb-24 sm:pb-24 md:pb-24 lg:pb-0">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-[#2D241C] mb-2 sm:mb-3">
                  Transparent Pricing Structure
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2 sm:px-4">
                  Comprehensive pricing breakdown for your spiritual journey
                </p>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl border border-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                  <div className="text-center group">
                    <div className="bg-[#EBC486]/10 rounded-md sm:rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 group-hover:bg-[#EBC486]/20 transition-colors">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#EBC486] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#2D241C]" />
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 text-[#2D241C]">
                        Spiritual Tour
                      </h3>
                      <p className="text-xl sm:text-2xl md:text-2xl font-bold text-[#2D241C] mb-0.5 sm:mb-1">
                        ₹{pricing.baseTour.toLocaleString()}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        per person
                      </p>
                    </div>
                  </div>

                  <div className="text-center group">
                    <div className="bg-[#EBC486]/10 rounded-md sm:rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 group-hover:bg-[#EBC486]/20 transition-colors">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#EBC486] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                        <Coffee className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#2D241C]" />
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 text-[#2D241C]">
                        Gourmet Meals
                      </h3>
                      <p className="text-xl sm:text-2xl md:text-xl font-bold text-[#2D241C] mb-0.5 sm:mb-1">
                        ₹{pricing.food.toLocaleString()}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        per person/day
                      </p>
                    </div>
                  </div>

                  <div className="text-center group sm:col-span-2 md:col-span-1">
                    <div className="bg-[#EBC486]/10 rounded-md sm:rounded-lg md:rounded-xl p-3 sm:p-4 md:p-6 group-hover:bg-[#EBC486]/20 transition-colors">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#EBC486] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                        <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#2D241C]" />
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 text-[#2D241C]">
                        Premium Stay
                      </h3>
                      <p className="text-lg sm:text-xl md:text-xl font-bold text-[#2D241C] mb-0.5 sm:mb-1">
                        ₹1,000 - ₹2,500
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        per day (group)
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div className="border-t border-gray-200 pt-3 sm:pt-4 md:pt-6">
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                      Starting Package Price
                    </p>
                    <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#2D241C] mb-1 sm:mb-2">
                      ₹{(pricing.baseTour * DAYS).toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      for 4 guests • Complete spiritual experience
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </section>

          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Trusted by spiritual seekers worldwide
            </p>
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-[#EBC486] rounded-full"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Overlay */}
      {showMobileOverlay && <MobileOverlay />}
    </div>
  );
};

export default Tours;
