import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./ManageHotelForm";
import { useState, useEffect } from "react";

const ImagesSection = () => {
  const [selectedFileNames, setSelectedFileNames] = useState<string[]>([]);
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<HotelFormData>();

  const existingImageUrls = watch("imageUrls");
  const imageFiles = watch("imageFiles");

  // Update selected file names when the imageFiles change
  useEffect(() => {
    if (imageFiles && imageFiles.length > 0) {
      const fileNames = Array.from(imageFiles).map((file) => file.name);
      setSelectedFileNames(fileNames);
    } else {
      setSelectedFileNames([]);
    }
  }, [imageFiles]);

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    imageUrl: string
  ) => {
    event.preventDefault();
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl)
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map((file) => file.name);
      setSelectedFileNames(fileNames);
      console.log("Files selected:", files);

      // Log selected files details
      Array.from(files).forEach((file, index) => {
        console.log(
          `File ${index + 1}: ${file.name}, Size: ${file.size}, Type: ${
            file.type
          }`
        );
      });
    } else {
      setSelectedFileNames([]);
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Hotel Images</h2>

      <div className="space-y-6">
        {/* Existing Images */}
        {existingImageUrls && existingImageUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {existingImageUrls.map((url) => (
              <div key={url} className="relative group aspect-square">
                <img
                  src={url}
                  alt="Hotel"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  onClick={(event) => handleDelete(event, url)}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 text-white rounded-lg transition-opacity duration-200"
                >
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Delete
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Image Upload */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload New Images
          </label>
          <div
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
              selectedFileNames.length > 0
                ? "border-[#6A5631]"
                : "border-gray-300"
            } border-dashed rounded-lg hover:border-[#6A5631] transition-colors duration-200`}
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-[#6A5631] hover:text-[#5A4728] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#6A5631]"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="sr-only"
                    {...register("imageFiles", {
                      onChange: handleFileChange,
                      validate: (imageFiles) => {
                        const totalLength =
                          (imageFiles?.length || 0) +
                          (existingImageUrls?.length || 0);

                        if (totalLength === 0) {
                          return "At least one image should be added";
                        }

                        if (totalLength > 6) {
                          return "Total number of images cannot be more than 6";
                        }

                        return true;
                      },
                    })}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 6 images
              </p>
            </div>
          </div>
          {selectedFileNames.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-600">
                Selected files: {selectedFileNames.length}
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-600 mt-2">
                {selectedFileNames.map((name, index) => (
                  <li key={index}>{name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {errors.imageFiles && (
        <span className="text-red-500 text-sm font-medium mt-2 inline-block">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};

export default ImagesSection;
