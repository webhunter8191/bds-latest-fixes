// import React, { useState } from "react";
// import { useFormContext } from "react-hook-form";
// import { HotelFormData } from "./ManageHotelForm";
// import { Dialog } from "@headlessui/react";

// type existingRooms = {
//   category: string;
//   totalRooms: number;
//   price: number;
//   images: string[];
//   features: string[];
//   availableRooms: number;
//   adultCount: number;
//   childCount: number;
// };

// const GuestsSection = ({
//   existingRooms,
// }: {
//   existingRooms: existingRooms[];
// }) => {
//   const { setValue } = useFormContext<HotelFormData>();

//   const [showRooms, setShowRooms] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
//   const categories = [
//     { value: 1, label: "2 Bed AC" },
//     { value: 2, label: "2 Bed Non-AC" },
//     { value: 3, label: "3 Bed AC" },
//     { value: 4, label: "3 Bed Non-AC" },
//     { value: 5, label: "4 Bed AC" },
//     { value: 6, label: "4 Bed Non-AC" },
//     { value: 7, label: "Community Hall" },
//   ];
//   const categoriesTitles: Record<string, string> = {
//     "1": "2 Bed AC",
//     "2": "2 Bed Non-AC",
//     "3": "3 Bed AC",
//     "4": "3 Bed Non-AC",
//     "5": "4 Bed AC",
//     "6": "4 Bed Non-AC",
//     "7": "Community Hall",
//   };
//   console.log("rooms in GuestsSection", rooms);

//   const toggleRoomsVisibility = () => {
//     setShowRooms((prev) => !prev);
//   };

//   React.useEffect(() => {
//     if (existingRooms) {
//       setRooms(existingRooms);
//     }
//   }, [existingRooms]);

//   const handleSaveRoom = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     event.stopPropagation();
//     const formData = new FormData(event.target as HTMLFormElement);

//     // Get the new uploaded files
//     const newImages = formData.getAll("images");
//     console.log("newImages in handleSaveRoom", newImages);
//     // If editing, combine existing images with new uploads (if any)
//     let finalImages: string[] = [];
//     if (
//       newImages.length > 0 &&
//       (newImages[0] instanceof File ? newImages[0].name !== "" : false)
//     ) {
//       finalImages = Array.from(newImages) as string[];
//     } else if (editingRoomIndex !== null) {
//       finalImages = rooms[editingRoomIndex].images;
//     }

//     const newRoom = {
//       category: formData.get("category"),
//       totalRooms: Number(formData.get("totalRooms")),
//       availableRooms: Number(formData.get("totalRooms")),
//       price: Number(formData.get("price")),
//       images: finalImages,
//       adultCount: Number(formData.get("adultCount")),
//       childCount: Number(formData.get("childCount")),
//     };

//     if (editingRoomIndex !== null) {
//       const updatedRooms = [...rooms];
//       updatedRooms[editingRoomIndex] = newRoom;
//       setValue("rooms", updatedRooms);
//       setRooms(updatedRooms);
//       setEditingRoomIndex(null);
//     } else {
//       setValue("rooms", [...rooms, newRoom]);
//       setRooms([...rooms, newRoom]);
//     }

//     setIsDialogOpen(false);
//   };

//   const handleEditRoom = (index: number | null) => {
//     setEditingRoomIndex(index);
//     setIsDialogOpen(true);
//   };

//   const handleDeleteRoom = (index: number) => {
//     setRooms((prevValue) => {
//       const updatedRooms = prevValue.filter((_, i) => i !== index);
//       setValue("rooms", updatedRooms);
//       return updatedRooms;
//     });
//   };

//   return (
//     <div className="mb-8">
//       <h2 className="text-2xl font-semibold mb-4">Guests</h2>
//       <div className="flex items-center mt-4">
//         <span className="mr-2 text-gray-700">Show Rooms</span>
//         <button
//           onClick={toggleRoomsVisibility}
//           className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
//             showRooms ? "bg-green-500" : "bg-gray-300"
//           }`}
//         >
//           <div
//             className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
//               showRooms ? "translate-x-6" : "translate-x-0"
//             }`}
//           ></div>
//         </button>
//       </div>
//       <button
//         onClick={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//           setIsDialogOpen(true);
//         }}
//         className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
//       >
//         Add Rooms
//       </button>
//       <div className="mt-6">
//         {rooms.map(
//           (
//             room: {
//               category: string;
//               totalRooms: number;
//               price: number;
//               images: string[] | File[];
//               adultCount: number;
//               childCount: number;
//             },
//             index
//           ) => (
//             <div key={index} className="p-4 border rounded-lg mb-4">
//               <h3 className="font-semibold">
//                 Category: {categoriesTitles[room.category]}
//               </h3>
//               <p>Total Rooms: {room.totalRooms}</p>
//               <p>Price: {room.price}</p>
//               <p>Adult Count: {room.adultCount}</p>
//               <p>Child Count: {room.childCount}</p>
//               <div className="flex gap-2 mt-2">
//                 {room.images &&
//                   room.images.map((image: string | File, i: number) =>
//                     image &&
//                     (typeof image === "string" || image instanceof File) ? (
//                       <img
//                         key={i}
//                         src={
//                           image instanceof File
//                             ? URL.createObjectURL(image)
//                             : image
//                         }
//                         alt="Room"
//                         className="w-16 h-16 rounded object-cover"
//                       />
//                     ) : null
//                   )}
//               </div>
//               <div className="mt-2 flex gap-2">
//                 <button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     handleEditRoom(index);
//                   }}
//                   className="bg-yellow-500 text-white py-1 px-3 rounded-lg"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.preventDefault();
//                     e.stopPropagation();
//                     handleDeleteRoom(index);
//                   }}
//                   className="bg-red-500 text-white py-1 px-3 rounded-lg"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           )
//         )}
//       </div>
//       {/* Room Dialog */}
//       <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">
//               {editingRoomIndex !== null
//                 ? "Edit Room Category"
//                 : "Add Room Category"}
//             </h3>
//             <form onSubmit={handleSaveRoom}>
//               <label className="block mb-2">Category</label>
//               <select
//                 name="category"
//                 className="border w-full p-2 rounded"
//                 defaultValue={
//                   editingRoomIndex !== null
//                     ? rooms[editingRoomIndex].category
//                     : ""
//                 }
//               >
//                 {categories.map((category) => (
//                   <option key={category.value} value={category.value}>
//                     {category.label}
//                   </option>
//                 ))}
//               </select>
//               <label className="block mt-4">Number of Rooms</label>
//               <input
//                 name="totalRooms"
//                 type="number"
//                 className="border w-full p-2 rounded"
//                 defaultValue={
//                   editingRoomIndex !== null
//                     ? rooms[editingRoomIndex].totalRooms
//                     : ""
//                 }
//               />
//               <label className="block mt-4">Room Price</label>
//               <input
//                 name="price"
//                 type="number"
//                 className="border w-full p-2 rounded"
//                 defaultValue={
//                   editingRoomIndex !== null ? rooms[editingRoomIndex].price : ""
//                 }
//               />
//               <label className="block mt-4">Adult Count</label>
//               <input
//                 name="adultCount"
//                 type="number"
//                 className="border w-full p-2 rounded"
//                 defaultValue={
//                   editingRoomIndex !== null
//                     ? rooms[editingRoomIndex].adultCount
//                     : ""
//                 }
//               />
//               <label className="block mt-4">Child Count</label>
//               <input
//                 name="childCount"
//                 type="number"
//                 className="border w-full p-2 rounded"
//                 defaultValue={
//                   editingRoomIndex !== null
//                     ? rooms[editingRoomIndex].childCount
//                     : ""
//                 }
//               />
//               <label className="block mt-4">Upload Images</label>
//               <input
//                 name="images"
//                 type="file"
//                 multiple
//                 className="border w-full p-2 rounded"
//               />
//               {editingRoomIndex !== null && rooms[editingRoomIndex].images && (
//                 <div className="mt-2 flex gap-2">
//                   {rooms[editingRoomIndex].images.map(
//                     (image: string | File, i: number) =>
//                       image &&
//                       (typeof image === "string" || image instanceof File) ? (
//                         <img
//                           key={i}
//                           src={
//                             image instanceof File
//                               ? URL.createObjectURL(image)
//                               : image
//                           }
//                           alt="Room"
//                           className="w-16 h-16 rounded object-cover"
//                         />
//                       ) : null
//                   )}
//                 </div>
//               )}
//               <div className="mt-4 flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => setIsDialogOpen(false)}
//                   className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   onClick={(e) => e.stopPropagation()}
//                   className="bg-green-500 text-white py-2 px-4 rounded-lg"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default GuestsSection;

// import React, { useState, useEffect } from "react";
// import { useFormContext, Controller } from "react-hook-form";
// import { HotelFormData } from "./ManageHotelForm";
// import { Dialog } from "@headlessui/react";

// type existingRooms = {
//   category: string;
//   totalRooms: number;
//   price: number;
//   images: string[];
//   features: string[];
//   availableRooms: number;
//   adultCount: number;
//   childCount: number;
// };

// const GuestsSection = ({
//   existingRooms,
// }: {
//   existingRooms: existingRooms[];
// }) => {
//   const { setValue, control, watch } = useFormContext<HotelFormData>();

//   const [showRooms, setShowRooms] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [rooms, setRooms] = useState<any[]>([]);
//   const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
//   const [newPolicy, setNewPolicy] = useState("");

//   const categories = [
//     { value: 1, label: "2 Bed AC" },
//     { value: 2, label: "2 Bed Non-AC" },
//     { value: 3, label: "3 Bed AC" },
//     { value: 4, label: "3 Bed Non-AC" },
//     { value: 5, label: "4 Bed AC" },
//     { value: 6, label: "4 Bed Non-AC" },
//     { value: 7, label: "Community Hall" },
//   ];
//   const categoriesTitles: Record<string, string> = {
//     "1": "2 Bed AC",
//     "2": "2 Bed Non-AC",
//     "3": "3 Bed AC",
//     "4": "3 Bed Non-AC",
//     "5": "4 Bed AC",
//     "6": "4 Bed Non-AC",
//     "7": "Community Hall",
//   };

//   const toggleRoomsVisibility = () => {
//     setShowRooms((prev) => !prev);
//   };

//   useEffect(() => {
//     if (existingRooms) {
//       setRooms(existingRooms);
//     }
//   }, [existingRooms]);

//   const handleSaveRoom = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     event.stopPropagation();
//     const formData = new FormData(event.target as HTMLFormElement);

//     const newImages = formData.getAll("images");
//     let finalImages: string[] = [];
//     if (
//       newImages.length > 0 &&
//       (newImages[0] instanceof File ? newImages[0].name !== "" : false)
//     ) {
//       finalImages = Array.from(newImages) as string[];
//     } else if (editingRoomIndex !== null) {
//       finalImages = rooms[editingRoomIndex].images;
//     }

//     const newRoom = {
//       category: formData.get("category"),
//       totalRooms: Number(formData.get("totalRooms")),
//       availableRooms: Number(formData.get("totalRooms")),
//       price: Number(formData.get("price")),
//       images: finalImages,
//       adultCount: Number(formData.get("adultCount")),
//       childCount: Number(formData.get("childCount")),
//     };

//     if (editingRoomIndex !== null) {
//       const updatedRooms = [...rooms];
//       updatedRooms[editingRoomIndex] = newRoom;
//       setValue("rooms", updatedRooms);
//       setRooms(updatedRooms);
//       setEditingRoomIndex(null);
//     } else {
//       setValue("rooms", [...rooms, newRoom]);
//       setRooms([...rooms, newRoom]);
//     }

//     setIsDialogOpen(false);
//   };

//   const handleEditRoom = (index: number | null) => {
//     setEditingRoomIndex(index);
//     setIsDialogOpen(true);
//   };

//   const handleDeleteRoom = (index: number) => {
//     setRooms((prevValue) => {
//       const updatedRooms = prevValue.filter((_, i) => i !== index);
//       setValue("rooms", updatedRooms);
//       return updatedRooms;
//     });
//   };

//   return (
//     <div className="mb-8">
//       <h2 className="text-2xl font-semibold mb-4">Guests</h2>
//       <div className="flex items-center mt-4">
//         <span className="mr-2 text-gray-700">Show Rooms</span>
//         <button
//           onClick={toggleRoomsVisibility}
//           className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
//             showRooms ? "bg-green-500" : "bg-gray-300"
//           }`}
//         >
//           <div
//             className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
//               showRooms ? "translate-x-6" : "translate-x-0"
//             }`}
//           ></div>
//         </button>
//       </div>
//       <button
//         onClick={(e) => {
//           e.preventDefault();
//           e.stopPropagation();
//           setIsDialogOpen(true);
//         }}
//         className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
//       >
//         Add Rooms
//       </button>

//       <div className="mt-6">
//         {rooms.map((room, index) => (
//           <div key={index} className="p-4 border rounded-lg mb-4">
//             <h3 className="font-semibold">
//               Category: {categoriesTitles[room.category]}
//             </h3>
//             <p>Total Rooms: {room.totalRooms}</p>
//             <p>Price: {room.price}</p>
//             <p>Adult Count: {room.adultCount}</p>
//             <p>Child Count: {room.childCount}</p>
//             <div className="flex gap-2 mt-2">
//               {room.images &&
//                 room.images.map((image: string | File, i: number) =>
//                   image &&
//                   (typeof image === "string" || image instanceof File) ? (
//                     <img
//                       key={i}
//                       src={
//                         image instanceof File
//                           ? URL.createObjectURL(image)
//                           : image
//                       }
//                       alt="Room"
//                       className="w-16 h-16 rounded object-cover"
//                     />
//                   ) : null
//                 )}
//             </div>
//             <div className="mt-2 flex gap-2">
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   handleEditRoom(index);
//                 }}
//                 className="bg-yellow-500 text-white py-1 px-3 rounded-lg"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.preventDefault();
//                   e.stopPropagation();
//                   handleDeleteRoom(index);
//                 }}
//                 className="bg-red-500 text-white py-1 px-3 rounded-lg"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Hotel Policies Section */}
//       <div className="mt-10">
//         <h3 className="text-xl font-semibold mb-2">Hotel Policies</h3>
//         <Controller
//           name="policies"
//           control={control}
//           render={({ field }) => {
//             const policies = Array.isArray(field.value) ? field.value : [];
//             return (
//               <div>
//                 <div className="flex gap-2 mb-4">
//                   <input
//                     name="policy"
//                     type="text"
//                     className="w-full border p-2 rounded"
//                     placeholder="Enter a new policy"
//                     value={newPolicy}
//                     onChange={(e) => setNewPolicy(e.target.value)}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => {
//                       const trimmed = newPolicy.trim();
//                       if (trimmed) {
//                         const updated = [...policies, trimmed];
//                         field.onChange(updated);
//                         setNewPolicy("");
//                       }
//                     }}
//                     className="bg-blue-500 text-white px-4 rounded-lg"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <textarea
//                   readOnly
//                   value={policies
//                     .map((p: string, i: number) => `${i + 1}. ${p}`)
//                     .join("\n")}
//                   className="w-full h-32 p-2 border rounded bg-gray-100"
//                 />
//               </div>
//             );
//           }}
//         />
//       </div>

//       {/* Room Dialog */}
//       <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">
//               {editingRoomIndex !== null
//                 ? "Edit Room Category"
//                 : "Add Room Category"}
//             </h3>
//             <form onSubmit={handleSaveRoom}>
//               <label className="block mb-2">Category</label>
//               <select
//                 name="category"
//                 className="border w-full p-2 rounded"
//                 defaultValue={
//                   editingRoomIndex !== null
//                     ? rooms[editingRoomIndex].category
//                     : ""
//                 }
//               >
//                 {categories.map((category) => (
//                   <option key={category.value} value={category.value}>
//                     {category.label}
//                   </option>
//                 ))}
//               </select>
//               <label className="block mt-4">Number of Rooms</label>
//               <input
//                 name="totalRooms"
//                 type="number"
//                 className="border w-full p-2 rounded"
//                 defaultValue={
//                   editingRoomIndex !== null
//                     ? rooms[editingRoomIndex].totalRooms
//                     : ""
//                 }
//               />
//               <label className="block mt-4">Room Price</label>
//               <input
//                 name="price"
//                 type="number"
//                 className="border w-full p-2 rounded"
//                 defaultValue={
//                   editingRoomIndex !== null ? rooms[editingRoomIndex].price : ""
//                 }
//               />
//               <label className="block mt-4">Adult Count</label>
//               <input
//                 name="adultCount"
//                 type="number"
//                 className="border w-full p-2 rounded"
//                 defaultValue={
//                   editingRoomIndex !== null
//                     ? rooms[editingRoomIndex].adultCount
//                     : ""
//                 }
//               />
//               <label className="block mt-4">Child Count</label>
//               <input
//                 name="childCount"
//                 type="number"
//                 className="border w-full p-2 rounded"
//                 defaultValue={
//                   editingRoomIndex !== null
//                     ? rooms[editingRoomIndex].childCount
//                     : ""
//                 }
//               />
//               <label className="block mt-4">Upload Images</label>
//               <input
//                 name="images"
//                 type="file"
//                 multiple
//                 className="border w-full p-2 rounded"
//               />
//               {editingRoomIndex !== null && rooms[editingRoomIndex].images && (
//                 <div className="mt-2 flex gap-2">
//                   {rooms[editingRoomIndex].images.map(
//                     (image: string | File, i: number) =>
//                       image &&
//                       (typeof image === "string" || image instanceof File) ? (
//                         <img
//                           key={i}
//                           src={
//                             image instanceof File
//                               ? URL.createObjectURL(image)
//                               : image
//                           }
//                           alt="Room"
//                           className="w-16 h-16 rounded object-cover"
//                         />
//                       ) : null
//                   )}
//                 </div>
//               )}
//               <div className="mt-4 flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => setIsDialogOpen(false)}
//                   className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   onClick={(e) => e.stopPropagation()}
//                   className="bg-green-500 text-white py-2 px-4 rounded-lg"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default GuestsSection;

import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import { Dialog } from "@headlessui/react";

type existingRooms = {
  category: string;
  totalRooms: number;
  price: number;
  images: string[];
  features: string[];
  availableRooms: number;
  adultCount: number;
  childCount: number;
};

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

    const newRoom = {
      category: formData.get("category"),
      totalRooms: Number(formData.get("totalRooms")),
      availableRooms: Number(formData.get("totalRooms")),
      price: Number(formData.get("price")),
      images: finalImages,
      adultCount: Number(formData.get("adultCount")),
      childCount: Number(formData.get("childCount")),
    };

    if (editingRoomIndex !== null) {
      const updatedRooms = [...rooms];
      updatedRooms[editingRoomIndex] = newRoom;
      setValue("rooms", updatedRooms);
      setRooms(updatedRooms);
      setEditingRoomIndex(null);
    } else {
      setValue("rooms", [...rooms, newRoom]);
      setRooms([...rooms, newRoom]);
    }

    setIsDialogOpen(false);
  };

  const handleEditRoom = (index: number | null) => {
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

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Guests</h2>
      <div className="flex items-center mt-4">
        <span className="mr-2 text-gray-700">Show Rooms</span>
        <button
          onClick={toggleRoomsVisibility}
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${
            showRooms ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
              showRooms ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
        </button>
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDialogOpen(true);
        }}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
      >
        Add Rooms
      </button>
      <div className="mt-6">
        {rooms.map((room, index) => (
          <div key={index} className="p-4 border rounded-lg mb-4">
            <h3 className="font-semibold">
              Category: {categoriesTitles[room.category]}
            </h3>
            <p>Total Rooms: {room.totalRooms}</p>
            <p>Price: {room.price}</p>
            <p>Adult Count: {room.adultCount}</p>
            <p>Child Count: {room.childCount}</p>
            <div className="flex gap-2 mt-2">
              {room.images &&
                room.images.map((image: string | File, i: number) =>
                  image &&
                  (typeof image === "string" || image instanceof File) ? (
                    <img
                      key={i}
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      alt="Room"
                      className="w-16 h-16 rounded object-cover"
                    />
                  ) : null
                )}
            </div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleEditRoom(index);
                }}
                className="bg-yellow-500 text-white py-1 px-3 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDeleteRoom(index);
                }}
                className="bg-red-500 text-white py-1 px-3 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Hotel Policies Section */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">Hotel Policies</h3>
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
              <div>
                <div className="flex gap-2 mb-4">
                  <input
                    name="policy"
                    type="text"
                    className="w-full border p-2 rounded"
                    placeholder="Enter a new policy"
                    value={newPolicy}
                    onChange={(e) => setNewPolicy(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleAddPolicy}
                    className="bg-blue-500 text-white px-4 rounded-lg"
                  >
                    Add
                  </button>
                </div>

                <ul className="space-y-2">
                  {policies.map((policy, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 border rounded p-2"
                    >
                      <input
                        type="text"
                        className="flex-grow border rounded px-2 py-1"
                        value={policy}
                        onChange={(e) =>
                          handlePolicyChange(index, e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => handleDeletePolicy(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }}
        />
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">Nearby Temples</h3>
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
                    className="flex gap-2 items-center border rounded p-2"
                  >
                    <input
                      type="text"
                      placeholder="Temple name"
                      className="flex-grow border p-2 rounded"
                      value={temple.name}
                      onChange={(e) =>
                        handleTempleChange(index, "name", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Distance (km)"
                      className="w-32 border p-2 rounded"
                      value={temple.distance}
                      onChange={(e) =>
                        handleTempleChange(index, "distance", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTemple(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddTemple}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Add Temple
                </button>
              </div>
            );
          }}
        />
      </div>
      {/* Room Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editingRoomIndex !== null
                ? "Edit Room Category"
                : "Add Room Category"}
            </h3>
            <form onSubmit={handleSaveRoom}>
              <label className="block mb-2">Category</label>
              <select
                name="category"
                className="border w-full p-2 rounded"
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
              <label className="block mt-4">Number of Rooms</label>
              <input
                name="totalRooms"
                type="number"
                className="border w-full p-2 rounded"
                defaultValue={
                  editingRoomIndex !== null
                    ? rooms[editingRoomIndex].totalRooms
                    : ""
                }
              />
              <label className="block mt-4">Room Price</label>
              <input
                name="price"
                type="number"
                className="border w-full p-2 rounded"
                defaultValue={
                  editingRoomIndex !== null ? rooms[editingRoomIndex].price : ""
                }
              />
              <label className="block mt-4">Adult Count</label>
              <input
                name="adultCount"
                type="number"
                className="border w-full p-2 rounded"
                defaultValue={
                  editingRoomIndex !== null
                    ? rooms[editingRoomIndex].adultCount
                    : ""
                }
              />
              <label className="block mt-4">Child Count</label>
              <input
                name="childCount"
                type="number"
                className="border w-full p-2 rounded"
                defaultValue={
                  editingRoomIndex !== null
                    ? rooms[editingRoomIndex].childCount
                    : ""
                }
              />
              <label className="block mt-4">Upload Images</label>
              <input
                name="images"
                type="file"
                multiple
                className="border w-full p-2 rounded"
              />
              {editingRoomIndex !== null && rooms[editingRoomIndex].images && (
                <div className="mt-2 flex gap-2">
                  {rooms[editingRoomIndex].images.map(
                    (image: string | File, i: number) =>
                      image &&
                      (typeof image === "string" || image instanceof File) ? (
                        <img
                          key={i}
                          src={
                            image instanceof File
                              ? URL.createObjectURL(image)
                              : image
                          }
                          alt="Room"
                          className="w-16 h-16 rounded object-cover"
                        />
                      ) : null
                  )}
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default GuestsSection;
