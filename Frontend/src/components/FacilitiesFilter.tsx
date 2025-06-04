import { hotelFacilities } from "../config/hotel-options-config";

type Props = {
  selectedFacilities: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FacilitiesFilter = ({ selectedFacilities, onChange }: Props) => {
  return (
    <div className="border-b border-slate-200 pb-6">
      {/* <h4 className="text-base font-semibold mb-3 text-gray-800">Facilities</h4> */}
      <div className="flex flex-col gap-2">
        {hotelFacilities.map((facility) => (
          <label
            key={facility}
            className="flex items-center gap-3 cursor-pointer group transition"
          >
            <input
              type="checkbox"
              className="rounded border-slate-300 focus:ring-2 focus:ring-brand text-brand w-4 h-4 transition duration-150"
              value={facility}
              checked={selectedFacilities.includes(facility)}
              onChange={onChange}
            />
            <span className="text-gray-700 text-sm group-hover:text-brand transition font-medium">
              {facility}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FacilitiesFilter;
