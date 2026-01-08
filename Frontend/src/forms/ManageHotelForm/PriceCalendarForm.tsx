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
  
  // Date range state
  const [rangeStartDate, setRangeStartDate] = useState("");
  const [rangeEndDate, setRangeEndDate] = useState("");
  const [rangePrice, setRangePrice] = useState(0);
  const [rangeAvailableRooms, setRangeAvailableRooms] = useState(0);
  const [showRangeForm, setShowRangeForm] = useState(false);

  useEffect(() => {
    setEntries(priceCalendarEntries);
  }, [priceCalendarEntries]);

  const handleAddEntry = () => {
    const newEntry = { date: "", price: 0, availableRooms: 0 };
    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    setPriceCalendarEntries(updatedEntries);
  };

  // Function to get all dates between start and end date (inclusive)
  const getDatesInRange = (startDate: string, endDate: string): string[] => {
    const dates: string[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validate date range
    if (start > end) {
      return dates; // Return empty if invalid range
    }

    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateString = currentDate.toISOString().split('T')[0];
      dates.push(dateString);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Function to check if a date already exists in entries
  const dateExists = (date: string): boolean => {
    return entries.some(entry => entry.date.substring(0, 10) === date);
  };

  // Handle adding date range
  const handleAddDateRange = () => {
    if (!rangeStartDate || !rangeEndDate) {
      alert("Please select both start and end dates");
      return;
    }

    if (rangePrice <= 0) {
      alert("Please enter a valid price");
      return;
    }

    const datesInRange = getDatesInRange(rangeStartDate, rangeEndDate);
    
    if (datesInRange.length === 0) {
      alert("Invalid date range. End date must be after start date.");
      return;
    }

    // Filter out dates that already exist
    const newDates = datesInRange.filter(date => !dateExists(date));
    
    if (newDates.length === 0) {
      alert("All dates in this range already exist in the calendar.");
      return;
    }

    // Create entries for each new date
    const newEntries: PriceCalendarEntry[] = newDates.map(date => ({
      date: date,
      price: rangePrice,
      availableRooms: rangeAvailableRooms,
    }));

    // Merge with existing entries and sort by date
    const updatedEntries = [...entries, ...newEntries].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    setEntries(updatedEntries);
    setPriceCalendarEntries(updatedEntries);

    // Reset range form
    setRangeStartDate("");
    setRangeEndDate("");
    setRangePrice(0);
    setRangeAvailableRooms(0);
    setShowRangeForm(false);

    // Show success message
    alert(`Added ${newEntries.length} date(s) to the calendar. ${datesInRange.length - newDates.length} date(s) were skipped as they already exist.`);
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Dynamic Pricing Calendar</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowRangeForm(!showRangeForm)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              showRangeForm
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-[#6A5631] text-white hover:bg-[#5A4728]"
            }`}
          >
            {showRangeForm ? "Cancel Range" : "Add Date Range"}
          </button>
          <button
            type="button"
            onClick={handleAddEntry}
            className="px-4 py-2 bg-[#6A5631] text-white rounded-lg hover:bg-[#5A4728] font-medium transition-colors flex items-center"
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
            Add Single Date
          </button>
        </div>
      </div>

      {/* Date Range Form */}
      {showRangeForm && (
        <div className="p-4 border-2 border-[#6A5631] rounded-lg bg-[#6A5631]/5 mb-4">
          <h4 className="text-md font-semibold text-gray-800 mb-4">
            Add Date Range
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={rangeStartDate}
                onChange={(e) => setRangeStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={rangeEndDate}
                onChange={(e) => setRangeEndDate(e.target.value)}
                min={rangeStartDate || new Date().toISOString().split('T')[0]}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (for all dates)
              </label>
              <input
                type="number"
                value={rangePrice}
                onChange={(e) => setRangePrice(Number(e.target.value))}
                placeholder="Enter price"
                min="0"
                className={`w-full p-2 border rounded-md ${
                  maxPrice && rangePrice > maxPrice
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-[#6A5631] focus:border-transparent`}
              />
              {maxPrice && rangePrice > maxPrice && (
                <div className="text-xs text-orange-600 mt-1">
                  Price exceeds max price (₹{maxPrice}) - 10% commission applies
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Rooms (for all dates)
              </label>
              <input
                type="number"
                value={rangeAvailableRooms}
                onChange={(e) => setRangeAvailableRooms(Number(e.target.value))}
                placeholder="Enter available rooms"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
              />
            </div>
          </div>
          {rangeStartDate && rangeEndDate && (
            <div className="mt-3 p-2 bg-blue-50 rounded-md text-sm text-blue-800">
              <strong>Preview:</strong> This will add{" "}
              {getDatesInRange(rangeStartDate, rangeEndDate).length} date(s) from{" "}
              {new Date(rangeStartDate).toLocaleDateString()} to{" "}
              {new Date(rangeEndDate).toLocaleDateString()}
            </div>
          )}
          <button
            type="button"
            onClick={handleAddDateRange}
            className="mt-4 w-full md:w-auto px-6 py-2 bg-[#6A5631] text-white rounded-lg hover:bg-[#5A4728] font-medium transition-colors"
          >
            Add Range to Calendar
          </button>
        </div>
      )}

      {/* Existing Entries */}
      {entries.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-700 mb-3">
            Calendar Entries ({entries.length})
          </h4>
        </div>
      )}
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
    </div>
  );
};

export default PriceCalendarForm;
