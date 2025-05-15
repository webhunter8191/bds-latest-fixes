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
    console.log("Price selected:", value); // Debug log
    const numericValue = value ? parseInt(value, 10) : undefined;
    console.log("Parsed price:", numericValue); // Debug log
    onChange(numericValue);
  };

  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <select
        className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        value={selectedPrice || ""}
        onChange={handlePriceChange}
      >
        <option value="">Select Max Price</option>
        {priceOptions.map((price) => (
          <option key={price} value={price}>
            {formatPrice(price)}
          </option>
        ))}
      </select>
      {selectedPrice && (
        <div className="mt-2 text-sm text-gray-600">
          Selected: {formatPrice(selectedPrice)}
        </div>
      )}
    </div>
  );
};

export default PriceFilter;
