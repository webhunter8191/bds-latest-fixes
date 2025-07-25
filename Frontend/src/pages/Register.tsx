import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import { SignInFormData } from "./SignIn";
import { useQueryClient } from "react-query";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
    onSuccess: async (_, variables) => {
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
      }).then(() => {
        const state = redirectState || location.state;
        navigate("/sign-in", { state });
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
    <div className="flex items-center justify-center min-h-screen px-2">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 sm:p-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#6A5631] mb-6">
          Create an Account
        </h2>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="flex flex-col md:flex-row gap-4">
            <label className="flex-1 text-sm text-[#6A5631]">
              First Name
              <input
                {...register("firstName", {
                  required: "This field is required",
                })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#6A5631]"
              />
              {errors.firstName && (
                <span className="text-red-500 text-xs">
                  {errors.firstName.message}
                </span>
              )}
            </label>
            <label className="flex-1 text-sm text-[#6A5631]">
              Last Name
              <input
                {...register("lastName", {
                  required: "This field is required",
                })}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#6A5631]"
              />
              {errors.lastName && (
                <span className="text-red-500 text-xs">
                  {errors.lastName.message}
                </span>
              )}
            </label>
          </div>
          <label className="text-sm text-[#6A5631]">
            Mobile No.
            <input
              {...register("mobNo", { required: "This field is required" })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#6A5631]"
            />
            {errors.mobNo && (
              <span className="text-red-500 text-xs">
                {errors.mobNo.message}
              </span>
            )}
          </label>
          <label className="text-sm text-[#6A5631]">
            Email
            <input
              type="email"
              {...register("email", { required: "This field is required" })}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#6A5631]"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </label>
          <label className="text-sm text-[#6A5631] w-full">
            Password
            <div className="flex items-center border border-gray-300 rounded-md focus-within:border-[#6A5631] bg-white mt-1">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "This field is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                className="flex-1 p-2 bg-transparent focus:outline-none rounded-md"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="ml-2 mr-3 text-lg text-gray-400 hover:text-[#6A5631] focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </label>
          <label className="text-sm text-[#6A5631] w-full">
            Confirm Password
            <div className="flex items-center border border-gray-300 rounded-md focus-within:border-[#6A5631] bg-white mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "This field is required",
                })}
                className="flex-1 p-2 bg-transparent focus:outline-none rounded-md"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="ml-2 mr-3 text-lg text-gray-400 hover:text-[#6A5631] focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </span>
            )}
          </label>
          <button
            type="submit"
            className="w-full py-3 bg-[#6A5631] hover:bg-[#9e8047] text-white font-semibold rounded-lg transition duration-300 text-lg shadow-md mt-2"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="font-semibold text-[#6A5631] hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>

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
        <div className="mb-4 mt-4 text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 text-center text-sm font-medium">
          OTP has been sent to{" "}
          <span className="font-semibold">{watch("email")}</span>
        </div>
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
    </div>
  );
};

export default Register;
