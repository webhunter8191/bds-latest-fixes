import React, { useState, useEffect } from "react";

type PriceCalendarEntry = {
  date: string; // Date as a string (YYYY-MM-DD)
  price: number; // Price for the date
  availableRooms: number; // Number of available rooms for the date
};

type Props = {
  priceCalendarEntries: PriceCalendarEntry[];
  setPriceCalendarEntries: React.Dispatch<
    React.SetStateAction<PriceCalendarEntry[]>
  >;
  handleAvailableRoomsChange: (index: number, value: string) => void;
  maxPrice?: number; // Add maxPrice prop
};

const PriceCalendarForm = ({
  priceCalendarEntries,
  setPriceCalendarEntries,
  handleAvailableRoomsChange,
  maxPrice,
}: Props) => {
  const [entries, setEntries] =
    useState<PriceCalendarEntry[]>(priceCalendarEntries);

  useEffect(() => {
    setEntries(priceCalendarEntries);
  }, [priceCalendarEntries]);

  const handleAddEntry = () => {
    const newEntry = { date: "", price: 0, availableRooms: 0 };
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    setPriceCalendarEntries(updatedEntries);
  };

  const handleRemoveEntry = (index: number) => {
    console.log("Removing calendar entry at index:", index);
    console.log("Before removal:", entries);

    // Remove the entry from the local state
    const updatedEntries = entries.filter((_, i) => i !== index);
    console.log("After removal:", updatedEntries);

    // Update both local and parent state immediately
    setEntries(updatedEntries);
    setPriceCalendarEntries(updatedEntries);

    // Alert the user that the entry has been removed (optional)
    setTimeout(() => {
      console.log("Updated price calendar entries:", updatedEntries);
    }, 100);
  };

  const handleChange = (
    index: number,
    field: "date" | "price" | "availableRooms",
    value: string | number
  ) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value,
    };
    setEntries(updatedEntries);
    setPriceCalendarEntries(updatedEntries);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dynamic Pricing Calendar</h3>
      {entries.map((entry, index) => (
        <div
          key={index}
          className="flex flex-col space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4"
        >
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <label
                htmlFor={`date-${index}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                id={`date-${index}`}
                type="date"
                value={entry.date ? entry.date.substring(0, 10) : ""}
                onChange={(e) => handleChange(index, "date", e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              {entry.date && (
                <div className="text-sm text-gray-600 mt-1">
                  Selected:{" "}
                  {new Date(entry.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor={`price-${index}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price
              </label>
              <input
                id={`price-${index}`}
                type="number"
                value={entry.price}
                onChange={(e) =>
                  handleChange(index, "price", Number(e.target.value))
                }
                placeholder="Enter price"
                className={`border rounded-md p-2 w-full ${
                  maxPrice && entry.price > maxPrice
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                }`}
              />
              {maxPrice && entry.price > maxPrice && (
                <div className="text-xs text-orange-600 mt-1">
                  Price exceeds max price (₹{maxPrice}) - 10% commission applies
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <label
                htmlFor={`availableRooms-${index}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Available Rooms
              </label>
              <input
                id={`availableRooms-${index}`}
                type="number"
                value={entry.availableRooms}
                onChange={(e) => {
                  handleChange(index, "availableRooms", Number(e.target.value));
                  handleAvailableRoomsChange(index, e.target.value);
                }}
                placeholder="Enter available rooms"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => handleRemoveEntry(index)}
              className="text-red-500 hover:text-red-700 font-medium flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Remove
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddEntry}
        className="flex items-center text-[#6A5631] hover:text-[#5A4728] font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add Date
      </button>
    </div>
  );
};

export default PriceCalendarForm;
