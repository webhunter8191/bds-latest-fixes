import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState, useEffect } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";
import TempleFilter from "../components/TempleFilter";
import SearchBar from "../components/SearchBar";
import { Sliders, X } from "lucide-react";
import { HotelType } from "../../../backend/src/shared/types";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedTemples, setSelectedTemples] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");
  const [isFiltersVisible, setFiltersVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);

  const handlePriceChange = (value?: number) => {
    console.log("Price changed in Search:", value); // Debug log
    setSelectedPrice(value);
    setPage(1); // Reset to first page when filter changes
  };

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    roomCount: search.roomCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    temples: selectedTemples,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  console.log("Search params:", searchParams); // Debug log

  const { data: hotelData, isLoading } = useQuery(
    ["searchHotels", searchParams],
    () => apiClient.searchHotels(searchParams),
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!isLoading && hotelData) {
      setIsContentVisible(true);
    } else {
      setIsContentVisible(false);
    }
  }, [isLoading, hotelData]);

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;
    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
    setPage(1); // Reset to first page when filter changes
  };

  const handleHotelTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const hotelType = event.target.value;
    setSelectedHotelTypes((prevHotelTypes) =>
      event.target.checked
        ? [...prevHotelTypes, hotelType]
        : prevHotelTypes.filter((hotel) => hotel !== hotelType)
    );
    setPage(1); // Reset to first page when filter changes
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;
    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
    );
    setPage(1); // Reset to first page when filter changes
  };

  const handleTempleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temple = event.target.value;
    setSelectedTemples((prevTemples) =>
      event.target.checked
        ? [...prevTemples, temple]
        : prevTemples.filter((prevTemple) => prevTemple !== temple)
    );
    setPage(1); // Reset to first page when filter changes
  };

  const handleClearFilters = () => {
    setSelectedStars([]);
    setSelectedHotelTypes([]);
    setSelectedFacilities([]);
    setSelectedTemples([]);
    setSelectedPrice(undefined);
    setPage(1);
  };

  const hasActiveFilters =
    selectedStars.length > 0 ||
    selectedHotelTypes.length > 0 ||
    selectedFacilities.length > 0 ||
    selectedTemples.length > 0 ||
    selectedPrice !== undefined;

  // Handle body scroll when modal is open
  useEffect(() => {
    if (isFiltersVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFiltersVisible]);

  return (
    <div className="mx-auto py-0 max-w-screen-xl lg:px-0 px-3 sm:px-6 lg:px-5 mt-10 mb-10">
      <div className="mb-6">
        <SearchBar />
      </div>
      {isLoading && (
        <div className="flex justify-center mt-20">
          <div className="w-12 h-12 border-4 border-[#6A5631] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {!isLoading && hotelData && (
        <div
          className={`transition-all duration-700 ease-in-out ${
            isContentVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            {/* Filters Sidebar */}
            <div className="lg:block">
              {/* Show/Hide Filters and Sort By Buttons */}
              <div className="lg:hidden flex justify-between items-center mb-4">
                <button
                  className="bg-[#6A5631] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#5a4827] transition-all duration-300 flex items-center gap-2"
                  onClick={() => setFiltersVisible(true)}
                >
                  <Sliders size={18} />
                  Filters
                  {hasActiveFilters && (
                    <span className="bg-white text-[#6A5631] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedStars.length +
                        selectedHotelTypes.length +
                        selectedFacilities.length +
                        selectedTemples.length +
                        (selectedPrice !== undefined ? 1 : 0)}
                    </span>
                  )}
                </button>
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="bg-white text-gray-700 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6A5631] shadow-sm"
                >
                  <option value="">Sort By</option>
                  <option value="starRating">Star Rating</option>
                  <option value="pricePerNightAsc">Price: Low to High</option>
                  <option value="pricePerNightDesc">Price: High to Low</option>
                </select>
              </div>

              {/* Filters Content - ONLY VISIBLE ON DESKTOP */}
              <div className="hidden lg:block rounded-lg border border-gray-200 p-5 sticky top-10 h-fit bg-white shadow-md transition-all duration-300">
                <div className="space-y-5">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Sliders size={18} className="text-[#6A5631]" />
                      Filters
                    </h3>
                    {hasActiveFilters && (
                      <button
                        onClick={handleClearFilters}
                        className="text-sm text-[#6A5631] hover:underline font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="pt-1">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Star Rating
                    </h4>
                    <StarRatingFilter
                      selectedStars={selectedStars}
                      onChange={handleStarsChange}
                    />
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Property Type
                    </h4>
                    <HotelTypesFilter
                      selectedHotelTypes={selectedHotelTypes}
                      onChange={handleHotelTypeChange}
                    />
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Amenities
                    </h4>
                    <FacilitiesFilter
                      selectedFacilities={selectedFacilities}
                      onChange={handleFacilityChange}
                    />
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Nearby Places
                    </h4>
                    <TempleFilter
                      selectedTemples={selectedTemples}
                      onChange={handleTempleChange}
                    />
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Price Range
                    </h4>
                    <PriceFilter
                      selectedPrice={selectedPrice}
                      onChange={handlePriceChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div className="flex flex-col gap-2">
              {/* Results Header and Sorting Dropdown */}
              <div className="hidden lg:flex justify-between items-center">
                <span className="text-xl font-bold text-gray-800">
                  {hotelData?.pagination.total} Hotels found
                  {search.destination ? ` in ${search.destination}` : ""}
                </span>
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="p-2.5 border rounded-lg shadow-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#6A5631] border-gray-300"
                >
                  <option value="">Sort By</option>
                  <option value="starRating">Star Rating</option>
                  <option value="pricePerNightAsc">Price: Low to High</option>
                  <option value="pricePerNightDesc">Price: High to Low</option>
                </select>
              </div>

              {/* Search Results Cards */}
              <div className="grid grid-rows-1 sm:grid-cols-2 lg:grid-cols-2 lg:mt-5 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {hotelData?.data.map((hotel: HotelType) => (
                  <SearchResultsCard key={hotel._id} hotel={hotel} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                page={hotelData?.pagination.page || 1}
                pages={hotelData?.pagination.pages || 1}
                onPageChange={(page) => setPage(page)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal for Small Screens - SEPARATE FROM MAIN SIDEBAR */}
      {isFiltersVisible && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-5 w-11/12 max-w-md mx-auto mt-16 animate-slide-in">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Sliders size={18} className="text-[#6A5631]" />
                Filter Options
              </h3>
              <button
                className="text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => setFiltersVisible(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  Star Rating
                </h4>
                <StarRatingFilter
                  selectedStars={selectedStars}
                  onChange={handleStarsChange}
                />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Property Type
                </h4>
                <HotelTypesFilter
                  selectedHotelTypes={selectedHotelTypes}
                  onChange={handleHotelTypeChange}
                />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-semibold text-gray-700 mb-3">Amenities</h4>
                <FacilitiesFilter
                  selectedFacilities={selectedFacilities}
                  onChange={handleFacilityChange}
                />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Nearby Places
                </h4>
                <TempleFilter
                  selectedTemples={selectedTemples}
                  onChange={handleTempleChange}
                />
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Price Range
                </h4>
                <PriceFilter
                  selectedPrice={selectedPrice}
                  onChange={handlePriceChange}
                />
              </div>
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-[#6A5631] font-medium"
                >
                  Clear all filters
                </button>
              )}
              <button
                className="bg-[#6A5631] text-white px-5 py-2 rounded-lg font-medium hover:bg-[#5a4827] transition-all ml-auto"
                onClick={() => setFiltersVisible(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
