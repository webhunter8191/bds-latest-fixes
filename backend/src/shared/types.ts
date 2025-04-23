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
  [x: string]: any;
  starRating: number;
  description: string;
  location: string;
  _id: string;
  userId: string;
  name: string;
  type: string;
  roomCount: number;
  facilities: string[];
  pricePerNight: number;
  imageUrls: string[];
  lastUpdated: Date;
  nearbyTemple: string[];
  rooms: RoomType[];
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

export type RoomAvailability = {
  date: Date;
  price: number;
  totalRooms: number;
  availableRooms: number;
};

export type RoomType = {
  totalRooms: number;
  price: number;
  availableRooms: number;
  category: string;
  features: string[];
  images: string[];
  adultCount: number;
  childCount: number;
  availability: RoomAvailability[];
};
