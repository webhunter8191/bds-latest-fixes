import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";

const AddHotel = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel Saved!", type: "SUCCESS" });
<<<<<<< HEAD
      navigate("/my-hotels");
=======
      navigate("/my-hotels")
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
    },
    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
};

<<<<<<< HEAD
export default AddHotel;
=======
export default AddHotel;
>>>>>>> cc9fc0a300a2e4e730cf4d3eb6def5b96a06fd6c
