// import { useFormContext } from "react-hook-form";
// import { HotelFormData } from "./ManageHotelForm";

// const GuestsSection = () => {
//   const {
//     register,
//     formState: { errors },
//   } = useFormContext<HotelFormData>();

//   return (
//     <div className="mb-8">
//       <h2 className="text-2xl font-semibold mb-4">Guests</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-100 p-6 rounded-lg">
//         <label className="text-gray-700 text-sm font-semibold">
//           Rooms
//           <input
//             className="border rounded w-full py-2 px-3 mt-2"
//             type="number"
//             min={1}
//             {...register("roomCount", {
//               required: "This field is required",
//             })}
//           />
//           {errors.roomCount?.message && (
//             <span className="text-red-500 text-sm font-medium mt-2 inline-block">
//               {errors.roomCount?.message}
//             </span>
//           )}
//         </label>

       
//       </div>
//     </div>
//   );
// };

// export default GuestsSection;

// import { useState } from "react";
// import { useFormContext } from "react-hook-form";
// import { HotelFormData } from "./ManageHotelForm";

// const GuestsSection = () => {
//   const {
//     register,
//     formState: { errors },
//   } = useFormContext<HotelFormData>();

//   const [showRooms, setShowRooms] = useState(true);

//   const toggleRoomsVisibility = () => {
//     setShowRooms((prev) => !prev);
//   };

//   return (
//     <div className="mb-8">
//       <h2 className="text-2xl font-semibold mb-4">Guests</h2>
// <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-100 p-6 rounded-lg">
//           <label className="text-gray-700 text-sm font-semibold">
//             Rooms
//             <input
//               className="border rounded w-full py-2 px-3 mt-2"
//               type="number"
//               min={1}
//               {...register("roomCount", {
//                 required: "This field is required",
//               })}
//             />
//             {errors.roomCount?.message && (
//               <span className="text-red-500 text-sm font-medium mt-2 inline-block">
//                 {errors.roomCount?.message}
//               </span>
//             )}
//           </label>
//         </div>
//         <div className="flex items-center mt-4">
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
      
//     </div>
    
//   );
// };

// export default GuestsSection;


// import { useState } from "react";
// import { useFormContext } from "react-hook-form";
// import { HotelFormData } from "./ManageHotelForm";
// import { Dialog } from "@headlessui/react";

// const GuestsSection = () => {
//   const {
//     register,
//     formState: { errors },
//   } = useFormContext<HotelFormData>();

//   const [showRooms, setShowRooms] = useState(true);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const toggleRoomsVisibility = () => {
//     setShowRooms((prev) => !prev);
//   };

//   return (
//     <div className="mb-8">
//       <h2 className="text-2xl font-semibold mb-4">Guests</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-100 p-6 rounded-lg">
//         <label className="text-gray-700 text-sm font-semibold">
//           Rooms
//           <input
//             className="border rounded w-full py-2 px-3 mt-2"
//             type="number"
//             min={1}
//             {...register("roomCount", {
//               required: "This field is required",
//             })}
//           />
//           {errors.roomCount?.message && (
//             <span className="text-red-500 text-sm font-medium mt-2 inline-block">
//               {errors.roomCount?.message}
//             </span>
//           )}
//         </label>
//       </div>
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
//         onClick={() => setIsDialogOpen(true)}
//         className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
//       >
//         Add Rooms
//       </button>
//       {/* Room Dialog */}
//       <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">Add Room Category</h3>
//             <label className="block mb-2">Category</label>
//             <select className="border w-full p-2 rounded">
//               <option>2 Bed</option>
//               <option>4 Bed</option>
//             </select>
//             <label className="block mt-4">AC Room Count</label>
//             <input type="number" className="border w-full p-2 rounded" />
//             <label className="block mt-4">AC Room Price</label>
//             <input type="number" className="border w-full p-2 rounded" />
//             <label className="block mt-4">Non-AC Room Count</label>
//             <input type="number" className="border w-full p-2 rounded" />
//             <label className="block mt-4">Non-AC Room Price</label>
//             <input type="number" className="border w-full p-2 rounded" />
//             <label className="block mt-4">Upload Images</label>
//             <input type="file" multiple className="border w-full p-2 rounded" />
//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={() => setIsDialogOpen(false)}
//                 className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2"
//               >
//                 Cancel
//               </button>
//               <button className="bg-green-500 text-white py-2 px-4 rounded-lg">
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );
// };

// export default GuestsSection;

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import { Dialog } from "@headlessui/react";

const GuestsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  const [showRooms, setShowRooms] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [editingRoomIndex, setEditingRoomIndex] = useState(null);

  const toggleRoomsVisibility = () => {
    setShowRooms((prev) => !prev);
  };

  const handleSaveRoom = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newRoom = {
      category: formData.get("category"),
      acRoomCount: formData.get("acRoomCount"),
      acRoomPrice: formData.get("acRoomPrice"),
      nonAcRoomCount: formData.get("nonAcRoomCount"),
      nonAcRoomPrice: formData.get("nonAcRoomPrice"),
      images: formData.getAll("images"),
    };
    
    if (editingRoomIndex !== null) {
      const updatedRooms = [...rooms];
      updatedRooms[editingRoomIndex] = newRoom;
      setRooms(updatedRooms);
      setEditingRoomIndex(null);
    } else {
      setRooms([...rooms, newRoom]);
    }
    setIsDialogOpen(false);
  };

  const handleEditRoom = (index) => {
    setEditingRoomIndex(index);
    setIsDialogOpen(true);
  };

  const handleDeleteRoom = (index) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Guests</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-100 p-6 rounded-lg">
        <label className="text-gray-700 text-sm font-semibold">
          Rooms
          <input
            className="border rounded w-full py-2 px-3 mt-2"
            type="number"
            min={1}
            {...register("roomCount", {
              required: "This field is required",
            })}
          />
          {errors.roomCount?.message && (
            <span className="text-red-500 text-sm font-medium mt-2 inline-block">
              {errors.roomCount?.message}
            </span>
          )}
        </label>
      </div>
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
        onClick={() => setIsDialogOpen(true)}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg"
      >
        Add Rooms
      </button>
      <div className="mt-6">
        {rooms.map((room, index) => (
          <div key={index} className="p-4 border rounded-lg mb-4">
            <h3 className="font-semibold">Category: {room.category}</h3>
            <p>AC Rooms: {room.acRoomCount} - Price: {room.acRoomPrice}</p>
            <p>Non-AC Rooms: {room.nonAcRoomCount} - Price: {room.nonAcRoomPrice}</p>
            <div className="flex gap-2 mt-2">
              {room.images.map((image, i) => (
                <img key={i} src={URL.createObjectURL(image)} alt="Room" className="w-16 h-16 rounded" />
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleEditRoom(index)} className="bg-yellow-500 text-white py-1 px-3 rounded-lg">Edit</button>
              <button onClick={() => handleDeleteRoom(index)} className="bg-red-500 text-white py-1 px-3 rounded-lg">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {/* Room Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">{editingRoomIndex !== null ? "Edit Room Category" : "Add Room Category"}</h3>
            <form onSubmit={handleSaveRoom}>
              <label className="block mb-2">Category</label>
              <select name="category" className="border w-full p-2 rounded">
                <option>2 Bed AC</option>
                <option>2 Bed Non-AC</option>
                <option>4 Bed AC</option>
                <option>4 Bed Non-AC</option>
              </select>
              <label className="block mt-4">Room Count</label>
              <input name="acRoomCount" type="number" className="border w-full p-2 rounded" />
              <label className="block mt-4">Room Price</label>
              <input name="acRoomPrice" type="number" className="border w-full p-2 rounded" />
              <label className="block mt-4">Upload Images</label>
              <input name="images" type="file" multiple className="border w-full p-2 rounded" />
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-lg">
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


