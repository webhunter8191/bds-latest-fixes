import React, { useState } from "react";

type PriceCalendarEntry = {
  date: string; // Date as a string (YYYY-MM-DD)
  price: number; // Price for the date
};

type Props = {
  initialEntries?: PriceCalendarEntry[]; // Existing price calendar entries
  onChange: (entries: PriceCalendarEntry[]) => void; // Callback to update parent state
};

const PriceCalendarForm: React.FC<Props> = ({ initialEntries, onChange }) => {
  const [entries, setEntries] = useState<PriceCalendarEntry[]>(
    initialEntries || []
  );

  const handleAddEntry = () => {
    setEntries([...entries, { date: "", price: 0 }]);
  };

  const handleRemoveEntry = (index: number) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
    onChange(updatedEntries);
  };

  const handleChange = (
    index: number,
    field: "date" | "price",
    value: string | number
  ) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      [field]: value,
    };
    setEntries(updatedEntries);
    onChange(updatedEntries);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dynamic Pricing Calendar</h3>
      {entries.map((entry, index) => (
        <div key={index} className="flex space-x-4 items-center">
          <input
            type="date"
            value={entry.date}
            onChange={(e) =>
              handleChange(index, "date", e.target.value)
            }
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
          <button
            type="button"
            onClick={() => handleRemoveEntry(index)}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
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