import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./agreement.css"; // Import your CSS file for styling
import { useNavigate } from "react-router-dom";

export default function AgreementTwoStep() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const agreementRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // Loader state

  const [ownerName, setOwnerName] = useState("");
  const [propertyOwnership, setPropertyOwnership] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [gstNo, setGstNo] = useState(""); // Optional field
  const [contactNumber, setContactNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [signingOwnerName, setSigningOwnerName] = useState("");

  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);
  const [panCard, setPanCard] = useState<File | null>(null);
  const [rentAgreement, setRentAgreement] = useState<File | null>(null);
  const [, setUploadedFileUrl] = useState<string | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFields = () => {
    const newErrors: Record<string, string> = {};

    // Validate text fields
    if (!ownerName.trim()) newErrors.ownerName = "Owner name is required.";
    if (!propertyOwnership.trim())
      newErrors.propertyOwnership = "Property ownership is required.";
    if (!hotelAddress.trim())
      newErrors.hotelAddress = "Hotel address is required.";
    if (!propertyName.trim())
      newErrors.propertyName = "Property name is required.";
    if (!contactNumber.trim())
      newErrors.contactNumber = "Contact number is required.";
    if (!emergencyContact.trim())
      newErrors.emergencyContact = "Emergency contact is required.";
    if (!signingOwnerName.trim())
      newErrors.signingOwnerName = "Signing owner name is required.";

    // Validate document uploads
    if (!aadhaarFront) newErrors.aadhaarFront = "Aadhaar front is required.";
    if (!aadhaarBack) newErrors.aadhaarBack = "Aadhaar back is required.";
    if (!panCard) newErrors.panCard = "PAN card is required.";
    if (propertyOwnership === "Rented" && !rentAgreement)
      newErrors.rentAgreement =
        "Rent agreement is required for rented properties.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleNextStep = () => {
    if (validateFields()) {
      setStep(2); // Proceed to the next step if validation passes
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.target.checked);
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
      setLoading(true); // Show loader during upload
      // Simulate upload delay
      setTimeout(() => {
        setLoading(false); // Hide loader after upload
      }, 2000);
    }
  };

  const uploadAndShowFile = async (pdfBlob: Blob) => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

    try {
      const formData = new FormData();
      formData.append("file", pdfBlob); // Merged PDF file
      formData.append("propertyName", propertyName); // Additional field

      const response = await fetch(`${API_BASE_URL}/api/pdfUpload/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend Error:", errorText);
        throw new Error("Failed to upload PDF");
      }

      const data = await response.json();
      console.log("Uploaded File URL:", data.secure_url);
      setUploadedFileUrl(data.secure_url);
      setSuccessMessage("Agreement successfully submitted!");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const generateAndUploadPdf = async () => {
    const input = agreementRef.current;
    if (!input) return;
    input.classList.add("a4-pdf-export");

    setLoading(true); // Show loader during PDF generation and upload

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const marginX = 10; // left & right margin
      const marginY = 10; // top & bottom margin

      const imgWidth = pdfWidth - 2 * marginX;
      const pageHeightInPx =
        (canvas.width / imgWidth) * (pdfHeight - 2 * marginY);
      let pageCount = Math.ceil(canvas.height / pageHeightInPx);

      // Add agreement content to the PDF
      for (let i = 0; i < pageCount; i++) {
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(
          pageHeightInPx,
          canvas.height - i * pageHeightInPx
        );

        const ctx = pageCanvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(
            canvas,
            0,
            i * pageHeightInPx,
            canvas.width,
            pageCanvas.height,
            0,
            0,
            canvas.width,
            pageCanvas.height
          );
        }

        const pageData = pageCanvas.toDataURL("image/jpeg", 0.5); // Compress image quality to 50%

        if (i > 0) pdf.addPage();
        pdf.addImage(
          pageData,
          "JPEG",
          marginX,
          marginY,
          imgWidth,
          (pageCanvas.height * imgWidth) / canvas.width
        );
      }

      // Add images after the agreement
      const addImageToPdf = async (imageFile: File | null, label: string) => {
        if (!imageFile) return;

        const imageData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(imageFile);
        });

        pdf.addPage();
        pdf.setFontSize(14);
        pdf.text(label, marginX, marginY);
        pdf.addImage(
          imageData,
          "JPEG",
          marginX,
          marginY + 10,
          imgWidth,
          (imgWidth * 3) / 4 // Maintain aspect ratio
        );
      };

      await addImageToPdf(aadhaarFront, "Aadhaar Card Front");
      await addImageToPdf(aadhaarBack, "Aadhaar Card Back");
      await addImageToPdf(panCard, "PAN Card");
      if (propertyOwnership === "Rented") {
        await addImageToPdf(rentAgreement, "Rent Agreement");
      }

      // Convert the PDF to a Blob
      const pdfBlob = pdf.output("blob");

      // Upload the merged PDF file
      await uploadAndShowFile(pdfBlob);
    } catch (error) {
      console.error("Error generating or uploading PDF:", error);
    } finally {
      input.classList.remove("a4-pdf-export");
      setLoading(false); // Hide loader after process
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-300 rounded text-center">
          {successMessage}
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      {step === 1 && (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Step 1: Hotel Details & Documents
          </h1>

          {/* Owner Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Owner Details
            </h2>
            <label className="block">
              <span className="text-gray-600">Name of Owner:</span>
              <input
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
              {errors.ownerName && (
                <p className="text-red-500 text-sm">{errors.ownerName}</p>
              )}
            </label>

            <label className="block">
              <span className="text-gray-600">Address of Hotel:</span>
              <input
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={hotelAddress}
                onChange={(e) => setHotelAddress(e.target.value)}
              />
              {errors.hotelAddress && (
                <p className="text-red-500 text-sm">{errors.hotelAddress}</p>
              )}
            </label>

            <label className="block">
              <span className="text-gray-600">Property Name:</span>
              <input
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
              />
              {errors.propertyName && (
                <p className="text-red-500 text-sm">{errors.propertyName}</p>
              )}
            </label>

            <label className="block">
              <span className="text-gray-600">GST No: (Optional)</span>
              <input
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={gstNo}
                onChange={(e) => setGstNo(e.target.value)}
              />
            </label>
          </div>

          {/* Contact Details Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Contact Details
            </h2>
            <label className="block">
              <span className="text-gray-600">Contact Number:</span>
              <input
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm">{errors.contactNumber}</p>
              )}
            </label>

            <label className="block">
              <span className="text-gray-600">Emergency Contact:</span>
              <input
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
              {errors.emergencyContact && (
                <p className="text-red-500 text-sm">
                  {errors.emergencyContact}
                </p>
              )}
            </label>
          </div>

          {/* Ownership Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Property Ownership
            </h2>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ownership"
                  value="Owned"
                  checked={propertyOwnership === "Owned"}
                  onChange={() => setPropertyOwnership("Owned")}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-600">Owned</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ownership"
                  value="Rented"
                  checked={propertyOwnership === "Rented"}
                  onChange={() => setPropertyOwnership("Rented")}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-600">Rented</span>
              </label>
            </div>
            {errors.propertyOwnership && (
              <p className="text-red-500 text-sm">{errors.propertyOwnership}</p>
            )}
          </div>

          {/* Document Upload Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Upload Documents
            </h2>
            <label className="block">
              <span className="text-gray-600">Aadhaar Card Front:</span>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setAadhaarFront)}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.aadhaarFront && (
                <p className="text-red-500 text-sm">{errors.aadhaarFront}</p>
              )}
            </label>

            <label className="block">
              <span className="text-gray-600">Aadhaar Card Back:</span>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setAadhaarBack)}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.aadhaarBack && (
                <p className="text-red-500 text-sm">{errors.aadhaarBack}</p>
              )}
            </label>

            <label className="block">
              <span className="text-gray-600">PAN Card:</span>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, setPanCard)}
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.panCard && (
                <p className="text-red-500 text-sm">{errors.panCard}</p>
              )}
            </label>

            {propertyOwnership === "Rented" && (
              <label className="block">
                <span className="text-gray-600">Rent Agreement:</span>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, setRentAgreement)}
                  className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.rentAgreement && (
                  <p className="text-red-500 text-sm">{errors.rentAgreement}</p>
                )}
              </label>
            )}
          </div>

          {/* Signature Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Owner's Signature
            </h2>
            <label className="block">
              <span className="text-gray-600">Owner's Signature Name:</span>
              <input
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signingOwnerName}
                onChange={(e) => setSigningOwnerName(e.target.value)}
              />
              {errors.signingOwnerName && (
                <p className="text-red-500 text-sm">
                  {errors.signingOwnerName}
                </p>
              )}
            </label>
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleNextStep}
            >
              Continue to Step 2
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="text-xl font-bold text-center mb-4">
            Step 2: Agreement Preview
          </h1>
          <div
            ref={agreementRef}
            className="agreement-preview bg-white p-6 shadow text-sm leading-relaxed mx-auto"
          >
            <h2 className="text-xl font-bold text-center mb-2">
              BRIJ DIVINE STAY - Agreement
            </h2>
            <p>
              <strong>Name of Owner:</strong> {ownerName}
            </p>
            <p>
              <strong>Ownership:</strong> {propertyOwnership}
            </p>
            <p>
              <strong>Hotel Address:</strong> {hotelAddress}
            </p>
            <p>
              <strong>Property Name:</strong> {propertyName}
            </p>
            <p>
              <strong>GST No:</strong> {gstNo}
            </p>
            <p>
              <strong>Contact:</strong> {contactNumber}
            </p>
            <p>
              <strong>Emergency Contact:</strong> {emergencyContact}
            </p>

            <div className="mt-4  p-4 rounded-lg">
              <p>
                <strong>AGREEMENT</strong>
              </p>
              <p>
                This Agreement is made on 1st June, 2025, and shall be effective
                from the same day (hereinafter referred to as the “Effective
                Date”), by and between the following both parties.
              </p>
              <h3 className="text-lg font-bold mb-2">Agreement Terms</h3>
              <p>
                Now therefore, in consideration of the mutual agreement,
                covenants, promises and conditions contained herein, and for
                other good and valuable consideration (the receipt and
                sufficiency of which are hereby acknowledged), the parties agree
                as follows:
              </p>
              <h4 className="text-md font-semibold mt-4">Important Terms</h4>
              <ul className="list-disc ml-6">
                <li>International guests are not allowed</li>
                <li>Room rents as per owner’s choice</li>
                <li>Payment at the time of Check-in</li>
                <li>Clarity of reconciliation</li>
              </ul>
              <h4 className="text-md font-semibold mt-4">
                Terms & Conditions for Using Website & Digital Marketing
              </h4>
              <p>
                "This Marketing and Operational Consulting Agreement
                ("Agreement") is entered into on the “Signing Date” by and
                between Brij Divine Stay India, a firm registered under the MSME
                scheme, through its authorized signatory Mr. Shivam (“Brij
                Divine Stay”), and:"
              </p>
              <p>
                <strong>
                  {ownerName || "_________________________________________"}
                </strong>
                <br />
                (Hereinafter referred to as the “Owner”, which expression shall,
                unless repugnant to the context or meaning hereof, mean heirs
                and permitted assigns.)
              </p>
              <p>
                Whereas for the purposes of this Agreement, it is hereby agreed
                between the parties that directors of a company (jointly and
                severally) shall be deemed to be the Owner in case of a Company
                and similarly partners (jointly and severally) in case of
                Partnership Firm or LLP and proprietor (in case of any other
                format including Proprietorship Firm) shall be deemed to be the
                Owner. Both parties are agreed on the following Terms and
                Conditions:
              </p>
              <p>
                The agreement between Brij Divine Stay and the Owner will have
                its validity till 31-08-2025 (“Term”). Brij Divine Stay shall
                have the right to terminate the agreement if the terms and
                conditions are not met by the Owner/the Hotel as per this
                Agreement. However, post the completion of the Lock-in period or
                the expiry of the commercials end date, either party (Brij
                Divine Stay or Owner) can terminate the Agreement with a 30
                days’ notice.
              </p>
              <h4 className="text-md font-semibold mt-4">Terms:</h4>
              <ol className="list-decimal ml-6">
                <li>
                  The Brij Divine Stay is an Online Travel Agency for Digital
                  Marketing of Hotel.
                </li>
                <li>
                  Fee shall be exclusive of all taxes/GST applicable on such
                  transaction as per extant laws for its services of website
                  application.
                </li>
                <li>
                  Brij Divine Stay will not control pricing of the Hotel owner.
                  All prices and terms & conditions related to guest is
                  exclusive right of hotel owner.
                </li>
                <li>
                  Brij Divine Stay will not full authority to determine and
                  publish room tariffs on booking website at any point in time
                  by exercising Hotel Owner decision through email or Mobile.
                  All bookings made through Brij Divine Stay website must be
                  honored by the Owner for the Hotel.
                </li>
                <li>
                  Brij Divine Stay will charge a <b>15%</b> commission on the
                  rate entered by the hotel owner on the portal for every
                  booking made through the website.
                </li>
                <li>
                  Hotel owner shall be exclusively responsible for all kinds of
                  law and regulations related to Hotel operating, State
                  Government i.e., Fire, Hotel License, Municipal Corporation,
                  Labour, Food License, Liquor License, PF, ESI, Police
                  verification, register verification, Maintaining proper entry
                  & Id of guests etc.
                </li>
                <li>
                  Hotel Management is held responsible to maintain Cleaning,
                  Sanitizing, Hygiene, Rooms, Toilets, Reception, Dining area,
                  Lights, Common area, Outer area, of the hotels & providing
                  neat and clean, all furniture, Bedsheets pillow, Pillow
                  covers, Linen, Curtains, Towels, Glasses, Basket, Mug etc.
                </li>
                <li>
                  Parking shall be properly maintained & available, Entry lane
                  should be clean & maintain with daily cleaning.
                </li>
                <li>
                  Hotel Manager/Guest Relation Executive/Front Office
                  Executive/Kitchen staff To maintain a fair and secure platform
                  for all users, hotel owners are strictly prohibited from
                  uploading or displaying their direct contact information
                  (including but not limited to phone numbers, WhatsApp numbers,
                  or email addresses) on their hotel listing pages, profile,
                  images, or any other publicly accessible areas of the website.
                </li>
                <li>
                  Violation of this policy will result in the following actions:
                  <ul className="list-disc ml-6">
                    <li>
                      First Offense: Immediate suspension of the hotel listing
                      for 15 days.
                    </li>
                    <li>
                      Repeated or Severe Offense: Permanent removal of the hotel
                      from the Brij Divine Stay platform without prior notice.
                    </li>
                  </ul>
                </li>
              </ol>
              <h4 className="text-md font-semibold mt-4">
                Cancellation and Refund Policy
              </h4>
              <p>
                <strong>Free Cancellation Policy (Full payment):</strong>
              </p>
              <ul className="list-disc ml-6">
                <li>
                  If a customer cancels a booking at least 12 hours before the
                  scheduled check-in time, or before 12:00 AM (midnight) on the
                  check-in date, they will be eligible for a 100% refund.
                </li>
                <li>
                  If a customer cancels the booking less than 12 hours before
                  check-in or after 12:00 AM (midnight) on the check-in date, or
                  if they are a no-show, the customer will not receive any
                  refund.
                </li>
              </ul>
              <p>
                <strong>Cancellation Policy (30% Payment):</strong>
              </p>
              <ul className="list-disc ml-6">
                <li>
                  No Cancellations: Once a customer pays the 30% booking
                  reservation, cancellations are not allowed under any
                  circumstances.
                </li>
                <li>
                  If the customer cancels or fails to show up, 15% of the total
                  booking amount will be paid to the hotel owner, and the
                  remaining 15% will be retained by the website platform.
                </li>
              </ul>
            </div>
            <p className="mt-4 font-semibold">
              This agreement shall be deemed valid and enforceable upon
              electronic acceptance by both parties, and shall hold the same
              legal effect as a handwritten signature.
            </p>
          </div>
          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={isAgreed}
                onChange={handleCheckboxChange}
              />
              <span className="ml-2">I agree to the terms stated above.</span>
            </label>
          </div>

          <div className="text-right mt-4">
            {isAgreed && (
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={generateAndUploadPdf}
              >
                Submit
              </button>
            )}{" "}
          </div>
        </div>
      )}
    </div>
  );
}
