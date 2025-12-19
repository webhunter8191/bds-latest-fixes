import { useForm } from "react-hook-form";
import { UserType } from "../../../../backend/src/shared/types";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuthHeader } from "../../utils/token";

const RAZORPAY_KEY_ID = import.meta.env.VITE_API_RAZORPAY_KEY_ID;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type Props = {
  currentUser: UserType;
  totalCost: number;
  roomsId: string;
  paymentOption?: "full" | "partial";
  fullAmount?: number;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  roomCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
  paymentOption?: "full" | "partial";
  fullAmount?: number;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BookingForm = ({
  currentUser,
  totalCost,
  roomsId,
  paymentOption = "full",
  fullAmount,
}: Props) => {
  const search = useSearchContext();
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const location = useLocation();

  // Set default values for paymentOption and fullAmount from location state if not provided as props
  const statePaymentOption = location.state?.paymentOption || paymentOption;
  const stateFullAmount = location.state?.fullAmount || fullAmount || totalCost;

  // Helper function to calculate number of days between check-in and check-out
  // const calculateDays = (checkIn: Date, checkOut: Date) => {
  //   const checkInDate = new Date(checkIn);
  //   const checkOutDate = new Date(checkOut);
  //   return Math.max(1, (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  // };

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved!", type: "SUCCESS" });
        navigate("/my-bookings");
      },
      onError: () => {
        showToast({ message: "Error saving booking", type: "ERROR" });
      },
    }
  );

  // Ensure checkIn and checkOut are valid Date objects
  const formattedCheckIn = new Date(search.checkIn).toISOString();
  const formattedCheckOut = new Date(search.checkOut).toISOString();

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      roomCount: search.roomCount,
      checkIn: formattedCheckIn, // Pass formatted checkIn date
      checkOut: formattedCheckOut, // Pass formatted checkOut date
      hotelId: hotelId,
      totalCost,
      paymentOption: statePaymentOption,
      fullAmount: stateFullAmount,
    },
  });

  let bookingData: any;
  const handlePayment = async () => {
    try {
      bookingData = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        roomCount: search.roomCount,
        checkIn: formattedCheckIn,
        checkOut: formattedCheckOut,
        hotelId: hotelId,
        totalCost,
        paymentOption: statePaymentOption,
        fullAmount: stateFullAmount,
      };

      // const { bookingId } = bookingResponse.data;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      const authHeader = getAuthHeader();
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
      const paymentRes = await fetch(`${API_BASE_URL}/api/payment/order`, {
        method: "POST",
        headers,
        body: JSON.stringify({ amount: totalCost }),
      });

      const paymentData = await paymentRes.json();
      await handlePaymentVerify(paymentData.data);
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  const handlePaymentVerify = async (orderData: any) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: orderData.amount * 100,
      currency: orderData.currency,
      name: "Brij Divine Stay",
      description: "Complete your booking",
      order_id: orderData.id,
      handler: async (response: any) => {
        try {
          const verifyHeaders: HeadersInit = {
            "Content-Type": "application/json",
          };
          const authHeader = getAuthHeader();
          if (authHeader) {
            verifyHeaders["Authorization"] = authHeader;
          }
          const res = await fetch(`${API_BASE_URL}/api/payment/verify`, {
            method: "POST",
            headers: verifyHeaders,
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: orderData.amount * 100,
            }),
          });

          const verifyData = await res.json();
          if (verifyData.message) {
            alert(verifyData.message);
            bookRoom({
              ...bookingData,
              paymentIntentId: response.razorpay_payment_id,
              hotelId,
              roomsId,
            });
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
        }
      },
      theme: {
        color: "#5f63b8",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <form
      onSubmit={handleSubmit(handlePayment)}
      className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="h-6 w-6 rounded-full bg-[#6A5631] flex items-center justify-center">
          <span className="text-white text-sm">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Confirm Your Details
        </h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-2 gap-6">
          <label className="text-gray-700 text-sm font-bold flex-1">
            First Name
            <input
              className="mt-1 border rounded-lg w-full py-3 px-4 text-gray-700 bg-white font-normal focus:outline-none focus:ring-2 focus:ring-[#6A5631]"
              type="text"
              readOnly
              disabled
              {...register("firstName")}
            />
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1">
            Last Name
            <input
              className="mt-1 border rounded-lg w-full py-3 px-4 text-gray-700 bg-white font-normal focus:outline-none focus:ring-2 focus:ring-[#6A5631]"
              type="text"
              readOnly
              disabled
              {...register("lastName")}
            />
          </label>
          <label className="text-gray-700 text-sm font-bold flex-1 col-span-2">
            Email
            <input
              className="mt-1 border rounded-lg w-full py-3 px-4 text-gray-700 bg-white font-normal focus:outline-none focus:ring-2 focus:ring-[#6A5631]"
              type="text"
              readOnly
              disabled
              {...register("email")}
            />
          </label>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-[#6A5631] flex items-center justify-center">
            <span className="text-white text-sm">₹</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Price Summary</h2>
        </div>
        <div className="bg-[#6A5631]/5 p-4 sm:p-6 rounded-lg border border-[#6A5631]/10">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm sm:text-base">
              <div className="text-gray-600">Subtotal</div>
              <div className="font-medium">
                ₹{Math.round(totalCost).toLocaleString()}
              </div>
            </div>
            {/* Remove tax breakdown from price summary */}
            {/* In the price summary section, remove the Taxes & Fees row and any calculation for tax. Only show subtotal and total as the same value. */}
            <div className="border-t border-[#6A5631]/10 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <div className="text-sm sm:text-base text-gray-600">
                  {statePaymentOption === "partial"
                    ? "Amount to Pay Now"
                    : "Total Amount"}
                </div>
                <div className="text-lg sm:text-2xl font-bold text-[#6A5631]">
                  ₹{Math.round(totalCost).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-[#6A5631] text-white px-8 py-3 font-bold rounded-lg hover:bg-[#5a4a2a] transition-all duration-200 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
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
              Processing...
            </>
          ) : (
            `Pay ₹${Math.round(totalCost).toLocaleString()}`
          )}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
