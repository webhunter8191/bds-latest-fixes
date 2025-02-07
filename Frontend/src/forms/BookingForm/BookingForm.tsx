import { useForm } from "react-hook-form";
import { UserType } from "../../../../backend/src/shared/types";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const RAZORPAY_KEY_ID = import.meta.env.VITE_API_RAZORPAY_KEY_ID;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type Props = {
  currentUser: UserType;
  totalCost: number;
  roomsId: string;
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
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const BookingForm = ({ currentUser, totalCost, roomsId }: Props) => {
  const search = useSearchContext();
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAppContext();

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
        checkIn: formattedCheckIn, // Pass the formatted checkIn date here
        checkOut: formattedCheckOut, // Pass the formatted checkOut date here
        hotelId: hotelId,
        totalCost,
      };

      // const { bookingId } = bookingResponse.data;

      const paymentRes = await fetch(`${API_BASE_URL}/api/payment/order`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
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
      name: "Paradise View Hotel",
      description: "Complete your booking",
      order_id: orderData.id,
      handler: async (response: any) => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/payment/verify`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
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
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5 mx-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>
        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: Rs.{Math.round(search.totalCost)}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          // onClick={handlePayment}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500 ml-2"
        >
          Confirm Booking
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
