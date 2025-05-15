import React, { useState, useEffect } from "react";

type PriceCalendarEntry = {
  date: string; // Date as a string (YYYY-MM-DD)
  price: number; // Price for the date
  availableRooms: number; // Number of available rooms for the date
};

interface Props {
  priceCalendarEntries: PriceCalendarEntry[];
  setPriceCalendarEntries: React.Dispatch<
    React.SetStateAction<PriceCalendarEntry[]>
  >;
  handleAvailableRoomsChange: (index: number, value: string) => void;
}

const PriceCalendarForm = ({
  priceCalendarEntries,
  setPriceCalendarEntries,
  handleAvailableRoomsChange,
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
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    setPriceCalendarEntries(updatedEntries);
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
        <div key={index} className="flex flex-col space-y-1">
          <div className="flex space-x-4 items-center">
            <input
              type="date"
              value={entry.date}
              onChange={(e) => handleChange(index, "date", e.target.value)}
              className="border border-gray-300 rounded-md p-2 flex-1"
            />
            <input
              type="number"
              value={entry.price}
              onChange={(e) =>
                handleChange(index, "price", Number(e.target.value))
              }
              placeholder="Price"
              className="border border-gray-300 rounded-md p-2 w-32"
            />
            <input
              type="number"
              value={entry.availableRooms}
              onChange={(e) => {
                handleChange(index, "availableRooms", Number(e.target.value));
                handleAvailableRoomsChange(index, e.target.value);
              }}
              placeholder="Available Rooms"
              className="border border-gray-300 rounded-md p-2 w-32"
            />
            <button
              type="button"
              onClick={() => handleRemoveEntry(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <div className="text-sm text-gray-600 mt-1 ml-1">
            {entry.date && <div>Date: {entry.date.split("T")[0]}</div>}
            <div>Price: ₹{entry.price}</div>
            <div>Available Rooms: {entry.availableRooms}</div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddEntry}
        className="text-blue-500 hover:text-blue-700"
      >
        + Add Date
      </button>
    </div>
  );
};

export default PriceCalendarForm;
