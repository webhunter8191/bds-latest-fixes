export type UserType = {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isAdmin:boolean;
  mobNo : string;
};


export type HotelType = {
<<<<<<< HEAD
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
  category: number;
  totalRooms: number;
  availableRooms: number;
  features: string[];
  images: string[];
  adultCount: number;
  childCount: number;
  defaultPrice: number; // Default price for unspecified dates
  priceCalendar: {
    date: Date; // Specific date
    price: number; // Price for that date
  }[];
=======
  [x: string]: any;
  starRating: number;
  description: string;
  location: string;
  _id: string;
  userId: string;
  name: string;
  type: string;
  roomCount:number,
  facilities: string[];
  pricePerNight: number;
  imageUrls: string[];
  lastUpdated: Date;
  nearbyTemple: string[];
  rooms:object[];
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
};

export type BookingType = {

  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  roomCount:number,
  checkIn: Date;
  checkOut: Date;
  totalCost: number;

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
