import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { UserType } from "../../../backend/src/shared/types";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  currentUser?: UserType;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const { data: tokenData, isLoading: tokenLoading } = useQuery(
    "validateToken",
    apiClient.validateToken,
    {
      retry: false,
    }
  );

  // Fetch current user data if user is logged in
  const { data: userData, isLoading: userLoading } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser,
    {
      enabled: !!tokenData?.userId,
      retry: false,
    }
  );

  const isLoading = tokenLoading || (tokenData?.userId && userLoading);

  return (
    !isLoading && (
      <AppContext.Provider
        value={{
          showToast: (toastMessage) => {
            setToast(toastMessage);
          },
          isAdmin: tokenData?.isAdmin ?? false,
          isLoggedIn: !!tokenData?.userId,
          isLoading,
          currentUser: userData,
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
    )
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
