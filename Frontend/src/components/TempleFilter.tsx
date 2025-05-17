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
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Nearby Places</h4>
      <div className="max-h-40 overflow-y-auto pr-2">
        {templesList.map((temple) => (
          <label key={temple} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              className="rounded text-[#6A5631] focus:ring-[#6A5631]"
              value={temple}
              checked={selectedTemples.includes(temple)}
              onChange={onChange}
            />
            <span className="text-sm">{temple}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default TempleFilter;
