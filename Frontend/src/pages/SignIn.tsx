// import { useForm } from "react-hook-form";
// import { useMutation, useQueryClient } from "react-query";
// import * as apiClient from "../api-client";
// // import { useAppContext } from "../contexts/AppContext";
// import Swal from "sweetalert2";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// export type SignInFormData = {
//   email: string;
//   password: string;
// };

// const SignIn = () => {

//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const location = useLocation();

//   const {
//     register,
//     formState: { errors },
//     handleSubmit,
//   } = useForm<SignInFormData>();

//   const mutation = useMutation(apiClient.signIn, {
//     onSuccess: async () => {
//       Swal.fire({
//         title: "Success!",
//         text: "Sign in Successful!",
//         icon: "success",
//         confirmButtonText: "Okay",
//         confirmButtonColor:"#8B5DFF"
//       });
//       await queryClient.invalidateQueries("validateToken");
//       navigate(location.state?.from?.pathname || "/");
//     },
//     onError: (error: Error) => {
//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "Try Again",
//         confirmButtonColor: "#8B5DFF",
//       });
//     },
//   });

//   const onSubmit = handleSubmit((data) => {
//     mutation.mutate(data);
//   });

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         className="flex flex-col gap-5 p-8 bg-white rounded-lg shadow-lg w-full max-w-md transition duration-500 ease-in-out transform hover:scale-105"
//         onSubmit={onSubmit}
//       >
//         <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6 animate__animated animate__fadeInDown">
//           Welcome Back!
//         </h2>
//         <label className="text-gray-700 text-sm font-semibold">
//           Email
//           <input
//             type="email"
//             className="mt-1 border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter your email"
//             {...register("email", { required: "This field is required" })}
//           />
//           {errors.email && (
//             <span className="text-red-500 text-xs mt-1">
//               {errors.email.message}
//             </span>
//           )}
//         </label>
//         <label className="text-gray-700 text-sm font-semibold">
//           Password
//           <input
//             type="password"
//             className="mt-1 border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter your password"
//             {...register("password", {
//               required: "This field is required",
//               minLength: {
//                 value: 6,
//                 message: "Password must be at least 6 characters",
//               },
//             })}
//           />
//           {errors.password && (
//             <span className="text-red-500 text-xs mt-1">
//               {errors.password.message}
//             </span>
//           )}
//         </label>
//         <div className="flex items-center justify-between mt-4">
//           <span className="text-sm text-gray-600">
//             Not registered?{" "}
//             <Link
//               className="underline text-blue-600 hover:text-blue-800 transition duration-300"
//               to="/register"
//             >
//               Create an account here
//             </Link>
//           </span>
//         </div>
//         <button
//           type="submit"
//           className="w-full py-3 mt-6 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 text-lg shadow-md"
//         >
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignIn;

// import { useForm } from "react-hook-form";
// import { useMutation, useQueryClient } from "react-query";
// import * as apiClient from "../api-client";
// import Swal from "sweetalert2";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// export type SignInFormData = {
//   email: string;
//   password: string;
// };

// const SignIn = () => {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const location = useLocation();

//   const {
//     register,
//     formState: { errors },
//     handleSubmit,
//   } = useForm<SignInFormData>();

//   const mutation = useMutation(apiClient.signIn, {
//     onSuccess: async () => {
//       Swal.fire({
//         title: "Success!",
//         text: "Sign in Successful!",
//         icon: "success",
//         confirmButtonText: "Okay",
//         confirmButtonColor: "#8B5DFF",
//       });
//       await queryClient.invalidateQueries("validateToken");
//       navigate(location.state?.from?.pathname || "/");
//     },
//     onError: (error: Error) => {
//       Swal.fire({
//         title: "Error",
//         text: error.message,
//         icon: "error",
//         confirmButtonText: "Try Again",
//         confirmButtonColor: "#8B5DFF",
//       });
//     },
//   });

//   const onSubmit = handleSubmit((data) => {
//     mutation.mutate(data);
//   });

//   return (
//     <div className="flex items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-8">
//     <form
//       className="flex flex-col gap-6 p-8 bg-white rounded-lg shadow-lg w-full max-w-md transition duration-300 ease-in-out transform hover:scale-105"
//       onSubmit={onSubmit}
//     >
//       <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6">
//         Welcome Back!
//       </h2>

//       {/* Email Field */}
//       <label className="text-gray-700 text-sm font-semibold">
//         Email
//         <input
//           type="email"
//           className="mt-1 border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Enter your email"
//           {...register("email", { required: "This field is required" })}
//         />
//         {errors.email && (
//           <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
//         )}
//       </label>

//       {/* Password Field */}
//       <label className="text-gray-700 text-sm font-semibold">
//         Password
//         <input
//           type="password"
//           className="mt-1 border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Enter your password"
//           {...register("password", {
//             required: "This field is required",
//             minLength: {
//               value: 6,
//               message: "Password must be at least 6 characters",
//             },
//           })}
//         />
//         {errors.password && (
//           <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>
//         )}
//       </label>

//       {/* Link to Register */}
//       <div className="flex items-center justify-between mt-4">
//         <span className="text-sm text-gray-600">
//           Not registered?{" "}
//           <Link
//             className="underline text-blue-600 hover:text-blue-800 transition duration-300"
//             to="/register"
//           >
//             Create an account here
//           </Link>
//         </span>
//       </div>

//       {/* Submit Button */}
//       <button
//         type="submit"
//         className="w-full py-3 mt-6 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300 text-lg shadow-md"
//       >
//         Sign In
//       </button>
//     </form>
//   </div>
//   );
// };

// export default SignIn;
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
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
      navigate(location.state?.from?.pathname || "/");
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#f5f3eb] to-white px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 sm:p-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
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
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 bg-brand hover:bg-[#9e8047] text-white font-semibold rounded-lg transition duration-300"
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
              className="font-semibold text-brand hover:underline"
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
