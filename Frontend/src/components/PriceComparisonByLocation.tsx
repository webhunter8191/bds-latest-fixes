import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { HotelType } from "../../../backend/src/shared/types";

type LocationStats = {
  location: string;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
  hotelCount: number;
};

type Props = {
  onHotelSelect?: (hotelId: string) => void;
};

const PriceComparisonByLocation: React.FC<Props> = ({ onHotelSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<HotelType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"price" | "rating">("price");
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [popularLocations, setPopularLocations] = useState<LocationStats[]>([]);
  const [locationStats, setLocationStats] = useState<
    Record<string, LocationStats>
  >({});
  const [enhancedSuggestions, setEnhancedSuggestions] = useState<
    {
      location: string;
      hotelCount: number;
      avgPrice: number;
      temples: string[];
    }[]
  >([]);

  // Fetch all hotels for initial data
  const { data: allHotels, isLoading: isLoadingHotels } = useQuery(
    "fetchAllHotels",
    apiClient.fetchHotels,
    {
      onSuccess: (data) => {
        analyzeHotelData(data);
      },
      onError: () => {
        setError("Failed to fetch hotel data. Please try again later.");
      },
    }
  );

  // Common amenities in the system
  const amenitiesOptions = [
    "Free Wifi",
    "Parking",
    "AC",
    "Restaurant",
    "Room Service",
    "Swimming Pool",
    "Gym",
    "Spa",
    "Temple Shuttle",
  ];

  // Process hotel data to extract location statistics
  const analyzeHotelData = (hotels: HotelType[]) => {
    const locationMap: Record<string, LocationStats> = {};

    console.log(`Analyzing ${hotels.length} hotels for price comparison`);

    // Group hotels by location and calculate statistics
    hotels.forEach((hotel) => {
      const location = hotel.city || hotel.location;
      if (!location) return;

      // Get the lowest price among all rooms
      const roomPrices = hotel.rooms
        .map((room) => room.defaultPrice)
        .filter((price) => price > 0);

      if (roomPrices.length === 0) {
        console.log(`Hotel ${hotel.name} has no valid room prices, skipping`);
        return;
      }

      const lowestPrice = Math.min(...roomPrices);

      if (!locationMap[location]) {
        locationMap[location] = {
          location,
          averagePrice: 0,
          minPrice: lowestPrice,
          maxPrice: lowestPrice,
          hotelCount: 1,
        };
      } else {
        locationMap[location].hotelCount += 1;
        locationMap[location].minPrice = Math.min(
          locationMap[location].minPrice,
          lowestPrice
        );
        locationMap[location].maxPrice = Math.max(
          locationMap[location].maxPrice,
          lowestPrice
        );
      }
    });

    // Calculate average prices
    Object.keys(locationMap).forEach((location) => {
      const hotelsInLocation = hotels.filter(
        (hotel) => (hotel.city || hotel.location) === location
      );

      let totalPrice = 0;
      let priceCount = 0;

      hotelsInLocation.forEach((hotel) => {
        hotel.rooms.forEach((room) => {
          if (room.defaultPrice > 0) {
            totalPrice += room.defaultPrice;
            priceCount++;
          }
        });
      });

      locationMap[location].averagePrice =
        priceCount > 0 ? Math.round(totalPrice / priceCount) : 0;
    });

    // Sort locations by hotel count and take top 8
    const sortedLocations = Object.values(locationMap)
      .filter((location) => location.hotelCount >= 2) // Only include locations with at least 2 hotels for comparison
      .sort((a, b) => b.hotelCount - a.hotelCount)
      .slice(0, 8);

    console.log(
      `Found ${sortedLocations.length} locations for price comparison`
    );

    setLocationStats(locationMap);
    setPopularLocations(sortedLocations);
  };

  useEffect(() => {
    console.log(
      `Search query changed: "${searchQuery}" (length: ${searchQuery.length})`
    );

    if (searchQuery.length >= 1 && allHotels) {
      console.log("Fetching location suggestions...");
      console.log("Fetching location suggestions...");
      fetchLocationSuggestions(searchQuery);
    } else {
      setLocationSuggestions([]);
      setEnhancedSuggestions([]);
    }
  }, [searchQuery, allHotels]);

  const fetchLocationSuggestions = (query: string) => {
    if (!allHotels) {
      console.log("No hotels data available for suggestions");
      return;
    }

    setIsSuggestionsLoading(true);
    console.log(
      `Finding suggestions for "${query}" from ${allHotels.length} hotels`
    );

    try {
      // Extract all unique locations from hotels (city/location)
      const locationSet = new Set<string>();

      // Also collect temple names for enhanced search
      const templeSet = new Set<string>();

      allHotels.forEach((hotel) => {
        // Add city/location
        if (hotel.city && hotel.city.trim() !== "") {
          locationSet.add(hotel.city);
        } else if (hotel.location && hotel.location.trim() !== "") {
          locationSet.add(hotel.location);
        }

        // Add temple names as possible locations
        if (hotel.temples && hotel.temples.length > 0) {
          hotel.temples.forEach((temple) => {
            if (temple && temple.name && temple.name.trim() !== "") {
              templeSet.add(temple.name);
            }
          });
        }
      });

      console.log(
        `Found ${locationSet.size} unique locations and ${templeSet.size} temple locations`
      );

      // Get arrays from sets
      const allLocations = Array.from(locationSet);
      const allTempleLocations = Array.from(templeSet);

      // Filter locations based on query using more flexible matching
      const locationMatches = allLocations.filter((loc) => {
        if (!loc) return false;
        const locLower = loc.toLowerCase();
        const queryLower = query.toLowerCase();
        return locLower.includes(queryLower) || queryLower.includes(locLower);
      });

      // Filter temple locations similarly
      const templeMatches = allTempleLocations.filter((temple) => {
        if (!temple) return false;
        const templeLower = temple.toLowerCase();
        const queryLower = query.toLowerCase();
        return (
          templeLower.includes(queryLower) || queryLower.includes(templeLower)
        );
      });

      // Combine unique results (prioritize city/location matches)
      const combinedMatches = [...locationMatches];

      // Add temple matches that aren't already included
      templeMatches.forEach((temple) => {
        // Only add if not similar to an existing location
        if (
          !combinedMatches.some(
            (loc) =>
              loc.toLowerCase().includes(temple.toLowerCase()) ||
              temple.toLowerCase().includes(loc.toLowerCase())
          )
        ) {
          combinedMatches.push(temple);
        }
      });

      // Limit results
      const limitedMatches = combinedMatches.slice(0, 7);

      console.log(
        `After filtering: ${limitedMatches.length} matching locations (${locationMatches.length} cities, ${templeMatches.length} temples)`
      );

      // Enhance suggestions with additional information
      const enhancedSuggestions = limitedMatches.map((location) => {
        // Get hotels in this location
        const hotelsInLocation = allHotels.filter(
          (hotel) => (hotel.city || hotel.location) === location
        );

        // Calculate average price
        let totalValidPrices = 0;
        let priceCount = 0;

        hotelsInLocation.forEach((hotel) => {
          if (hotel.rooms) {
            hotel.rooms.forEach((room) => {
              if (room.defaultPrice > 0) {
                totalValidPrices += room.defaultPrice;
                priceCount++;
              }
            });
          }
        });

        const avgPrice =
          priceCount > 0 ? Math.round(totalValidPrices / priceCount) : 0;

        // Find temples in this location (if any)
        const temples = new Set<string>();
        hotelsInLocation.forEach((hotel) => {
          if (hotel.temples && hotel.temples.length > 0) {
            hotel.temples.forEach((temple) => {
              if (temple && temple.name) temples.add(temple.name);
            });
          }
        });

        const topTemples = Array.from(temples).slice(0, 2);

        return {
          location,
          hotelCount: hotelsInLocation.length,
          avgPrice,
          temples: topTemples,
        };
      });

      console.log(`Created ${enhancedSuggestions.length} enhanced suggestions`);

      // Update both state variables
      setLocationSuggestions(enhancedSuggestions.map((s) => s.location));
      setEnhancedSuggestions(enhancedSuggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    } finally {
      setIsSuggestionsLoading(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    console.log(`Location selected: ${location}`);

    // Update the search query
    setSearchQuery(location);

    // Clear suggestions immediately
    setLocationSuggestions([]);
    setEnhancedSuggestions([]);

    // Perform the search with a small delay to allow the UI to update
    setTimeout(() => {
      console.log(`Performing search for selected location: ${location}`);
      handleSearch(location);
    }, 100);
  };

  const handleSearch = async (overrideQuery?: string) => {
    const queryToUse = overrideQuery || searchQuery;

    if (!queryToUse.trim() || !allHotels) {
      console.log("No query to search or no hotels data");
      return;
    }

    console.log(`Starting search for: "${queryToUse}"`);
    setIsLoading(true);
    setError(null);
    console.log(`Searching for hotels in: "${queryToUse}"`);
    console.log(`Total hotels in database: ${allHotels.length}`);

    try {
      // Rest of the function remains the same, just replace searchQuery with queryToUse
      const availableLocations = [
        ...new Set(
          allHotels.map((hotel) => hotel.city || hotel.location).filter(Boolean)
        ),
      ];
      console.log("Available locations:", availableLocations);

      // First try exact match
      const exactMatches = allHotels.filter((hotel) => {
        const hotelLocation = (
          hotel.city ||
          hotel.location ||
          ""
        ).toLowerCase();
        const searchTerm = queryToUse.toLowerCase();
        return hotelLocation === searchTerm;
      });

      if (exactMatches.length > 0) {
        console.log(
          `Found ${exactMatches.length} exact matches for "${queryToUse}"`
        );
        setSearchResults(exactMatches);
        setIsLoading(false);
        return;
      }

      // Then try contains match
      const partialMatches = allHotels.filter((hotel) => {
        const hotelLocation = (
          hotel.city ||
          hotel.location ||
          ""
        ).toLowerCase();
        const searchTerm = queryToUse.toLowerCase();
        return (
          hotelLocation.includes(searchTerm) ||
          searchTerm.includes(hotelLocation)
        );
      });

      if (partialMatches.length > 0) {
        console.log(
          `Found ${partialMatches.length} partial location matches for "${queryToUse}"`
        );
        setSearchResults(partialMatches);
        setIsLoading(false);
        return;
      }

      // If no location matches, search in hotel name and description
      const contentMatches = allHotels.filter((hotel) => {
        const nameMatch = hotel.name
          .toLowerCase()
          .includes(queryToUse.toLowerCase());
        const descMatch = hotel.description
          ?.toLowerCase()
          .includes(queryToUse.toLowerCase());

        // Also check temple names
        const templeMatch = hotel.temples?.some((temple) =>
          temple.name.toLowerCase().includes(queryToUse.toLowerCase())
        );

        return nameMatch || descMatch || templeMatch;
      });

      if (contentMatches.length > 0) {
        console.log(
          `Found ${contentMatches.length} hotels with "${queryToUse}" in name/description/temples`
        );
        setSearchResults(contentMatches);
      } else {
        console.log(`No matches found for "${queryToUse}"`);

        // If still no results, try fuzzy matching
        const fuzzyMatches = allHotels.filter((hotel) => {
          const hotelLocation = (
            hotel.city ||
            hotel.location ||
            ""
          ).toLowerCase();
          return (
            levenshteinDistance(hotelLocation, queryToUse.toLowerCase()) <= 3
          );
        });

        if (fuzzyMatches.length > 0) {
          console.log(
            `Found ${fuzzyMatches.length} fuzzy matches for "${queryToUse}"`
          );
          setSearchResults(fuzzyMatches);
        } else {
          setSearchResults([]);
        }
      }
    } catch (err) {
      setError("Failed to find hotels for this location. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate string similarity
  const levenshteinDistance = (a: string, b: string): number => {
    const matrix = Array(b.length + 1)
      .fill(null)
      .map(() => Array(a.length + 1).fill(null));

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[b.length][a.length];
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleHotelSelect = (hotelId: string) => {
    if (onHotelSelect) {
      onHotelSelect(hotelId);
    }
  };

  // Find the lowest room price for a hotel
  const getLowestRoomPrice = (hotel: HotelType): number => {
    if (!hotel.rooms || hotel.rooms.length === 0) return 0;

    const prices = hotel.rooms.map((room) => room.defaultPrice);
    return Math.min(...prices);
  };

  // Extract facilities from a hotel
  const getHotelAmenities = (hotel: HotelType): string[] => {
    return hotel.facilities || [];
  };

  const filteredResults = searchResults
    .filter((hotel) => {
      // Find lowest room price
      const lowestPrice = getLowestRoomPrice(hotel);

      // Filter by price range
      const priceInRange =
        lowestPrice >= priceRange[0] && lowestPrice <= priceRange[1];

      // Filter by amenities
      const hotelAmenities = getHotelAmenities(hotel);
      const hasSelectedAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((amenity) => hotelAmenities.includes(amenity));

      return priceInRange && hasSelectedAmenities;
    })
    .sort((a, b) => {
      // Sort by selected criteria
      if (sortBy === "price") {
        return getLowestRoomPrice(a) - getLowestRoomPrice(b);
      } else {
        // rating
        return (b.starRating || 0) - (a.starRating || 0);
      }
    });

  // Popular search terms
  const popularSearches = [
    "Tirupati",
    "Varanasi",
    "Mathura",
    "Vrindavan",
    "Ayodhya",
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Find the Best Hotel Prices
      </h2>

      {/* Search Section */}
      <div className="mb-8">
        <div className="relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter a location (e.g., Tirupati, Varanasi)"
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              autoComplete="off"
            />
            {isSuggestionsLoading && (
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-5 w-5 border-2 border-[#6A5631] border-t-transparent rounded-full"></div>
              </div>
            )}
            <button
              onClick={() => handleSearch()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-[#6A5631] text-white rounded-lg hover:bg-[#5A4728] transition-colors duration-200"
            >
              Search
            </button>
          </div>

          {/* Location suggestions dropdown */}
          {(locationSuggestions.length > 0 || isSuggestionsLoading) && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-72 overflow-y-auto">
              <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 text-sm text-gray-600 flex justify-between items-center">
                <span>Suggested locations:</span>
                {isSuggestionsLoading && (
                  <div className="animate-spin h-4 w-4 border-2 border-[#6A5631] border-t-transparent rounded-full"></div>
                )}
              </div>

              {isSuggestionsLoading && locationSuggestions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Finding locations...
                </div>
              ) : locationSuggestions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No matching locations found
                </div>
              ) : (
                enhancedSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.location}
                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                    onClick={() => handleLocationSelect(suggestion.location)}
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 text-[#6A5631]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="font-medium">{suggestion.location}</span>
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {suggestion.hotelCount} hotels
                      </span>
                    </div>

                    {suggestion.avgPrice > 0 && (
                      <div className="mt-1 ml-6 text-xs text-gray-500">
                        Average price: ₹{suggestion.avgPrice.toLocaleString()}{" "}
                        per night
                      </div>
                    )}

                    {suggestion.temples.length > 0 && (
                      <div className="mt-1 ml-6 text-xs text-gray-500">
                        Near: {suggestion.temples.join(", ")}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Popular searches */}
        {!searchQuery && !locationSuggestions.length && (
          <div className="mt-3">
            <div className="text-sm text-gray-600 mb-2">Popular searches:</div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors duration-150"
                  onClick={() => {
                    setSearchQuery(term);
                    handleLocationSelect(term);
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isLoading || isLoadingHotels ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6A5631]"></div>
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p className="font-medium">{error}</p>
            <button
              onClick={() => handleSearch()}
              className="mt-3 px-4 py-2 bg-[#6A5631] text-white rounded-lg hover:bg-[#5A4728] transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : filteredResults.length > 0 ? (
        <>
          {/* Filters Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-4 items-start">
              <div className="flex-1 min-w-[250px]">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Price Range (₹)
                </h3>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    className="w-24 p-2 border border-gray-300 rounded"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([
                        parseInt(e.target.value) || 0,
                        priceRange[1],
                      ])
                    }
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="0"
                    className="w-24 p-2 border border-gray-300 rounded"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        parseInt(e.target.value) || 0,
                      ])
                    }
                  />
                </div>
              </div>

              <div className="flex-1 min-w-[250px]">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </h3>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "price" | "rating")
                  }
                >
                  <option value="price">Price (Low to High)</option>
                  <option value="rating">Rating (High to Low)</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Amenities
              </h3>
              <div className="flex flex-wrap gap-2">
                {amenitiesOptions.map((amenity) => (
                  <label key={amenity} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-[#6A5631]"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Found {filteredResults.length} hotels in {searchQuery}
            </p>

            {filteredResults.map((hotel) => {
              const lowestRoomPrice = getLowestRoomPrice(hotel);
              const locationAvgPrice =
                locationStats[searchQuery]?.averagePrice || 0;
              const isBelowAverage =
                locationAvgPrice > 0 && lowestRoomPrice < locationAvgPrice;
              const percentBelow =
                locationAvgPrice > 0
                  ? Math.round(
                      ((locationAvgPrice - lowestRoomPrice) /
                        locationAvgPrice) *
                        100
                    )
                  : 0;
              const isDealPrice = percentBelow >= 15; // 15% or more below average is a good deal

              return (
                <div
                  key={hotel._id}
                  className={`border ${
                    isDealPrice ? "border-green-300" : "border-gray-200"
                  } rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                    isDealPrice ? "bg-green-50" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4 h-48 md:h-auto relative">
                      <img
                        src={
                          hotel.imageUrls[0] ||
                          "https://via.placeholder.com/300x200?text=No+Image"
                        }
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      {isDealPrice && (
                        <div className="absolute top-0 left-0 bg-green-500 text-white px-2 py-1 rounded-br text-sm font-medium">
                          Deal!
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {hotel.name}
                        </h3>
                        <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded text-blue-800">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium">
                            {hotel.starRating}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {hotel.city || hotel.location}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {hotel.facilities.slice(0, 5).map((facility) => (
                          <span
                            key={facility}
                            className="inline-block bg-gray-100 px-2 py-1 text-xs text-gray-800 rounded"
                          >
                            {facility}
                          </span>
                        ))}
                        {hotel.facilities.length > 5 && (
                          <span className="inline-block bg-gray-100 px-2 py-1 text-xs text-gray-800 rounded">
                            +{hotel.facilities.length - 5} more
                          </span>
                        )}
                      </div>
                      {hotel.temples && hotel.temples.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Nearby temples: </span>
                          {hotel.temples.slice(0, 2).map((temple, idx) => (
                            <span key={idx}>
                              {temple.name} ({temple.distance}km)
                              {idx < 1 && hotel.temples.length > 1 ? ", " : ""}
                            </span>
                          ))}
                          {hotel.temples.length > 2 && (
                            <span> and {hotel.temples.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col justify-between bg-gray-50">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">per night from</p>
                        <p
                          className={`text-2xl font-bold ${
                            isDealPrice ? "text-green-600" : "text-[#6A5631]"
                          }`}
                        >
                          ₹{lowestRoomPrice}
                        </p>

                        {isBelowAverage && (
                          <div className="flex flex-col items-end">
                            <p
                              className={`text-xs ${
                                isDealPrice
                                  ? "text-green-600 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {percentBelow}% below average!
                            </p>
                            <p className="text-xs text-gray-500 line-through">
                              Avg: ₹{locationAvgPrice}
                            </p>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleHotelSelect(hotel._id)}
                        className={`mt-4 w-full px-4 py-2 ${
                          isDealPrice
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-[#6A5631] hover:bg-[#5A4728]"
                        } text-white rounded-lg transition-colors duration-200`}
                      >
                        View Deal
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : searchQuery ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No hotels found matching your criteria.
          </p>
          <p className="mt-2 text-gray-500">
            Try adjusting your filters or search for another location.
          </p>
        </div>
      ) : (
        // Popular destinations to search
        <div className="py-4">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Popular Destinations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularLocations.map((location) => {
              // Calculate how good the deals are at this location
              const dealScore =
                location.averagePrice > 0
                  ? Math.round(
                      ((location.maxPrice - location.minPrice) /
                        location.averagePrice) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={location.location}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200 shadow-sm"
                  onClick={() => handleLocationSelect(location.location)}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800 text-lg">
                      {location.location}
                    </h4>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {location.hotelCount} hotels
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm font-medium text-[#6A5631]">
                      From ₹{location.minPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Avg: ₹{location.averagePrice.toLocaleString()}
                    </div>
                  </div>

                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#6A5631] h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, dealScore)}%` }}
                    ></div>
                  </div>

                  <div className="mt-2 flex justify-between text-xs">
                    <span className="text-gray-500">Price range</span>
                    {dealScore >= 30 && (
                      <span className="text-green-600 font-medium">
                        Great deal potential!
                      </span>
                    )}
                  </div>

                  <button className="mt-3 w-full text-[#6A5631] border border-[#6A5631] rounded-lg px-3 py-1.5 text-sm hover:bg-[#6A5631] hover:text-white transition-colors duration-200">
                    Explore Deals
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Information Section */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          How to Find the Best Hotel Deals
        </h3>
        <p className="text-sm text-gray-600">
          Enter your desired location to see available hotels sorted by price.
          Use filters to refine your search based on amenities and price range.
          We'll highlight deals that are below the average price for that
          location. For the best prices, try booking 2-3 months in advance or
          check for last-minute deals.
        </p>
      </div>
    </div>
  );
};

export default PriceComparisonByLocation;
