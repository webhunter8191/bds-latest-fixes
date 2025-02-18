// import { useForm } from "react-hook-form";
// import { useMutation, useQueryClient } from "react-query";
// import * as apiClient from "../api-client";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react"; // Import useState
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // Import eye icons
// import Swal from "sweetalert2"; // Import SweetAlert2

// export type RegisterFormData = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   mobNo: string;
// };

// const Register = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   // State for showing/hiding passwords
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const {
//     register,
//     watch,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<RegisterFormData>();

//   const mutation = useMutation(apiClient.register, {
//     onSuccess: async () => {
//       // Use SweetAlert2 to show success message
//       Swal.fire({
//         title: "Registration Success!",
//         text: "You have successfully registered.",
//         icon: "success",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#8B5DFF",
//       });
//       await queryClient.invalidateQueries("validateToken");
//       navigate("/");
//     },
//     onError: (error: Error) => {
//       // Use SweetAlert2 to show error message
//       Swal.fire({
//         title: "Error!",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#8B5DFF",
//       });
//     },
//   });

//   const onSubmit = handleSubmit((data) => {
//     mutation.mutate(data);
//   });

//   return (
//     <form
//       className="flex flex-col gap-6 bg-white rounded-lg p-8 shadow-lg max-w-md mx-auto mt-10 transform transition-transform duration-300 hover:scale-105"
//       onSubmit={onSubmit}
//     >
//       <h2 className="text-3xl font-bold text-center text-gray-800">
//         Create an Account
//       </h2>

//       <div className="flex flex-col md:flex-row gap-6">
//         <label className="flex-1 text-gray-700 text-sm font-semibold">
//           First Name
//           <input
//             className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
//             {...register("firstName", { required: "This field is required" })}
//           />
//           {errors.firstName && (
//             <span className="text-red-500 text-sm">
//               {errors.firstName.message}
//             </span>
//           )}
//         </label>

//         <label className="flex-1 text-gray-700 text-sm font-semibold">
//           Last Name
//           <input
//             className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
//             {...register("lastName", { required: "This field is required" })}
//           />
//           {errors.lastName && (
//             <span className="text-red-500 text-sm">
//               {errors.lastName.message}
//             </span>
//           )}
//         </label>
//       </div>
//       <label className="flex-1 text-gray-700 text-sm font-semibold">
//         mobile no.
//         <input
//           className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
//           {...register("mobNo", { required: "This field is required" })}
//         />
//       </label>
//       <label className="text-gray-700 text-sm font-semibold">
//         Email
//         <input
//           type="email"
//           className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
//           {...register("email", { required: "This field is required" })}
//         />
//         {errors.email && (
//           <span className="text-red-500 text-sm">{errors.email.message}</span>
//         )}
//       </label>

//       <label className="text-gray-700 text-sm font-semibold">
//         Password
//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"} // Toggle between text and password
//             className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
//             {...register("password", {
//               required: "This field is required",
//               minLength: {
//                 value: 6,
//                 message: "Password must be at least 6 characters",
//               },
//             })}
//           />
//           <span
//             onClick={() => setShowPassword(!showPassword)} // Toggle the visibility
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
//           >
//             {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
//           </span>
//         </div>
//         {errors.password && (
//           <span className="text-red-500 text-sm">
//             {errors.password.message}
//           </span>
//         )}
//       </label>

//       <label className="text-gray-700 text-sm font-semibold">
//         Confirm Password
//         <div className="relative">
//           <input
//             type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
//             className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
//             {...register("confirmPassword", {
//               validate: (val) => {
//                 if (!val) return "This field is required";
//                 if (watch("password") !== val)
//                   return "Your passwords do not match";
//               },
//             })}
//           />
//           <span
//             onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle the visibility
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
//           >
//             {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
//           </span>
//         </div>
//         {errors.confirmPassword && (
//           <span className="text-red-500 text-sm">
//             {errors.confirmPassword.message}
//           </span>
//         )}
//       </label>

//       <button
//         type="submit"
//         className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold text-lg hover:bg-blue-500 transition-colors"
//       >
//         Create Account
//       </button>
//     </form>
//   );
// };

// export default Register;

import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineClose,
} from "react-icons/ai";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { useForm } from "react-hook-form";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobNo: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);
  const [showResendButton, setShowResendButton] = useState(true);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: () => {
      Swal.fire({
        title: "Registration Success!",
        text: "Please verify OTP sent to your email.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#8B5DFF",
      });
      setIsOtpModalOpen(true);
    },
    onError: (error: Error) => {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#8B5DFF",
      });
    },
  });

  const handleOtpValidation = () => {
    Swal.fire("OTP Validated Successfully!", "", "success");
    setIsOtpModalOpen(false);
    navigate("/");
  };

  const handleResendOtp = () => {
    setOtp("");
    setTimer(300);
    setShowResendButton(false); // Hide the resend button immediately
    Swal.fire("New OTP Sent!", "Check your email.", "info").then(() => {
      setTimeout(() => {
        Swal.close(); // Automatically close the dialog after 5 seconds
      }, 3000); // 5 seconds delay
    });
    setTimeout(() => setShowResendButton(true), 10000); // Show the resend button again after 10 seconds
  };

  useEffect(() => {
    if (isOtpModalOpen) {
      document.body.style.overflow = "hidden"; // Disable body scroll
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => {
        clearInterval(interval);
        document.body.style.overflow = "auto"; // Re-enable body scroll when modal is closed
      };
    }
  }, [isOtpModalOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <>
      <form
        className="flex flex-col gap-6 bg-white rounded-lg p-8 shadow-lg max-w-md mx-auto mt-10 transform transition-transform duration-300 hover:scale-105"
        onSubmit={onSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Create an Account
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <label className="flex-1 text-gray-700 text-sm font-semibold">
            First Name
            <input
              className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
              {...register("firstName", { required: "This field is required" })}
            />
            {errors.firstName && (
              <span className="text-red-500 text-sm">
                {errors.firstName.message}
              </span>
            )}
          </label>

          <label className="flex-1 text-gray-700 text-sm font-semibold">
            Last Name
            <input
              className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
              {...register("lastName", { required: "This field is required" })}
            />
            {errors.lastName && (
              <span className="text-red-500 text-sm">
                {errors.lastName.message}
              </span>
            )}
          </label>
        </div>
        <label className="flex-1 text-gray-700 text-sm font-semibold">
          mobile no.
          <input
            className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
            {...register("mobNo", { required: "This field is required" })}
          />
        </label>
        <label className="text-gray-700 text-sm font-semibold">
          Email
          <input
            type="email"
            className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
            {...register("email", { required: "This field is required" })}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </label>

        <label className="text-gray-700 text-sm font-semibold">
          Password
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <span
              onClick={() => setShowPassword(!showPassword)} // Toggle the visibility
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </label>

        <label className="text-gray-700 text-sm font-semibold">
          Confirm Password
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"} // Toggle between text and password
              className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
              {...register("confirmPassword", {
                validate: (val) => {
                  if (!val) return "This field is required";
                  if (watch("password") !== val)
                    return "Your passwords do not match";
                },
              })}
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle the visibility
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold text-lg hover:bg-blue-500 transition-colors"
        >
          Create Account
        </button>
      </form>

      {/* OTP Modal */}
      <Modal
        isOpen={isOtpModalOpen}
        onRequestClose={() => {}}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <button
          onClick={() => setIsOtpModalOpen(false)}
          className="absolute top-4 right-4 text-2xl text-gray-600"
        >
          <AiOutlineClose />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Enter OTP
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Time Remaining: {formatTime(timer)}
        </p>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border border-gray-300 rounded-lg p-3 text-center text-lg w-full mb-6"
          placeholder="Enter OTP"
        />
        <div className="flex gap-6 justify-center">
          <button
            onClick={handleOtpValidation}
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Validate OTP
          </button>
          {showResendButton && (
            <button
              onClick={handleResendOtp}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Resend OTP
            </button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Register;
