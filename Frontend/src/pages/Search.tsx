import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/SearchContext";
import * as apiClient from "../api-client";
import { useState } from "react";
import SearchResultsCard from "../components/SearchResultsCard";
import Pagination from "../components/Pagination";
import StarRatingFilter from "../components/StarRatingFilter";
import HotelTypesFilter from "../components/HotelTypesFilter";
import FacilitiesFilter from "../components/FacilitiesFilter";
import PriceFilter from "../components/PriceFilter";
import SearchBar from "../components/SearchBar";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedHotelTypes, setSelectedHotelTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");
  const [isFiltersVisible, setFiltersVisible] = useState(false);

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    roomCount: search.roomCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedHotelTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;
    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
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
  };

  const handleFacilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const facility = event.target.value;
    setSelectedFacilities((prevFacilities) =>
      event.target.checked
        ? [...prevFacilities, facility]
        : prevFacilities.filter((prevFacility) => prevFacility !== facility)
    );
  };

  return (
    <div className="mx-auto max-w-screen-xxl mt-5 mb-5 py-0  lg:px-10 md:px-5 mx-5 px-3 sm:px-0 ">
      <div className="mx-auto mb-6 ">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-1">
        {/* Filters Sidebar */}
        <div className="lg:block ">
          {/* Show/Hide Filters and Sort By Buttons */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <button
              className="bg-indigo-600 text-white px-3 py-1 rounded-md font-medium hover:bg-indigo-500 transition-transform duration-300 transform hover:scale-105 w-fit"
              onClick={() => setFiltersVisible(!isFiltersVisible)}
            >
              {isFiltersVisible ? "Hide Filters" : "Show Filters"}
            </button>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-sm"
            >
              <option value="">Sort By</option>
              <option value="starRating">Star Rating</option>
              <option value="pricePerNightAsc">
                Price Per Night (low to high)
              </option>
              <option value="pricePerNightDesc">
                Price Per Night (high to low)
              </option>
            </select>
          </div>

          {/* Filters Content */}
          <div
            className={`${
              isFiltersVisible ? "block animate-slide-in" : "hidden"
            } lg:block rounded-lg border border-slate-300 p-4 sm:p-6 sticky top-10 h-fit bg-white shadow-md`}
          >
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl md:text- font-semibold text-gray-800 border-b pb-4">
                Filter by:
              </h3>
              <StarRatingFilter
                selectedStars={selectedStars}
                onChange={handleStarsChange}
              />
              <HotelTypesFilter
                selectedHotelTypes={selectedHotelTypes}
                onChange={handleHotelTypeChange}
              />
              <FacilitiesFilter
                selectedFacilities={selectedFacilities}
                onChange={handleFacilityChange}
              />
              <PriceFilter
                selectedPrice={selectedPrice}
                onChange={(value?: number) => setSelectedPrice(value)}
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex flex-col gap-2">
          {/* Results Header and Sorting Dropdown */}
          <div className="hidden lg:flex justify-between items-center">
            <span className="lg:text-xl md:p-0 sm:text-2xl font-bold text-gray-800">
              {hotelData?.pagination.total} Hotels found
              {search.destination ? ` in ${search.destination}` : ""}
            </span>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="p-3 border rounded-md shadow-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Sort By</option>
              <option value="starRating">Star Rating</option>
              <option value="pricePerNightAsc">
                Price Per Night (low to high)
              </option>
              <option value="pricePerNightDesc">
                Price Per Night (high to low)
              </option>
            </select>
          </div>

          {/* Search Results Cards */}
          <div className="grid grid-rows-1 sm:grid-cols-2 lg:grid-cols-2 lg:m-5 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hotelData?.data.map((hotel) => (
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

      {/* Filters Modal for Small Screens */}
      {isFiltersVisible && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-11/12 max-w-md mx-auto mt-20 animate-slide-in">
            <button
              className="bg-indigo-600 text-white px-3 py-1 rounded-md font-medium hover:bg-indigo-500 transition-transform duration-300 transform hover:scale-105 mb-4"
              onClick={() => setFiltersVisible(false)}
            >
              Close Filters
            </button>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl md:text- font-semibold text-gray-800 border-b pb-4">
                Filter by:
              </h3>
              <StarRatingFilter
                selectedStars={selectedStars}
                onChange={handleStarsChange}
              />
              <HotelTypesFilter
                selectedHotelTypes={selectedHotelTypes}
                onChange={handleHotelTypeChange}
              />
              <FacilitiesFilter
                selectedFacilities={selectedFacilities}
                onChange={handleFacilityChange}
              />
              <PriceFilter
                selectedPrice={selectedPrice}
                onChange={(value?: number) => setSelectedPrice(value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
