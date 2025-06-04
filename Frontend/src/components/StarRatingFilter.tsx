import { FaStar } from "react-icons/fa";

type Props = {
  selectedStars: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const StarRatingFilter = ({ selectedStars, onChange }: Props) => {
  return (
    <div className="border-b border-slate-200 pb-6">
      {/* <h4 className="text-base font-semibold mb-3 text-gray-800">Property Star Rating</h4> */}
      <div className="flex flex-col gap-2">
        {["5", "4", "3", "2", "1"].map((star) => (
          <label
            key={star}
            className="flex items-center gap-3 cursor-pointer group transition"
          >
            <input
              type="checkbox"
              className="rounded border-slate-300 focus:ring-2 focus:ring-brand text-brand w-4 h-4 transition duration-150"
              value={star}
              checked={selectedStars.includes(star)}
              onChange={onChange}
            />
            <span className="flex items-center text-gray-700 text-sm group-hover:text-brand transition font-medium">
              <FaStar className="text-yellow-400 mr-1" size={14} />
              {star} Stars
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StarRatingFilter;
