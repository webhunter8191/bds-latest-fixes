import React, { useContext, useState } from "react";

type SearchContext = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  roomCount:number,
  hotelId: string;
  totalCost:number,
  saveSearchValues: (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    roomCount: number,
    totalCost:number,
   
  ) => void;
};

const SearchContext = React.createContext<SearchContext | undefined>(undefined);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContextProvider = ({
  children,
}: SearchContextProviderProps) => {
  const [destination, setDestination] = useState<string>(
    () => sessionStorage.getItem("destination") || ""
  );
  const [checkIn, setCheckIn] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
  );
  const [checkOut, setCheckOut] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
  );
  const [roomCount, setRoomCount] = useState<number>(() =>
    parseInt(sessionStorage.getItem("roomCount") || "1")
  );

  const [totalCost, setTotalCost] = useState<number>(() =>
    parseInt(sessionStorage.getItem("totalCost") || "0")
  );
 
  const [hotelId, setHotelId] = useState<string>(
    () => sessionStorage.getItem("hotelID") || ""
  );

  const saveSearchValues = (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    roomCount:number,
    totalCost:number,
    hotelId?: string,
    
  ) => {
    console.log("in search context",totalCost, destination, checkIn, checkOut, roomCount, hotelId);
    
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setRoomCount(roomCount);
    setTotalCost(totalCost);
    if (hotelId) {
      setHotelId(hotelId);
    }

    sessionStorage.setItem("destination", destination);
    sessionStorage.setItem("checkIn", checkIn?.toISOString());
    sessionStorage.setItem("checkOut", checkOut?.toISOString());
    sessionStorage.setItem("roomCount", roomCount?.toString());
    sessionStorage.setItem("totalCost", totalCost?.toString());

    if (hotelId) {
      sessionStorage.setItem("hotelId", hotelId);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        roomCount,
       totalCost,
        hotelId,
        saveSearchValues,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  return context as SearchContext;
};
