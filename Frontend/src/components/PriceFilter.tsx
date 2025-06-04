type Props = {
  selectedPrice?: number;
  onChange: (value?: number) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
  const priceOptions = [500, 1000, 1500, 2000, 3000];

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const numericValue = value ? parseInt(value, 10) : undefined;
    onChange(numericValue);
  };

  return (
    <div className="border-b border-slate-200 pb-6">
      {/* <h4 className="text-base font-semibold mb-3 text-gray-800">Max Price</h4> */}
      <select
        className="p-3 border border-slate-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-brand bg-white text-gray-700 text-base font-medium transition"
        value={selectedPrice || ""}
        onChange={handlePriceChange}
      >
        <option value="">Select Max Price</option>
        {priceOptions.map((price) => (
          <option key={price} value={price} className="text-gray-700">
            {formatPrice(price)}
          </option>
        ))}
      </select>
      {selectedPrice && (
        <div className="mt-2 text-sm text-brand font-semibold">
          Selected: {formatPrice(selectedPrice)}
        </div>
      )}
    </div>
  );
};

export default PriceFilter;
