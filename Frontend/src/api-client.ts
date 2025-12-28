import { RegisterFormData } from "./pages/Register";
// import { RegisterWhatsAppFormData } from "./pages/RegisterWhatsApp";
import { SignInFormData } from "./pages/SignIn";
import {
  HotelType,
  PaymentIntentResponse,
  
  UserType,
} from "../../backend/src/shared/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";
import { tokenService } from "./utils/token";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Helper function to get headers with Authorization token
const getAuthHeaders = (includeContentType: boolean = true): HeadersInit => {
  const headers: HeadersInit = {};
  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }
  const token = tokenService.getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchCurrentUser = async (): Promise<UserType> => {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: getAuthHeaders(false),
  });
  if (!response.ok) {
    throw new Error("Error fetching user");
  }
  return response.json();
};

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  // Store token if provided
  if (responseBody.token) {
    tokenService.setToken(responseBody.token);
  }
};

// export const registerPhone = async (formData: RegisterWhatsAppFormData) => {
//   const response = await fetch(`${API_BASE_URL}/api/auth/register-phone`, {
//     method: "POST",
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(formData),
//   });

//   const responseBody = await response.json();

//   if (!response.ok) {
//     throw new Error(responseBody.message);
//   }
// };

export const signIn = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }

  // Store token if provided
  if (body.token) {
    tokenService.setToken(body.token);
  }

  return body;
};


export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
    headers: getAuthHeaders(false),
  });
  const data = await response.json();
  if (data?.message) {
    return null;
  }
  return data;
};

export const signOut = async () => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Error during sign out");
  }

  // Remove token from storage
  tokenService.removeToken();
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const token = tokenService.getToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    headers,
    body: hotelFormData,
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }

  return response.json();
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
  const token = tokenService.getToken();
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
    {
      method: "PUT",
      headers,
      body: hotelFormData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Server error response:", errorData);
    throw new Error(`Failed to update Hotel: ${errorData.message || response.statusText}`);
  }

  return response.json();
};

export type SearchParams = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  roomCount: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchHotels = async (searchParams: {
  destination: string;
  checkIn: string;
  checkOut: string;
  roomCount: string;
  page?: string;
  stars?: string[];
  types?: string[];
  facilities?: string[];
  temples?: string[];
  maxPrice?: string;
  sortOption?: string;
}) => {
  // Create query string from search params
  const queryParams = new URLSearchParams();
  queryParams.append("destination", searchParams.destination);
  queryParams.append("checkIn", searchParams.checkIn);
  queryParams.append("checkOut", searchParams.checkOut);
  queryParams.append("roomCount", searchParams.roomCount);

  // Add optional parameters if they exist
  if (searchParams.page) {
    queryParams.append("page", searchParams.page);
  }

  if (searchParams.stars && searchParams.stars.length > 0) {
    searchParams.stars.forEach((star) => queryParams.append("stars", star));
  }

  if (searchParams.types && searchParams.types.length > 0) {
    searchParams.types.forEach((type) => queryParams.append("types", type));
  }

  if (searchParams.facilities && searchParams.facilities.length > 0) {
    searchParams.facilities.forEach((facility) =>
      queryParams.append("facilities", facility)
    );
  }
  
  if (searchParams.temples && searchParams.temples.length > 0) {
    searchParams.temples.forEach((temple) =>
      queryParams.append("temples", temple)
    );
  }

  if (searchParams.maxPrice) {
    queryParams.append("maxPrice", searchParams.maxPrice);
  }

  if (searchParams.sortOption) {
    queryParams.append("sortOption", searchParams.sortOption);
  }

  const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams.toString()}`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
};

export const fetchHotels = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels`);
  if (!response.ok) {
    throw new Error("Error fetching hotels");
  }
  return response.json();
};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
  if (!response.ok) {
    throw new Error("Error fetching Hotels");
  }

  return response.json();
};

export const createPaymentIntent = async (
  hotelId: string,
  numberOfNights: string
): Promise<PaymentIntentResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ numberOfNights }),
    }
  );

  if (!response.ok) {
    throw new Error("Error fetching payment intent");
  }

  return response.json();
};

export const createRoomBooking = async (formData: BookingFormData) => {
  const response = await fetch(
    `${API_BASE_URL}/api/my-bookings/booking/${formData.hotelId}`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(formData),
    }
  );

  if (!response.ok) {
    throw new Error("Error booking room");
  }
};

export const fetchMyBookings = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-bookings`, {
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    throw new Error("Unable to fetch bookings");
  }

  return response.json();
};

export const fetchHotelOwnerBookings = async (): Promise<HotelType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels/my-bookings/${Date.now()}`, {
    headers: getAuthHeaders(false),
  });

  if (!response.ok) {
    throw new Error("Unable to fetch owner bookings");
  }

  return response.json();
};

// apiClient.ts

export const createPaymentOrder = async (
  hotelId: string,
  numberOfNights: string
): Promise<PaymentIntentResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-order`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ numberOfNights }),
  });

  if (!response.ok) {
    throw new Error("Error creating payment order");
  }

  return response.json();
};
