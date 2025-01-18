// import { useForm } from "react-hook-form";
// import { PaymentIntentResponse, UserType } from "../../../../backend/src/shared/types";
// import { useSearchContext } from "../../contexts/SearchContext";
// import { useParams } from "react-router-dom";
// import { useMutation } from "react-query";
// import * as apiClient from "../../api-client";
// import { useAppContext } from "../../contexts/AppContext";

// const RAZORPAY_KEY_ID = import.meta.env.VITE_API_RAZORPAY_KEY_ID;

// type Props = {
//   currentUser: UserType;
//   pricepernight: number;
// };

// export type BookingFormData = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   roomCount: number;
//   checkIn: string;
//   checkOut: string;
//   hotelId: string;
//   paymentIntentId: string;
//   totalCost: number;
// };

// declare global {
//   interface Window {
//     Razorpay: any;
//   }
// }

// const BookingForm = ({ currentUser, pricepernight }: Props) => {
//   const search = useSearchContext();
//   const { hotelId } = useParams();
//   const { showToast } = useAppContext();

//   const { mutate: bookRoom, isLoading } = useMutation(apiClient.createRoomBooking, {
//     onSuccess: () => {
//       showToast({ message: "Booking Saved!", type: "SUCCESS" });
//     },
//     onError: () => {
//       showToast({ message: "Error saving booking", type: "ERROR" });
//     },
//   });

//   const { handleSubmit, register } = useForm<BookingFormData>({
//     defaultValues: {
//       firstName: currentUser.firstName,
//       lastName: currentUser.lastName,
//       email: currentUser.email,
//       roomCount: search.roomCount,
//       checkIn: search.checkIn.toISOString(),
//       checkOut: search.checkOut.toISOString(),
//       hotelId: hotelId,
//       totalCost: pricepernight * search.roomCount,
      
//     },
//   });

//   const handlePayment = async () => {
//     try {
//       // Create the booking first to get the booking ID
//       const bookingData = {
//         firstName: currentUser.firstName,
//         lastName: currentUser.lastName,
//         email: currentUser.email,
//         roomCount: search.roomCount,
//         checkIn: search.checkIn.toISOString(),
//         checkOut: search.checkOut.toISOString(),
//         hotelId: hotelId,
//         totalCost: pricepernight * search.roomCount,
//       };
  
//       const res = await fetch(`http://localhost:7000/api/my-bookings/booking`,{
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(bookingData),
//       });
  
//       const bookingResponse = await res.json();
  
//       if (!bookingResponse.success) {
//         throw new Error("Error creating booking");
//       }
  
//       const { bookingId } = bookingResponse.data; // Get the bookingId from the response
//       console.log("Booking ID:", bookingId);
  
//       // Proceed to create payment order after booking is created
//       const paymentRes = await fetch(`http://localhost:7000/api/payment/order`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ amount: pricepernight * search.roomCount }),
//       });
  
//       const paymentData = await paymentRes.json();
//       console.log("Payment API Response:", paymentData);
  
//       // Now pass the bookingId into the payment verification function
//       handlePaymentVerify(paymentData.data); // Pass the bookingId here
//     } catch (error) {
//       console.error("Error initiating payment:", error);
//     }
//   };
  
//   const handlePaymentVerify = (orderData: any,) => {
//     const options = {
//       key: RAZORPAY_KEY_ID,
//       amount: orderData.amount * 100,
//       currency: orderData.currency,
//       name: "Paradise View Hotel",
//       description: "Complete your booking",
//       order_id: orderData.id,
//       handler: async (response: any) => {
//         console.log("Razorpay Payment Response:", response);
//         try {
//           const res = await fetch(`http://localhost:7000/api/payment/verify`, {
//             method: "POST",
//             credentials: "include",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               amount: orderData.amount * 100,  
//             }),
//           });
  
//           const verifyData = await res.json();
//           if (verifyData.message) {
//             alert(verifyData.message);
//             // Save booking if payment is successful
//             bookRoom({ ...verifyData, paymentIntentId: response.razorpay_payment_id });
//           }
//         } catch (error) {
//           console.error("Error verifying payment:", error);
//         }
//       },
//       theme: {
//         color: "#5f63b8",
//       },
//     };
  
//     const razorpay = new window.Razorpay(options);
//     razorpay.open();
//   };
  

//   return (
//     <form
//       onSubmit={handleSubmit(handlePayment)}
//       className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5 mx-5"
//     >
//       <span className="text-3xl font-bold">Confirm Your Details</span>
//       <div className="grid grid-cols-2 gap-6">
//         <label className="text-gray-700 text-sm font-bold flex-1">
//           First Name
//           <input
//             className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
//             type="text"
//             readOnly
//             disabled
//             {...register("firstName")}
//           />
//         </label>
//         <label className="text-gray-700 text-sm font-bold flex-1">
//           Last Name
//           <input
//             className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
//             type="text"
//             readOnly
//             disabled
//             {...register("lastName")}
//           />
//         </label>
//         <label className="text-gray-700 text-sm font-bold flex-1">
//           Email
//           <input
//             className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
//             type="text"
//             readOnly
//             disabled
//             {...register("email")}
//           />
//         </label>
//       </div>

//       <div className="space-y-2">
//         <h2 className="text-xl font-semibold">Your Price Summary</h2>
//         <div className="bg-blue-200 p-4 rounded-md">
//           <div className="font-semibold text-lg">
//             Total Cost: £{pricepernight * search.roomCount}
//           </div>
//           <div className="text-xs">Includes taxes and charges</div>
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <button
//           disabled={isLoading}
//           onClick={handlePayment}
//           className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500 ml-2"
//         >
//           Confirm Booking
//         </button>
//       </div>
//     </form>
//   );
// };

// export default BookingForm;


import { useForm } from "react-hook-form";
import {  UserType } from "../../../../backend/src/shared/types";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

const RAZORPAY_KEY_ID = import.meta.env.VITE_API_RAZORPAY_KEY_ID;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

type Props = {
  currentUser: UserType;
  pricepernight: number;
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

// const BookingForm = ({ currentUser, pricepernight }: Props) => {
//   const search = useSearchContext();
//   const { hotelId } = useParams();
//   const { showToast } = useAppContext();

//   const calculateDays = (checkIn: Date, checkOut: Date) => {
//     const checkInDate = new Date(checkIn);
//     const checkOutDate = new Date(checkOut);
//     return Math.max(1, (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
//   };

//   const totalDays = calculateDays(search.checkIn, search.checkOut);
//   const totalCost = pricepernight  * (search.roomCount) * totalDays;

//   const { mutate: bookRoom, isLoading } = useMutation(apiClient.createRoomBooking, {
//     onSuccess: () => {
//       showToast({ message: "Booking Saved!", type: "SUCCESS" });
//     },
//     onError: () => {
//       showToast({ message: "Error saving booking", type: "ERROR" });
//     },
//   });

//   const { handleSubmit, register } = useForm<BookingFormData>({
//     defaultValues: {
//       firstName: currentUser.firstName,
//       lastName: currentUser.lastName,
//       email: currentUser.email,
//       roomCount: search.roomCount,
//       checkIn: search.checkIn.toISOString(),
//       checkOut: search.checkOut.toISOString(),
//       hotelId: hotelId,
//       totalCost,
//     },
//   });

//   const handlePayment = async () => {
//     try {
//       const bookingData = {
//         firstName: currentUser.firstName,
//         lastName: currentUser.lastName,
//         email: currentUser.email,
//         roomCount: search.roomCount,
//         checkIn: search.checkIn.toISOString(),
//         checkOut: search.checkOut.toISOString(),
//         hotelId: hotelId,
//         totalCost,
//       };

//       const res = await fetch(`http://localhost:7000/api/my-bookings/booking`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(bookingData),
//       });

//       const bookingResponse = await res.json();

//       if (!bookingResponse.success) {
//         throw new Error("Error creating booking");
//       }

//       const { bookingId } = bookingResponse.data;

//       const paymentRes = await fetch(`http://localhost:7000/api/payment/order`, {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ amount: totalCost }),
//       });

//       const paymentData = await paymentRes.json();
//       handlePaymentVerify(paymentData.data);
//     } catch (error) {
//       console.error("Error initiating payment:", error);
//     }
//   };

//   const handlePaymentVerify = (orderData: any) => {
//     const options = {
//       key: RAZORPAY_KEY_ID,
//       amount: orderData.amount * 100,
//       currency: orderData.currency,
//       name: "Paradise View Hotel",
//       description: "Complete your booking",
//       order_id: orderData.id,
//       handler: async (response: any) => {
//         try {
//           const res = await fetch(`http://localhost:7000/api/payment/verify`, {
//             method: "POST",
//             credentials: "include",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//               amount: orderData.amount * 100,
//             }),
//           });

//           const verifyData = await res.json();
//           if (verifyData.message) {
//             alert(verifyData.message);
//             bookRoom({ ...verifyData, paymentIntentId: response.razorpay_payment_id });
//           }
//         } catch (error) {
//           console.error("Error verifying payment:", error);
//         }
//       },
//       theme: {
//         color: "#5f63b8",
//       },
//     };

//     const razorpay = new window.Razorpay(options);
//     razorpay.open();
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(handlePayment)}
//       className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5 mx-5"
//     >
//       <span className="text-3xl font-bold">Confirm Your Details</span>
//       <div className="grid grid-cols-2 gap-6">
//         <label className="text-gray-700 text-sm font-bold flex-1">
//           First Name
//           <input
//             className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
//             type="text"
//             readOnly
//             disabled
//             {...register("firstName")}
//           />
//         </label>
//         <label className="text-gray-700 text-sm font-bold flex-1">
//           Last Name
//           <input
//             className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
//             type="text"
//             readOnly
//             disabled
//             {...register("lastName")}
//           />
//         </label>
//         <label className="text-gray-700 text-sm font-bold flex-1">
//           Email
//           <input
//             className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
//             type="text"
//             readOnly
//             disabled
//             {...register("email")}
//           />
//         </label>
//       </div>

//       <div className="space-y-2">
//         <h2 className="text-xl font-semibold">Your Price Summary</h2>
//         <div className="bg-blue-200 p-4 rounded-md">
//           <div className="font-semibold text-lg">
//             Total Cost: £{totalCost}
//           </div>
//           <div className="text-xs">Includes taxes and charges</div>
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <button
//           disabled={isLoading}
//           onClick={handlePayment}
//           className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500 ml-2"
//         >
//           Confirm Booking
//         </button>
//       </div>
//     </form>
//   );
// };

// export default BookingForm;




const BookingForm = ({ currentUser, pricepernight }: Props) => {
  const search = useSearchContext();
  const { hotelId } = useParams();
  const { showToast } = useAppContext();

  // Helper function to calculate number of days between check-in and check-out
  const calculateDays = (checkIn: Date, checkOut: Date) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return Math.max(1, (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const totalDays = calculateDays(search.checkIn, search.checkOut);
  const totalCost = pricepernight * search.roomCount * totalDays;

  const { mutate: bookRoom, isLoading } = useMutation(apiClient.createRoomBooking, {
    onSuccess: () => {
      showToast({ message: "Booking Saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error saving booking", type: "ERROR" });
    },
  });

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

  const handlePayment = async () => {
    try {
      const bookingData = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        roomCount: search.roomCount,
        checkIn: formattedCheckIn, // Pass the formatted checkIn date here
        checkOut: formattedCheckOut, // Pass the formatted checkOut date here
        hotelId: hotelId,
        totalCost,
      };

      const res = await fetch(`${API_BASE_URL}/api/my-bookings/booking`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const bookingResponse = await res.json();

      if (!bookingResponse.success) {
        throw new Error("Error creating booking");
      }

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
      handlePaymentVerify(paymentData.data);
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  const handlePaymentVerify = (orderData: any) => {
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
            bookRoom({ ...verifyData, paymentIntentId: response.razorpay_payment_id });
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
            Total Cost: £{totalCost}
          </div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          onClick={handlePayment}
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md disabled:bg-gray-500 ml-2"
        >
          Confirm Booking
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
