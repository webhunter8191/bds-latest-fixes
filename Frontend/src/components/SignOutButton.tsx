// import { useMutation, useQueryClient } from "react-query";
// import * as apiClient from "../api-client";
// import Swal from "sweetalert2"; // Import SweetAlert2
// // import { useAppContext } from "../contexts/AppContext";

// const SignOutButton = () => {
//   const queryClient = useQueryClient();
//   // Remove showToast, SweetAlert is now used

//   const mutation = useMutation(apiClient.signOut, {
//     onSuccess: async () => {
//       await queryClient.invalidateQueries("validateToken");

//       // Use SweetAlert for success message
//       Swal.fire({
//         icon: "success",
//         title: "Signed Out!",
//         text: "You have successfully signed out.",
//         confirmButtonColor: "#8B5DFF",
//       });
//     },
//     onError: (error: Error) => {
//       // Use SweetAlert for error message
//       Swal.fire({
//         icon: "error",
//         title: "Error!",
//         text: error.message,
//         confirmButtonColor: "#8B5DFF",
//       });
//     },
//   });

//   const handleClick = () => {
//     mutation.mutate();
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="flex items-center bg-[#6A5631]  text-white px-4 py-2 rounded-lg hover:bg-[#372D4A] transition duration-300"
//     >
//       Sign Out
//     </button>
//   );
// };

// export default SignOutButton;

import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import Swal from "sweetalert2";

const SignOutButton = () => {
  const queryClient = useQueryClient();
  const { setAuthState } = useAppContext(); // ✅ Get setAuthState from context

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      setAuthState({ isLoggedIn: false, isAdmin: false }); // ✅ Reset auth state
      queryClient.removeQueries("validateToken"); // ✅ Immediately clear cache

      Swal.fire({
        icon: "success",
        title: "Signed Out!",
        text: "You have successfully signed out.",
        confirmButtonColor: "#8B5DFF",
      });
    },
    onError: (error: Error) => {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message,
        confirmButtonColor: "#8B5DFF",
      });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      className="flex items-center bg-[#6A5631] text-white px-4 py-2 rounded-lg hover:bg-[#372D4A] transition duration-300"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
