import { FormEvent, useState, useEffect, useRef } from "react";
import { useSearchContext } from "../contexts/SearchContext";
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const search = useSearchContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const [destination, setDestination] = useState<string>(search.destination);
  const [checkIn, setCheckIn] = useState<Date | null>(search.checkIn || today);
  const [checkOut, setCheckOut] = useState<Date | null>(
    search.checkOut || tomorrow
  );
  const [roomCount, setRoomCount] = useState<number>(search.roomCount);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);

  // List of suggested locations
  const locations = [
    "Prem Mandir",
    "Banke Bihari",
    "Dwarikadish",
    "ISKCON Temple",
    "Radha Raman Temple",
    "Radha Damodar Temple",
    "Radha Vallabh Temple",
    "Gauri Gopal Ashram",
    "Harinikunj Chauraha",
    "Govind Dev Ji Temple",
    "Bus Stand Vrindavan",
    "100 feet road vrindavan",
    "Multilevel Car Parking",
    "Shri Radha Ras Bihari Ashta Sakhi Temple",
    "Attalla Chungi",
    "Vidhyapeeth Chauraha",
    "Pagal Baba Temple",
    "Baba Neem Karori Ashram Vrindavan",
    "Mayavati Hospital Vrindavan",
    "Nidhi Van",
    "Krishna Janmbhoomi",
    "Mathura",
    "Vrindavan",
    "Gokul",
    "Goverdhan",
    "Barsana",
  ];

  // State for rotating placeholder
  const [placeholderIndex, setPlaceholderIndex] = useState(() =>
    Math.floor(Math.random() * locations.length)
  );

  useEffect(() => {
    if (destination.length > 0) return; // Don't rotate if user is typing
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => {
        let next = Math.floor(Math.random() * locations.length);
        // Ensure a different location
        while (next === prev && locations.length > 1) {
          next = Math.floor(Math.random() * locations.length);
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [destination.length, locations.length]);

  const locationPlaceholder =
    destination.length === 0 ? `${locations[placeholderIndex]}` : "";

  useEffect(() => {
    if (checkIn && !checkOut) {
      const nextDay = new Date(checkIn);
      nextDay.setDate(checkIn.getDate() + 1);
      setCheckOut(nextDay);
    }
  }, [checkIn]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (checkIn && checkOut) {
      search.saveSearchValues(destination, checkIn, checkOut, roomCount, 0);
      navigate("/search");
    } else {
      alert("Please select valid check-in and check-out dates.");
    }
  };

  const handleCheckInChange = (date: Date | null) => {
    setCheckIn(date);
    if (date) {
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      setCheckOut(nextDay);
    }
  };

  const handleLocationFocus = () => {
    setFilteredLocations(locations);
    setShowDropdown(true);
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDestination(value);

    setFilteredLocations(
      value.length > 0
        ? locations.filter((loc) =>
            loc.toLowerCase().includes(value.toLowerCase())
          )
        : locations
    );

    setShowDropdown(true);
  };

  const handleLocationSelect = (location: string) => {
    setDestination(location);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white border border-slate-200 rounded-3xl grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4 shadow-xl  "
    >
      {/* Location Input */}
      <div className="flex flex-col  relative" ref={dropdownRef}>
        <label className="block text-gray-700 font-semibold mb-2 text-base">
          Location
        </label>
        <div className="flex items-center p-3 bg-gray-100 rounded-lg focus-within:ring-2 focus-within:ring-brand transition">
          <MdTravelExplore size={22} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder={locationPlaceholder}
            className="text-base w-full bg-transparent focus:outline-none placeholder-gray-400"
            value={destination}
            onChange={handleLocationChange}
            onFocus={handleLocationFocus}
          />
        </div>
        {/* Dropdown List */}
        {showDropdown && (
          <ul className="absolute top-full left-0 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-20 max-h-56 overflow-y-auto mt-1 transition-all duration-300">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc, index) => (
                <li
                  key={index}
                  className="px-4 py-3 text-gray-700 hover:bg-brand/10 hover:text-brand cursor-pointer transition-all duration-200 rounded-md"
                  onClick={() => handleLocationSelect(loc)}
                >
                  {loc}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-gray-400">No results found</li>
            )}
          </ul>
        )}
      </div>
      {/* Room Count Input */}
      <div className="flex flex-col md:col-span-1">
        <label className="block text-gray-700 font-semibold mb-2 text-base">
          Rooms
        </label>
        <div className="flex items-center p-3 bg-gray-100 rounded-lg focus-within:ring-2 focus-within:ring-brand transition">
          <input
            type="number"
            min={1}
            max={20}
            className="w-full bg-transparent focus:outline-none text-base text-left placeholder-gray-400"
            value={roomCount}
            placeholder="How many rooms do you want?"
            onChange={(event) => setRoomCount(parseInt(event.target.value))}
          />
        </div>
      </div>
      {/* Check-in Date Input */}
      <div className="flex flex-col md:col-span-1">
        <label className="block text-gray-700 font-semibold mb-2 text-base">
          Check-in
        </label>
        <DatePicker
          selected={checkIn}
          onChange={handleCheckInChange}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={today}
          maxDate={
            new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
          }
          placeholderText="Check-in Date"
          className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none text-base placeholder-gray-400 focus:ring-2 focus:ring-brand"
        />
      </div>
      {/* Check-out Date Input */}
      <div className="flex flex-col md:col-span-1">
        <label className="block text-gray-700 font-semibold mb-2 text-base">
          Check-out
        </label>
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date as Date | null)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn || today}
          maxDate={
            new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
          }
          placeholderText="Check-out Date"
          className="w-full p-3 rounded-lg bg-gray-100 focus:outline-none text-base placeholder-gray-400 focus:ring-2 focus:ring-brand"
        />
      </div>
      {/* Search Button */}
      <div className="col-span-2 md:col-span-2 lg:col-span-1 flex items-end">
        <button
          type="submit"
          className="w-full bg-brand text-white p-3 font-bold text-lg rounded-lg shadow-md hover:bg-[#8B7442] hover:scale-[1.03] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
