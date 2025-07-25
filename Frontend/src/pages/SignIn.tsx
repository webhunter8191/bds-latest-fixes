import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = ({ redirectState }: { redirectState?: any }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      Swal.fire({
        title: "Success!",
        text: "Sign in successful!",
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#8B5DFF",
      });
      await queryClient.invalidateQueries("validateToken");
      const state = redirectState || location.state;
      if (state && state.hotelId) {
        navigate(`/hotel/${state.hotelId}/booking`, { state });
      } else {
        navigate("/");
      }
    },
    onError: (error: Error) => {
      Swal.fire({
        title: "Login Failed",
        text: error.message,
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#8B5DFF",
      });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen px-2">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 sm:p-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#6A5631] mb-6">
          Welcome Back{" "}
          <span role="img" aria-label="wave">
            👋
          </span>
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6A5631]"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#6A5631] bg-white">
              <input
                type={showPassword ? "text" : "password"}
                className="flex-1 px-4 py-3 bg-transparent focus:outline-none rounded-lg"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
              />
              <button
                type="button"
                className="ml-2 mr-4 text-lg text-gray-400 hover:text-[#6A5631] focus:outline-none"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#6A5631] hover:bg-[#9e8047] text-white font-semibold rounded-lg transition duration-300 text-lg shadow-md"
          >
            Sign In
          </button>
        </form>

        {/* Divider and Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Not registered yet?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#6A5631] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
