export type UserType = {
  _id: string;
  email?: string; // Made optional
  phoneNumber?: string; // Added phone number support
  password: string;
  firstName: string;
  lastName: string;
  isAdmin:boolean;
  mobNo?: string; // Made optional for backward compatibility
};


export type HotelType = {
  [x: string]: any;
  hotelName: string | undefined;
  createdAt: number;
  _id: string;
  userId: string;
  name: string;
  description: string;
  location: string;
  city?: string; // Optional field
  country?: string; // Optional field
  type: string;
  starRating: number;
  roomCount: number;
  facilities: string[];
  imageUrls: string[];
  lastUpdated: Date;
  nearbyTemple: string[];
  status: "active" | "archive"; // Enum for hotel status
  policies: string[]; // Policies array
  temples: {
    name: string;
    distance: number;
  }[];
  rooms: RoomType[]; // Updated rooms array
};

// Define the RoomType separately for clarity
export type RoomType = {
  _id: string;
  category: number;
  totalRooms: number;
  availableRooms: number;
  images: string[];
  adultCount: number;
  childCount: number;
  defaultPrice: number; // Default price for unspecified dates
  maxPrice?: number; // Maximum price threshold for commission calculation
  maxPriceSet?: boolean; // Flag to track if maxPrice has been set
  priceCalendar: {
    date: Date; // Specific date
    price: number; // Price for that date
    availableRooms: number; // Available rooms for that date
  }[];
  features: string[]; // Make this required, not optional
};

export type BookingType = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  roomCount: number,
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
  paymentOption?: "full" | "partial";
  fullAmount?: number;
};

export type HotelSearchResponse = {
  data: HotelType[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
};

export type PaymentIntentResponse = {
  paymentIntentId: string;
  clientSecret: string;
  totalCost: number;
};
