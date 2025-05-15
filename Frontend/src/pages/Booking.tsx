import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import ClipLoader from "react-spinners/ClipLoader";

const categories = {
  1: "Double Bed AC",
  2: "Double Bed Non AC",
  3: "3 Bed AC",
  4: "3 Bed Non AC",
  5: "4 Bed AC",
  6: "4 Bed Non AC",
  7: "Community Hall",
};

const Booking = () => {
  const { hotelId } = useParams();
  const { roomsId } = useLocation().state as { roomsId: string };
  console.log("roomsId", roomsId);

  const search = useSearchContext();
  const [numberOfNights, setNumberOfNights] = useState<number>(0);

  useEffect(() => {
    if (search.checkIn && search.checkOut) {
      const nights =
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
        (1000 * 60 * 60 * 24);

      setNumberOfNights(Math.ceil(nights));
    }
  }, [search.checkIn, search.checkOut]);

  const { data: hotel, isLoading: isHotelLoading } = useQuery(
    "fetchHotelByID",
    () => apiClient.fetchHotelById(hotelId as string),
    {
      enabled: !!hotelId,
    }
  );

  const { data: currentUser, isLoading: isUserLoading } = useQuery(
    "fetchCurrentUser",
    apiClient.fetchCurrentUser
  );

  if (isHotelLoading || isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={true} />
      </div>
    );
  }

  if (!hotel) {
    return <></>;
  }

  // Find the selected room
  const selectedRoom = hotel.rooms.find((room) => room._id === roomsId);

  // Get price from price calendar based on check-in date
  const getPriceForDate = (room: any, date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    const priceEntry = room.priceCalendar?.find(
      (entry: { date: string; price: number }) =>
        new Date(entry.date).toISOString().split("T")[0] === dateString
    );
    return priceEntry ? priceEntry.price : room.defaultPrice;
  };

  const selectedRoomCategory = selectedRoom
    ? categories[selectedRoom.category as keyof typeof categories]
    : undefined;

  const selectedRoomPrice =
    selectedRoom && search.checkIn
      ? getPriceForDate(selectedRoom, search.checkIn)
      : selectedRoom?.defaultPrice;

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        roomCount={search.roomCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
        selectedRoomCategory={selectedRoomCategory}
        selectedRoomPrice={selectedRoomPrice}
      />
      {currentUser && (
        <BookingForm
          currentUser={currentUser}
          totalCost={search.totalCost}
          roomsId={roomsId}
        />
      )}
    </div>
  );
};

export default Booking;
