import React, { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import { Dialog } from "@headlessui/react";
import PriceCalendarForm from "./PriceCalendarForm";

type existingRooms = {
  category: string;
  totalRooms: number;
  price: number;
  images: string[];
  availableRooms: number;
  adultCount: number;
  childCount: number;
  defaultPrice: number; // Default price for unspecified dates
  maxPrice?: number; // Maximum price threshold for commission calculation
  maxPriceSet?: boolean; // Flag to track if maxPrice has been set
  priceCalendar: { date: string; price: number; availableRooms: number }[]; // Dynamic pricing
  features: string[];
};

const PREDEFINED_FEATURES = [
  "AC",
  "LED TV",
  "Geyser",
  "Fan",
  "Free Breakfast",
  "Paid Breakfast",
  "WiFi",
  "Room Heater",
  "Balcony",
  "Mini Fridge",
  "Tea/Coffee Maker",
  "Wardrobe",
  "Attached Bathroom",
  "Hot Water",
  "Intercom",
  "Towels",
  "Toiletries",
];

const GuestsSection = ({
  existingRooms,
}: {
  existingRooms: existingRooms[];
}) => {
  const { setValue, control } = useFormContext<HotelFormData>();
  const [showRooms, setShowRooms] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
  const [newPolicy, setNewPolicy] = useState("");
  const [priceCalendarEntries, setPriceCalendarEntries] = useState<
    { date: string; price: number; availableRooms: number }[]
  >([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Function to calculate commission rate based on price and max price
  const calculateCommission = (price: number, maxPrice?: number): number => {
    if (!maxPrice) return 5; // Default 5% if no max price is set
    return price > maxPrice ? 10 : 5; // 10% if price exceeds max price, 5% otherwise
  };

  const categories = [
    { value: 1, label: "2 Bed AC" },
    { value: 2, label: "2 Bed Non-AC" },
    { value: 3, label: "3 Bed AC" },
    { value: 4, label: "3 Bed Non-AC" },
    { value: 5, label: "4 Bed AC" },
    { value: 6, label: "4 Bed Non-AC" },
    { value: 7, label: "Community Hall" },
  ];

  const categoriesTitles: Record<string, string> = {
    "1": "2 Bed AC",
    "2": "2 Bed Non-AC",
    "3": "3 Bed AC",
    "4": "3 Bed Non-AC",
    "5": "4 Bed AC",
    "6": "4 Bed Non-AC",
    "7": "Community Hall",
  };

  useEffect(() => {
    if (existingRooms) {
      setRooms(existingRooms);
    }
  }, [existingRooms]);

  const toggleRoomsVisibility = () => {
    setShowRooms((prev) => !prev);
  };

  const handleSaveRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(event.target as HTMLFormElement);

    // Get the new uploaded files
    const newImages = formData.getAll("images");
    let finalImages: string[] = [];
    if (
      newImages.length > 0 &&
      (newImages[0] instanceof File ? newImages[0].name !== "" : false)
    ) {
      finalImages = Array.from(newImages) as string[];
    } else if (editingRoomIndex !== null) {
      finalImages = rooms[editingRoomIndex].images;
    }

    // Preserve previous price calendar entries if editing and no new entries provided
    const finalPriceCalendar =
      priceCalendarEntries.length > 0
        ? priceCalendarEntries
        : editingRoomIndex !== null
        ? rooms[editingRoomIndex].priceCalendar || []
        : [];

    // Handle max price setting
    let maxPrice = Number(formData.get("maxPrice")) || undefined;
    let maxPriceSet = false;

    if (editingRoomIndex !== null) {
      // If editing an existing room
      if (rooms[editingRoomIndex].maxPriceSet) {
        // If maxPrice was already set, keep the original value
        maxPrice = rooms[editingRoomIndex].maxPrice;
        maxPriceSet = true;
      } else if (maxPrice) {
        // If maxPrice is being set for the first time
        maxPriceSet = true;
      }
    } else if (maxPrice) {
      // If creating a new room with maxPrice
      maxPriceSet = true;
    }

    // Ensure features are properly formatted
    console.log("Selected features before saving:", selectedFeatures);

    const newRoom = {
      category: formData.get("category"),
      totalRooms: Number(formData.get("totalRooms")),
      availableRooms: Number(formData.get("totalRooms")),
      price: Number(formData.get("price")),
      images: finalImages,
      adultCount: Number(formData.get("adultCount")),
      childCount: Number(formData.get("childCount")),
      defaultPrice: Number(formData.get("defaultPrice")),
      maxPrice,
      maxPriceSet,
      priceCalendar: finalPriceCalendar,
      features: selectedFeatures,
    };

    console.log("New room object:", newRoom);
    console.log("Room features data type:", typeof newRoom.features);
    console.log("Is features an array?", Array.isArray(newRoom.features));

    if (editingRoomIndex !== null) {
      const updatedRooms = [...rooms];
      updatedRooms[editingRoomIndex] = newRoom;
      console.log("Updated rooms:", updatedRooms);
      console.log(
        "Updated room features:",
        updatedRooms[editingRoomIndex].features
      );
      setValue("rooms", updatedRooms);
      setRooms(updatedRooms);
      setEditingRoomIndex(null);
    } else {
      const newRooms = [...rooms, newRoom];
      console.log("New rooms array:", newRooms);
      console.log("New room features:", newRoom.features);
      setValue("rooms", newRooms);
      setRooms(newRooms);
    }

    // Clear state after saving
    setPriceCalendarEntries([]);
    setSelectedFeatures([]);
    setIsDialogOpen(false);
  };

  const handleEditRoom = (index: number | null) => {
    if (index !== null) {
      setPriceCalendarEntries(
        (rooms[index].priceCalendar || []).map((entry: any) => ({
          ...entry,
          date:
            typeof entry.date === "string"
              ? entry.date.substring(0, 10)
              : new Date(entry.date).toISOString().substring(0, 10),
          availableRooms: entry.availableRooms ?? 0,
        }))
      );
      setSelectedFeatures(rooms[index].features || []);
    } else {
      // Reset features when adding a new room
      setSelectedFeatures([]);
    }
    setEditingRoomIndex(index);
    setIsDialogOpen(true);
  };

  const handleDeleteRoom = (index: number) => {
    setRooms((prevValue) => {
      const updatedRooms = prevValue.filter((_, i) => i !== index);
      setValue("rooms", updatedRooms);
      return updatedRooms;
    });
  };

  const handleAvailableRoomsChange = (index: number, value: string) => {
    const updatedEntries = [...priceCalendarEntries];
    updatedEntries[index].availableRooms = Number(value);
    setPriceCalendarEntries(updatedEntries);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Guests</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Show Rooms</span>
            <button
              onClick={toggleRoomsVisibility}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                showRooms ? "bg-[#6A5631]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                  showRooms ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </button>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPriceCalendarEntries([]);
            setSelectedFeatures([]);
            setEditingRoomIndex(null);
            setIsDialogOpen(true);
          }}
          className="w-full sm:w-auto px-6 py-3 bg-[#6A5631] text-white rounded-lg hover:bg-[#5A4728] transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Room Category
        </button>

        <div className="mt-6 space-y-6">
          {rooms.map((room, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 border border-gray-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {categoriesTitles[room.category]}
                </h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEditRoom(index);
                    }}
                    className="px-4 py-2 bg-[#6A5631] text-white rounded-lg hover:bg-[#5A4728] transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteRoom(index);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-600">Total Rooms</span>
                  <p className="text-lg font-semibold text-gray-800">
                    {room.totalRooms}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-600">Regular Price</span>
                  <p className="text-lg font-semibold text-[#6A5631]">
                    ₹{room.defaultPrice}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-600">Max Price</span>
                  <p className="text-lg font-semibold text-[#6A5631]">
                    ₹{room.maxPrice || "Not set"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-600">Commission</span>
                  <p className="text-lg font-semibold text-gray-800">
                    {calculateCommission(room.defaultPrice, room.maxPrice)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-600">Adult Count</span>
                  <p className="text-lg font-semibold text-gray-800">
                    {room.adultCount}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-600">Child Count</span>
                  <p className="text-lg font-semibold text-gray-800">
                    {room.childCount}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Seasonal Price Calendar
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {room.priceCalendar && room.priceCalendar.length > 0 ? (
                    room.priceCalendar.map(
                      (
                        entry: {
                          date: string;
                          price: number;
                          availableRooms: number;
                        },
                        idx: number
                      ) => (
                        <div
                          key={idx}
                          className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">
                              {new Date(entry.date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </span>
                            <div className="flex justify-between mt-1">
                              <span className="text-sm text-gray-600">
                                Price:
                              </span>
                              <span className="text-sm font-semibold text-[#6A5631]">
                                ₹{entry.price}
                              </span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-sm text-gray-600">
                                Available:
                              </span>
                              <span className="text-sm font-medium text-gray-800">
                                {entry.availableRooms}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="col-span-full text-sm text-gray-500 italic">
                      No seasonal pricing set for this room
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Room Features
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {(room.features || []).map((feature: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md"
                    >
                      <span className="w-2 h-2 bg-[#6A5631] rounded-full"></span>
                      {feature}
                    </div>
                  ))}
                  {(room.features || []).length === 0 && (
                    <div className="col-span-full text-sm text-gray-500 italic">
                      No features specified for this room
                    </div>
                  )}
                </div>
              </div>

              {room.images && room.images.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Room Images
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {room.images.map((image: string | File, i: number) =>
                      image &&
                      (typeof image === "string" || image instanceof File) ? (
                        <div key={i} className="aspect-square relative group">
                          <img
                            src={
                              image instanceof File
                                ? URL.createObjectURL(image)
                                : image
                            }
                            alt="Room"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : null
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hotel Policies Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Hotel Policies
        </h3>
        <Controller
          name="policies"
          control={control}
          render={({ field }) => {
            const policies = Array.isArray(field.value) ? field.value : [];

            const handlePolicyChange = (index: number, newValue: string) => {
              const updated = [...policies];
              updated[index] = newValue;
              field.onChange(updated);
            };

            const handleDeletePolicy = (index: number) => {
              const updated = policies.filter((_, i) => i !== index);
              field.onChange(updated);
            };

            const handleAddPolicy = () => {
              const trimmed = newPolicy.trim();
              if (trimmed) {
                field.onChange([...policies, trimmed]);
                setNewPolicy("");
              }
            };

            return (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    name="policy"
                    type="text"
                    className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
                    placeholder="Enter a new policy"
                    value={newPolicy}
                    onChange={(e) => setNewPolicy(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddPolicy}
                    className="px-6 py-3 bg-[#6A5631] text-white rounded-lg hover:bg-[#5A4728] transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {policies.map((policy, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 p-4 rounded-lg border border-gray-200"
                    >
                      <input
                        type="text"
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
                        value={policy}
                        onChange={(e) =>
                          handlePolicyChange(index, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleDeletePolicy(index)}
                        className="p-2 text-red-500 hover:text-red-600 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          }}
        />
      </div>

      {/* Nearby Temples Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Nearby Temples
        </h3>
        <Controller
          name="temples"
          control={control}
          render={({ field }) => {
            const temples = Array.isArray(field.value) ? field.value : [];

            const handleTempleChange = (
              index: number,
              key: "name" | "distance",
              value: string
            ) => {
              const updated = [...temples];
              updated[index] = {
                ...updated[index],
                [key]: key === "distance" ? Number(value) : value,
              };
              field.onChange(updated);
            };

            const handleAddTemple = () => {
              field.onChange([...temples, { name: "", distance: 0 }]);
            };

            const handleRemoveTemple = (index: number) => {
              const updated = temples.filter((_, i) => i !== index);
              field.onChange(updated);
            };

            return (
              <div className="space-y-4">
                {temples.map((temple, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <input
                      type="text"
                      placeholder="Temple name"
                      className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
                      value={temple.name}
                      onChange={(e) =>
                        handleTempleChange(index, "name", e.target.value)
                      }
                    />
                    <div className="flex gap-3">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Distance (km)"
                        className="w-32 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
                        value={temple.distance}
                        onChange={(e) =>
                          handleTempleChange(index, "distance", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveTemple(index)}
                        className="p-3 text-red-500 hover:text-red-600 transition-colors duration-200"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddTemple}
                  className="w-full sm:w-auto px-6 py-3 bg-[#6A5631] text-white rounded-lg hover:bg-[#5A4728] transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Temple
                </button>
              </div>
            );
          }}
        />
      </div>

      {/* Room Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {editingRoomIndex !== null
                  ? "Edit Room Category"
                  : "Add Room Category"}
              </h3>

              <form onSubmit={handleSaveRoom} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      name="category"
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
                      defaultValue={
                        editingRoomIndex !== null
                          ? rooms[editingRoomIndex].category
                          : ""
                      }
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Number of Rooms
                    </label>
                    <input
                      name="totalRooms"
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
                      defaultValue={
                        editingRoomIndex !== null
                          ? rooms[editingRoomIndex].totalRooms
                          : ""
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Regular Price
                    </label>
                    <input
                      name="defaultPrice"
                      type="number"
                      className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent ${
                        editingRoomIndex !== null &&
                        rooms[editingRoomIndex].maxPrice &&
                        rooms[editingRoomIndex].defaultPrice >
                          rooms[editingRoomIndex].maxPrice
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-300"
                      }`}
                      defaultValue={
                        editingRoomIndex !== null
                          ? rooms[editingRoomIndex].defaultPrice
                          : ""
                      }
                      onChange={(e) => {
                        if (editingRoomIndex !== null) {
                          const updatedRooms = [...rooms];
                          updatedRooms[editingRoomIndex] = {
                            ...updatedRooms[editingRoomIndex],
                            defaultPrice: Number(e.target.value),
                          };
                          setRooms(updatedRooms);
                        }
                      }}
                    />
                    {editingRoomIndex !== null &&
                      rooms[editingRoomIndex].maxPrice &&
                      rooms[editingRoomIndex].defaultPrice >
                        rooms[editingRoomIndex].maxPrice && (
                        <div className="text-xs text-orange-600 mt-1">
                          Price exceeds max price (₹
                          {rooms[editingRoomIndex].maxPrice}) - 10% commission
                          applies
                        </div>
                      )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Maximum Price
                    </label>
                    <input
                      name="maxPrice"
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
                      defaultValue={
                        editingRoomIndex !== null
                          ? rooms[editingRoomIndex].maxPrice
                          : ""
                      }
                      disabled={
                        editingRoomIndex !== null &&
                        rooms[editingRoomIndex].maxPriceSet
                      }
                    />
                    <div className="mt-2 p-3 bg-blue-50 text-sm text-blue-800 rounded-md border border-blue-200">
                      <p>
                        <strong>Commission Info:</strong>
                      </p>
                      <ul className="list-disc pl-4 space-y-1 mt-1">
                        <li>5% commission if price is below max price</li>
                        <li>10% commission if price exceeds max price</li>
                        <li>
                          <strong>Note:</strong> Max price can only be set once
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Adult Count
                    </label>
                    <input
                      name="adultCount"
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
                      defaultValue={
                        editingRoomIndex !== null
                          ? rooms[editingRoomIndex].adultCount
                          : ""
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Child Count
                    </label>
                    <input
                      name="childCount"
                      type="number"
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
                      defaultValue={
                        editingRoomIndex !== null
                          ? rooms[editingRoomIndex].childCount
                          : ""
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Images
                    </label>
                    <input
                      name="images"
                      type="file"
                      multiple
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Seasonal Price Calendar
                  </label>
                  <PriceCalendarForm
                    priceCalendarEntries={priceCalendarEntries}
                    setPriceCalendarEntries={setPriceCalendarEntries}
                    handleAvailableRoomsChange={handleAvailableRoomsChange}
                    maxPrice={
                      editingRoomIndex !== null
                        ? rooms[editingRoomIndex]?.maxPrice
                        : undefined
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Room Features
                  </label>
                  <div className="space-y-4">
                    {/* Selected features display */}
                    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px]">
                      {selectedFeatures.length > 0 ? (
                        selectedFeatures.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-white px-3 py-2 rounded-md border border-gray-200 group"
                          >
                            <span className="text-sm text-gray-700">
                              {feature}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFeatures(
                                  selectedFeatures.filter((_, i) => i !== index)
                                );
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                          No features selected
                        </div>
                      )}
                    </div>

                    {/* Feature selection dropdown */}
                    <div className="flex items-center gap-2">
                      <select
                        className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6A5631] focus:border-transparent"
                        onChange={(e) => {
                          const feature = e.target.value;
                          if (feature && !selectedFeatures.includes(feature)) {
                            setSelectedFeatures([...selectedFeatures, feature]);
                          }
                          e.target.value = ""; // Reset the dropdown
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Add a feature
                        </option>
                        {PREDEFINED_FEATURES.filter(
                          (feature) => !selectedFeatures.includes(feature)
                        ).map((feature) => (
                          <option key={feature} value={feature}>
                            {feature}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setSelectedFeatures([])}
                        className="px-3 py-3 text-red-500 hover:text-red-700 border border-gray-300 rounded-lg"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A5631] transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => e.stopPropagation()}
                    className="px-6 py-3 bg-[#6A5631] text-white font-semibold rounded-lg hover:bg-[#5A4728] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6A5631] transition-colors duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default GuestsSection;
