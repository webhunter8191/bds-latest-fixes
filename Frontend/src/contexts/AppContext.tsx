import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
  const { data, isLoading } = useQuery(
    "validateToken",
    apiClient.validateToken,
    {
      retry: false,
    }
  );

  return (
    !isLoading && (
      <AppContext.Provider
        value={{
          showToast: (toastMessage) => {
            setToast(toastMessage);
          },
          isAdmin: data?.isAdmin ?? false,
          isLoggedIn: data?.userId,
          isLoading,
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
