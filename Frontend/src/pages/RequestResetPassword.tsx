import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { requestPasswordReset } from "../api-client";

const RequestResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    try {
      await requestPasswordReset(data.email);
      Swal.fire({
        title: "Success!",
        text: "Password reset email sent!",
        icon: "success",
        confirmButtonText: "Okay",
        confirmButtonColor: "#8B5DFF",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: (error as any).message,
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#8B5DFF",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="flex flex-col gap-5 p-8 bg-white rounded-lg shadow-lg w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          Reset Password
        </h2>
        <label className="text-gray-700 text-sm font-semibold">
          Email
          <input
            type="email"
            className="mt-1 border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            {...register("email", { required: "This field is required" })}
          />
          {errors.email && (
            <span className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </span>
          )}
        </label>
        <button
          type="submit"
          className="w-full py-3 mt-6 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 text-lg shadow-md"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default RequestResetPassword;
