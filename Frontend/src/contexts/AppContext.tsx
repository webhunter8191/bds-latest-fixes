// import React, { useContext, useState } from "react";
// import Toast from "../components/Toast";
// import { useQuery } from "react-query";
// import * as apiClient from "../api-client";

// type ToastMessage = {
//   message: string;
//   type: "SUCCESS" | "ERROR";
// };

// type AppContext = {
//   showToast: (toastMessage: ToastMessage) => void;
//   isLoggedIn: boolean;
//   isAdmin: boolean;
//   isLoading: boolean;
// };

// const AppContext = React.createContext<AppContext | undefined>(undefined);

// export const AppContextProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
//   const { isError, data, isLoading } = useQuery(
//     "validateToken",
//     apiClient.validateToken,
//     {
//       retry: false,
//     }
//   );

//   return (
//     !isLoading && (
//       <AppContext.Provider
//         value={{
//           showToast: (toastMessage) => {
//             setToast(toastMessage);
//           },
//           isAdmin: data?.isAdmin ?? false,
//           isLoggedIn: !isError,
//           isLoading,
//         }}
//       >
//         {toast && (
//           <Toast
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast(undefined)}
//           />
//         )}
//         {children}
//       </AppContext.Provider>
//     )
//   );
// };

// export const useAppContext = () => {
//   const context = useContext(AppContext);
//   return context as AppContext;
// };

import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AuthState = {
  isLoggedIn: boolean;
  isAdmin: boolean;
};

type AppContextType = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  setAuthState: (state: AuthState) => void; // ✅ Added setAuthState
};

const AppContext = React.createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    isAdmin: false,
  });

  const { isLoading } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
    onSuccess: (data) => {
      setAuthState({ isLoggedIn: true, isAdmin: data.isAdmin });
    },
    onError: () => {
      setAuthState({ isLoggedIn: false, isAdmin: false });
    },
  });

  return (
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => setToast(toastMessage),
        isLoggedIn: authState.isLoggedIn,
        isAdmin: authState.isAdmin,
        isLoading,
        setAuthState, // ✅ Exposing setAuthState to update authentication state
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
