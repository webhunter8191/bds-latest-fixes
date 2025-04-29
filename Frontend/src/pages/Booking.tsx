import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import BookingForm from "../forms/BookingForm/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import ClipLoader from "react-spinners/ClipLoader"; // Import a loader from react-spinners

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

  return (
    <div className="grid md:grid-cols-[1fr_2fr]">
      <BookingDetailsSummary
        checkIn={search.checkIn}
        checkOut={search.checkOut}
        roomCount={search.roomCount}
        numberOfNights={numberOfNights}
        hotel={hotel}
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
