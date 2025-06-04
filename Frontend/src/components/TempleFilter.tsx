import React from "react";

const templesList = [
  "Prem Mandir",
  "Banke Bihari",
  "Dwarikadish",
  "ISKCON Temple",
  "Radha Raman Temple",
  "Nidhi Van",
  "Krishna Janmbhoomi",
  "Mathura",
  "Vrindavan",
  "Gokul",
  "Goverdhan",
  "Barsana",
];

type Props = {
  selectedTemples: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const TempleFilter = ({ selectedTemples, onChange }: Props) => {
  return (
    <div className="border-b border-slate-200 pb-6">
      {/* <h4 className=\"text-base font-semibold mb-3 text-gray-800\">Nearby Places</h4> */}
      <div className="max-h-40 overflow-y-auto pr-2 flex flex-col gap-2">
        {templesList.map((temple) => (
          <label
            key={temple}
            className="flex items-center gap-3 cursor-pointer group transition"
          >
            <input
              type="checkbox"
              className="rounded border-slate-300 focus:ring-2 focus:ring-brand text-brand w-4 h-4 transition duration-150"
              value={temple}
              checked={selectedTemples.includes(temple)}
              onChange={onChange}
            />
            <span className="text-gray-700 text-sm group-hover:text-brand transition font-medium">
              {temple}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TempleFilter;
