import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineClose,
} from "react-icons/ai";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { SignInFormData } from "./SignIn";
import { useQueryClient } from "react-query";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobNo: string;
};

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

const Register = ({ redirectState }: { redirectState?: any }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

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
    onSuccess: async (data, variables) => {
      // Automatically sign in after registration
      const signInData: SignInFormData = {
        email: variables.email,
        password: variables.password,
      };
      try {
        await apiClient.signIn(signInData);
        await queryClient.invalidateQueries("validateToken");
        Swal.fire({
          title: "Success!",
          text: "Your account has been created and you are now signed in.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#6a5631",
        }).then(() => {
          const state = redirectState || location.state;
          if (state && state.hotelId) {
            navigate(`/hotel/${state.hotelId}/booking`, { state });
          } else {
            navigate("/");
          }
        });
      } catch (err) {
        Swal.fire({
          title: "Account created, but sign in failed.",
          text: "Please sign in manually.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#6a5631",
        }).then(() => navigate("/sign-in"));
      }
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
        body: JSON.stringify({ otp, phoneNumber: data.mobNo }),
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
        body: JSON.stringify({ phoneNumber: watch("mobNo") }),
      });
      Swal.fire("OTP Sent!", "Check your WhatsApp messages.", "info");
      setTimeout(() => setShowResendButton(true), 10000);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (data: any) => {
    console.log("Sending OTP to phone number:", data.mobNo);
    const response = await fetch(`${baseUrl}/api/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ phoneNumber: data.mobNo }),
    });
    const responseData = await response.json();
    console.log("OTP API response:", responseData);
    if (!response.ok) throw new Error(responseData.message || "Failed to send OTP");
    return responseData;
  };

  const onSubmit = handleSubmit(async (data, event) => {
    event?.preventDefault();
    event?.stopPropagation();
    setIsLoading(true);
    try {
      console.log("Form data for OTP:", data);
      await sendOtp(data);
      setIsOtpModalOpen(true);
    } catch (error: any) {
      setIsOtpModalOpen(false);
      console.error("Error sending OTP:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to send OTP. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#6a5631",
      });
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
          Enter WhatsApp OTP
        </h2>
        <p className="text-center text-sm text-gray-600 mb-2">
          We've sent an OTP to your WhatsApp number: {watch("mobNo")}
        </p>
        <p className="text-center text-xs text-gray-500 mb-2">
          (For testing, check the server console for the OTP)
        </p>
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
