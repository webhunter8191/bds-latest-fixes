// import { useMutation } from "react-query";
// import * as apiClient from "../api-client";
// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import {
//   AiOutlineEye,
//   AiOutlineEyeInvisible,
//   AiOutlineClose,
// } from "react-icons/ai";
// import Swal from "sweetalert2";
// import Modal from "react-modal";
// import { useForm } from "react-hook-form";

// export type RegisterFormData = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   mobNo: string;
// };

// const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

// const Register = () => {
//   const navigate = useNavigate();

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [timer, setTimer] = useState(300);
//   const [showResendButton, setShowResendButton] = useState(true);

//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     register,
//     watch,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<RegisterFormData>();

//   // const mutation = useMutation(apiClient.register, {
//   //   onSuccess: () => {
//   //     Swal.fire({
//   //       title: "Success!",
//   //       text: "Your account has been created successfully.",
//   //       icon: "success",
//   //       confirmButtonText: "OK",
//   //       confirmButtonColor: "#8B5DFF",
//   //     }).then(() => navigate("/sign-in"));
//   //   },
//   //   onError: (error: Error) => {
//   //     Swal.fire({
//   //       title: "Error!",
//   //       text: error.message,
//   //       icon: "error",
//   //       confirmButtonText: "OK",
//   //       confirmButtonColor: "#8B5DFF",
//   //     });
//   //   },
//   // });
//   const mutation = useMutation(apiClient.register, {
//     onSuccess: () => {
//       Swal.fire({
//         title: "Success!",
//         text: "Your account has been created successfully.",
//         icon: "success",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#8B5DFF",
//       }).then(() => navigate("/sign-in"));
//     },
//     onError: (error: Error) => {
//       Swal.fire({
//         title: "Error!",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#8B5DFF",
//       });
//     },
//   });

//   const handleResendOtp = async () => {
//     setIsLoading(true);
//     try {
//       setOtp("");
//       setTimer(300);
//       setShowResendButton(false);
//       await fetch(`${baseUrl}/api/otp/send`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ email: watch("email") }),
//       });
//       Swal.fire("OTP Sent!", "Check your email.", "info").then(() => {
//         setTimeout(() => {
//           Swal.close();
//         }, 3000);
//       });
//       setTimeout(() => setShowResendButton(true), 10000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // const handleOtpValidation = async (data: any, otp: string) => {
//   //   try {
//   //     const response = await fetch(`${baseUrl}/api/otp/verify`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       credentials: "include",
//   //       body: JSON.stringify({ otp, email: data?.email }),
//   //     });

//   //     const result = await response.json();

//   //     if (response.ok && result.message === "OTP verified successfully") {
//   //       mutation.mutate(data); // Proceed with account creation
//   //     } else {
//   //       Swal.fire({
//   //         title: "Invalid OTP",
//   //         text: "Please enter the correct OTP.",
//   //         icon: "error",
//   //         confirmButtonText: "OK",
//   //         confirmButtonColor: "#8B5DFF",
//   //       });
//   //     }
//   //   } catch (error) {
//   //     console.error("Error in handleOtpValidation:", error);
//   //     Swal.fire({
//   //       title: "Error",
//   //       text: "An error occurred while validating the OTP. Please try again.",
//   //       icon: "error",
//   //       confirmButtonText: "OK",
//   //       confirmButtonColor: "#8B5DFF",
//   //     });
//   //   }
//   // };
//   const handleOtpValidation = async (data: RegisterFormData, otp: string) => {
//     try {
//       const response = await fetch(`${baseUrl}/api/otp/verify`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ otp, email: data.email }),
//       });

//       const result = await response.json();

//       if (response.ok && result.message === "OTP verified successfully") {
//         mutation.mutate(data); // Proceed with actual registration
//         setIsOtpModalOpen(false);
//       } else {
//         Swal.fire({
//           title: "Invalid OTP",
//           text: "Please enter the correct OTP.",
//           icon: "error",
//           confirmButtonText: "OK",
//           confirmButtonColor: "#8B5DFF",
//         });
//       }
//     } catch (error) {
//       console.error("Error in handleOtpValidation:", error);
//       Swal.fire({
//         title: "Error",
//         text: "An error occurred while validating the OTP. Please try again.",
//         icon: "error",
//         confirmButtonText: "OK",
//         confirmButtonColor: "#8B5DFF",
//       });
//     }
//   };

//   useEffect(() => {
//     if (isOtpModalOpen) {
//       document.body.style.overflow = "hidden";
//       const interval = setInterval(() => {
//         setTimer((prev) => (prev > 0 ? prev - 1 : 0));
//       }, 1000);
//       return () => {
//         clearInterval(interval);
//         document.body.style.overflow = "auto";
//       };
//     }
//   }, [isOtpModalOpen]);

//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
//   };

//   // const sendOtp = async ({ email }: { email: any }) => {
//   //   try {
//   //     const response = await fetch(`${baseUrl}/api/otp/send`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       credentials: "include",
//   //       body: JSON.stringify({ email }),
//   //     });
//   //     Swal.fire({
//   //       icon: "info",
//   //       title: "OTP Sent!",
//   //       text: "We've sent a verification code to your email.",
//   //       confirmButtonColor: "#8B5DFF",
//   //     });
//   //     const data = await response.json();
//   //     return data;
//   //   } catch (error) {
//   //     console.log("Error in sending otp", error);
//   //   }
//   // };
//   const sendOtp = async ({ email }: { email: any }) => {
//     try {
//       const response = await fetch(`${baseUrl}/api/otp/send`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to send OTP");
//       }

//       return data;
//     } catch (error: any) {
//       throw new Error(
//         error.message || "Something went wrong while sending OTP"
//       );
//     }
//   };

//   // const onSubmit = handleSubmit(async (data, event) => {
//   //   event?.preventDefault();
//   //   event?.stopPropagation();
//   //   setIsLoading(true);
//   //   try {
//   //     await sendOtp(data);
//   //     setIsOtpModalOpen(true);
//   //   } catch (error) {
//   //     setIsOtpModalOpen(false);
//   //     console.log("Error in registering user");
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // });
//   const onSubmit = handleSubmit(async (data, event) => {
//     event?.preventDefault();
//     event?.stopPropagation();
//     setIsLoading(true);

//     try {
//       await sendOtp(data);
//       setIsOtpModalOpen(true);
//     } catch (error: any) {
//       setIsOtpModalOpen(false);
//       Swal.fire({
//         title: "User already exists",
//         text: "Please sign in instead.",
//         icon: "error",
//         confirmButtonText: "Go to Sign In",
//         confirmButtonColor: "#8B5DFF",
//       }).then(() => {
//         navigate("/sign-in");
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   });

//   return (
//     <>
//       <form
//         className="flex flex-col gap-6 bg-white rounded-lg p-8 shadow-lg max-w-md mx-auto mt-10 transform transition-transform duration-300 hover:scale-105"
//         onSubmit={onSubmit}
//       >
//         <h2 className="text-3xl font-bold text-center text-gray-800">
//           Create an Account
//         </h2>

//         <div className="flex flex-col md:flex-row gap-6">
//           <label className="flex-1 text-gray-700 text-sm font-semibold">
//             First Name
//             <input
//               className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
//               {...register("firstName", { required: "This field is required" })}
//             />
//             {errors.firstName && (
//               <span className="text-red-500 text-sm">
//                 {errors.firstName.message}
//               </span>
//             )}
//           </label>

//           <label className="flex-1 text-gray-700 text-sm font-semibold">
//             Last Name
//             <input
//               className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
//               {...register("lastName", { required: "This field is required" })}
//             />
//             {errors.lastName && (
//               <span className="text-red-500 text-sm">
//                 {errors.lastName.message}
//               </span>
//             )}
//           </label>
//         </div>
//         <label className="flex-1 text-gray-700 text-sm font-semibold">
//           mobile no.
//           <input
//             className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
//             {...register("mobNo", { required: "This field is required" })}
//           />
//         </label>
//         <label className="text-gray-700 text-sm font-semibold">
//           Email
//           <input
//             type="email"
//             className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
//             {...register("email", { required: "This field is required" })}
//           />
//           {errors.email && (
//             <span className="text-red-500 text-sm">{errors.email.message}</span>
//           )}
//         </label>

//         <label className="text-gray-700 text-sm font-semibold">
//           Password
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
//               {...register("password", {
//                 required: "This field is required",
//                 minLength: {
//                   value: 6,
//                   message: "Password must be at least 6 characters",
//                 },
//               })}
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
//             >
//               {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
//             </span>
//           </div>
//           {errors.password && (
//             <span className="text-red-500 text-sm">
//               {errors.password.message}
//             </span>
//           )}
//         </label>

//         <label className="text-gray-700 text-sm font-semibold">
//           Confirm Password
//           <div className="relative">
//             <input
//               type={showConfirmPassword ? "text" : "password"}
//               className="border border-gray-300 rounded-md w-full py-2 px-3 mt-1 font-normal transition-colors focus:outline-none focus:border-blue-500"
//               {...register("confirmPassword", {
//                 validate: (val) => {
//                   if (!val) return "This field is required";
//                   if (watch("password") !== val)
//                     return "Your passwords do not match";
//                 },
//               })}
//             />
//             <span
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
//             >
//               {showConfirmPassword ? (
//                 <AiOutlineEyeInvisible />
//               ) : (
//                 <AiOutlineEye />
//               )}
//             </span>
//           </div>
//           {errors.confirmPassword && (
//             <span className="text-red-500 text-sm">
//               {errors.confirmPassword.message}
//             </span>
//           )}
//         </label>

//         <button
//           type="submit"
//           className="bg-blue-600 text-white py-2 px-4 rounded-md font-semibold text-lg hover:bg-blue-500 transition-colors"
//           disabled={isLoading}
//         >
//           {isLoading ? "Loading..." : "Create Account"}
//         </button>
//       </form>

//       <Modal
//         isOpen={isOtpModalOpen}
//         onRequestClose={() => {}}
//         shouldCloseOnOverlayClick={false}
//         shouldCloseOnEsc={false}
//         className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative"
//         overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
//       >
//         <button
//           onClick={() => setIsOtpModalOpen(false)}
//           className="absolute top-4 right-4 text-2xl text-gray-600"
//         >
//           <AiOutlineClose />
//         </button>
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
//           Enter OTP
//         </h2>
//         <p className="text-gray-600 mb-6 text-center">
//           Time Remaining: {formatTime(timer)}
//         </p>
//         <input
//           type="text"
//           maxLength={6}
//           value={otp}
//           onChange={(e) => setOtp(e.target.value)}
//           className="border border-gray-300 rounded-lg p-3 text-center text-lg w-full mb-6"
//           placeholder="Enter OTP"
//         />
//         <p className="text-sm text-gray-500 text-center mb-4">
//           Please check your email for the OTP code.
//         </p>
//         <div className="flex gap-6 justify-center">
//           <button
//             onClick={async () => {
//               const formData = watch();
//               await handleOtpValidation(formData, otp);
//               setIsOtpModalOpen(false);
//             }}
//             className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
//             disabled={isLoading}
//           >
//             {isLoading ? "Loading..." : "Validate OTP"}
//           </button>
//           {showResendButton && (
//             <button
//               onClick={handleResendOtp}
//               className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//               disabled={isLoading}
//             >
//               {isLoading ? "Loading..." : "Resend OTP"}
//             </button>
//           )}
//         </div>
//       </Modal>
//     </>
//   );
// };

// export default Register;
import { useMutation } from "react-query";
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

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);
  const [showResendButton, setShowResendButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Your account has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#6a5631",
      }).then(() => navigate("/sign-in"));
    },
    onError: (error: Error) => {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#6a5631",
      });
    },
  });

  const handleOtpValidation = async (data: RegisterFormData, otp: string) => {
    try {
      const response = await fetch(`${baseUrl}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp, email: data.email }),
      });

      const result = await response.json();

      if (response.ok && result.message === "OTP verified successfully") {
        mutation.mutate(data);
        setIsOtpModalOpen(false);
      } else {
        Swal.fire({
          title: "Invalid OTP",
          text: "Please enter the correct OTP.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#6a5631",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while validating the OTP. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#6a5631",
      });
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      setOtp("");
      setTimer(300);
      setShowResendButton(false);
      await fetch(`${baseUrl}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: watch("email") }),
      });
      Swal.fire("OTP Sent!", "Check your email.", "info");
      setTimeout(() => setShowResendButton(true), 10000);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async ({ email }: { email: any }) => {
    const response = await fetch(`${baseUrl}/api/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to send OTP");
    return data;
  };

  const onSubmit = handleSubmit(async (data, event) => {
    event?.preventDefault();
    event?.stopPropagation();
    setIsLoading(true);
    try {
      await sendOtp(data);
      setIsOtpModalOpen(true);
    } catch (error: any) {
      setIsOtpModalOpen(false);
      Swal.fire({
        title: "User already exists",
        text: "Please sign in instead.",
        icon: "error",
        confirmButtonText: "Go to Sign In",
        confirmButtonColor: "#6a5631",
      }).then(() => navigate("/sign-in"));
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (isOtpModalOpen) {
      document.body.style.overflow = "hidden";
      const interval = setInterval(
        () => setTimer((prev) => (prev > 0 ? prev - 1 : 0)),
        1000
      );
      return () => {
        clearInterval(interval);
        document.body.style.overflow = "auto";
      };
    }
  }, [isOtpModalOpen]);

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? "0" : ""}${
      seconds % 60
    }`;

  return (
    <>
      <form
        className="max-w-lg w-full mx-auto mt-10 bg-white p-6 md:p-10 rounded-lg shadow-xl flex flex-col gap-6"
        onSubmit={onSubmit}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#6a5631]">
          Create an Account
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex-1 text-sm text-[#6a5631]">
            First Name
            <input
              {...register("firstName", { required: "This field is required" })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#6a5631]"
            />
            {errors.firstName && (
              <span className="text-red-500 text-xs">
                {errors.firstName.message}
              </span>
            )}
          </label>
          <label className="flex-1 text-sm text-[#6a5631]">
            Last Name
            <input
              {...register("lastName", { required: "This field is required" })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#6a5631]"
            />
            {errors.lastName && (
              <span className="text-red-500 text-xs">
                {errors.lastName.message}
              </span>
            )}
          </label>
        </div>
        <label className="text-sm text-[#6a5631]">
          Mobile No.
          <input
            {...register("mobNo", { required: "This field is required" })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#6a5631]"
          />
        </label>
        <label className="text-sm text-[#6a5631]">
          Email
          <input
            type="email"
            {...register("email", { required: "This field is required" })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#6a5631]"
          />
          {errors.email && (
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          )}
        </label>
        <label className="text-sm text-[#6a5631]">
          Password
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "This field is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#6a5631]"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-lg cursor-pointer"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {errors.password && (
            <span className="text-red-500 text-xs">
              {errors.password.message}
            </span>
          )}
        </label>
        <label className="text-sm text-[#6a5631]">
          Confirm Password
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword", {
                validate: (val) => {
                  if (!val) return "This field is required";
                  if (watch("password") !== val)
                    return "Passwords do not match";
                },
              })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#6a5631]"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-lg cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </span>
          )}
        </label>
        <button
          type="submit"
          className="w-full bg-[#6a5631] text-white py-2 px-4 rounded-md font-medium hover:bg-[#5b4a2a] transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Create Account"}
        </button>
      </form>

      <Modal
        isOpen={isOtpModalOpen}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full relative"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      >
        <button
          onClick={() => setIsOtpModalOpen(false)}
          className="absolute top-4 right-4 text-xl text-gray-600"
        >
          <AiOutlineClose />
        </button>
        <h2 className="text-xl font-bold text-[#6a5631] mb-2 text-center">
          Enter OTP
        </h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          Time Remaining: {formatTime(timer)}
        </p>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md text-center text-lg mb-4"
          placeholder="Enter OTP"
        />
        <div className="flex justify-center gap-4">
          <button
            onClick={async () => await handleOtpValidation(watch(), otp)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            disabled={isLoading}
          >
            Validate OTP
          </button>
          {showResendButton && (
            <button
              onClick={handleResendOtp}
              className="bg-[#6a5631] text-white px-4 py-2 rounded-md hover:bg-[#5b4a2a]"
              disabled={isLoading}
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
