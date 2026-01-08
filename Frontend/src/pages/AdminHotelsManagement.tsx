import { useQuery, useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { HotelType } from "../../../backend/src/shared/types";

const AdminHotelsManagement = () => {
  const { showToast } = useAppContext();
  const queryClient = useQueryClient();
  const [selectedHotel, setSelectedHotel] = useState<HotelType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "archive">("all");

  const { data: hotels, isLoading } = useQuery(
    "fetchAllHotelsAdmin",
    apiClient.fetchAllHotelsAdmin,
    {
      onError: () => {
        showToast({ message: "Error fetching hotels", type: "ERROR" });
      },
    }
  );

  const { mutate: updateHotel, isLoading: isUpdating } = useMutation(
    apiClient.updateHotelByIdAdmin,
    {
      onSuccess: () => {
        showToast({ message: "Hotel updated successfully!", type: "SUCCESS" });
        queryClient.invalidateQueries("fetchAllHotelsAdmin");
        setSelectedHotel(null);
      },
      onError: () => {
        showToast({ message: "Error updating hotel", type: "ERROR" });
      },
    }
  );

  const handleEdit = (hotel: HotelType) => {
    setSelectedHotel(hotel);
  };

  const handleSave = (hotelFormData: FormData) => {
    updateHotel(hotelFormData);
  };

  const handleCancel = () => {
    setSelectedHotel(null);
  };

  // Filter hotels based on search term and status
  const filteredHotels = hotels?.filter((hotel) => {
    const matchesSearch =
      hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || hotel.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (selectedHotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4">
          <div className="mb-6">
            <button
              onClick={handleCancel}
              className="flex items-center text-[#6A5631] hover:text-[#5A4728] font-semibold mb-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Hotel List
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              Editing: {selectedHotel.name}
            </h2>
          </div>
          <ManageHotelForm
            hotel={selectedHotel}
            onSave={handleSave}
            isLoading={isUpdating}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            All Hotels Management
          </h1>
          <p className="text-gray-600">
            Manage and edit all hotels in the system
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Hotels
              </label>
              <input
                type="text"
                placeholder="Search by name, location, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "all" | "active" | "archive"
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="archive">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        {hotels && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Hotels</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {hotels.length}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Active Hotels</p>
                  <p className="text-3xl font-bold text-green-600">
                    {hotels.filter((h) => h.status === "active").length}
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Archived Hotels</p>
                  <p className="text-3xl font-bold text-gray-600">
                    {hotels.filter((h) => h.status === "archive").length}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hotels List */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6A5631]"></div>
          </div>
        ) : filteredHotels && filteredHotels.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600 text-sm uppercase">
                    <th className="py-4 px-6 font-semibold">Hotel</th>
                    <th className="py-4 px-6 font-semibold">Location</th>
                    <th className="py-4 px-6 font-semibold">City/Country</th>
                    <th className="py-4 px-6 font-semibold">Type</th>
                    <th className="py-4 px-6 font-semibold">Rooms</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredHotels.map((hotel) => (
                    <tr
                      key={hotel._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          {hotel.imageUrls && hotel.imageUrls.length > 0 && (
                            <img
                              src={hotel.imageUrls[0]}
                              alt={hotel.name}
                              className="w-16 h-16 object-cover rounded-lg mr-4"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">
                              {hotel.name}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {hotel.description?.substring(0, 60)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-800">{hotel.location}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-800">
                          {hotel.city || "N/A"}, {hotel.country || "N/A"}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {hotel.type}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-800">
                          {hotel.rooms?.length || 0} categories
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            hotel.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {hotel.status || "active"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleEdit(hotel)}
                          className="px-4 py-2 bg-[#6A5631] text-white rounded-lg hover:bg-[#5A4728] transition-colors duration-200 font-semibold"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden divide-y divide-gray-100">
              {filteredHotels.map((hotel) => (
                <div key={hotel._id} className="p-6">
                  <div className="flex items-start space-x-4">
                    {hotel.imageUrls && hotel.imageUrls.length > 0 && (
                      <img
                        src={hotel.imageUrls[0]}
                        alt={hotel.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {hotel.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {hotel.location}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {hotel.type}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            hotel.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {hotel.status || "active"}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {hotel.rooms?.length || 0} rooms
                        </span>
                      </div>
                      <button
                        onClick={() => handleEdit(hotel)}
                        className="w-full mt-2 px-4 py-2 bg-[#6A5631] text-white rounded-lg hover:bg-[#5A4728] transition-colors duration-200 font-semibold"
                      >
                        Edit Hotel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-gray-300 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No Hotels Found
            </h2>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No hotels have been added to the system yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHotelsManagement;
