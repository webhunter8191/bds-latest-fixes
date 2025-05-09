// import React, { useRef, useState } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export default function AgreementForm() {
//   const agreementRef = useRef<HTMLDivElement>(null);

//   const [ownerName, setOwnerName] = useState("");
//   const [propertyOwnership, setPropertyOwnership] = useState("");
//   const [hotelAddress, setHotelAddress] = useState("");
//   const [gstNo, setGstNo] = useState("");
//   const [contactNumber, setContactNumber] = useState("");
//   const [emergencyContact, setEmergencyContact] = useState("");
//   const [signingOwnerName, setSigningOwnerName] = useState("");

//   const generatePdf = async () => {
//     const input = agreementRef.current;
//     if (!input) return;

//     const a4Width = 210; // mm
//     const a4Height = 297; // mm

//     const canvas = await html2canvas(input, {
//       scale: 2,
//       useCORS: true,
//       scrollY: -window.scrollY,
//     });

//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF("p", "mm", "a4");

//     const imgProps = pdf.getImageProperties(imgData);
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     let heightLeft = pdfHeight;
//     let position = 0;

//     pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
//     heightLeft -= a4Height;

//     while (heightLeft > 0) {
//       position = heightLeft - pdfHeight;
//       pdf.addPage();
//       pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
//       heightLeft -= a4Height;
//     }

//     pdf.save("brij-divine-agreement.pdf");
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-gray-50 space-y-6">
//       <h1 className="text-2xl font-bold text-center mb-4">
//         BRIJ DIVINE STAY - Agreement Form
//       </h1>

//       <div className="space-y-4">
//         <label className="block">
//           Name of Owner:
//           <input
//             className="border p-2 w-full"
//             value={ownerName}
//             onChange={(e) => setOwnerName(e.target.value)}
//           />
//         </label>
//         <label className="block">
//           Address of Hotel:
//           <input
//             className="border p-2 w-full"
//             value={hotelAddress}
//             onChange={(e) => setHotelAddress(e.target.value)}
//           />
//         </label>
//         <label className="block">
//           GST No:
//           <input
//             className="border p-2 w-full"
//             value={gstNo}
//             onChange={(e) => setGstNo(e.target.value)}
//           />
//         </label>
//         <label className="block">
//           Contact Number:
//           <input
//             className="border p-2 w-full"
//             value={contactNumber}
//             onChange={(e) => setContactNumber(e.target.value)}
//           />
//         </label>
//         <label className="block">
//           Emergency Contact:
//           <input
//             className="border p-2 w-full"
//             value={emergencyContact}
//             onChange={(e) => setEmergencyContact(e.target.value)}
//           />
//         </label>
//         <div className="block">
//           <span className="font-medium">Property Ownership:</span>
//           <label className="ml-4">
//             <input
//               type="radio"
//               value="Owned"
//               checked={propertyOwnership === "Owned"}
//               onChange={() => setPropertyOwnership("Owned")}
//             />{" "}
//             Owned
//           </label>
//           <label className="ml-4">
//             <input
//               type="radio"
//               value="Rented"
//               checked={propertyOwnership === "Rented"}
//               onChange={() => setPropertyOwnership("Rented")}
//             />{" "}
//             Rented
//           </label>
//         </div>
//         <label className="block">
//           Owner's Signature Name:
//           <input
//             className="border p-2 w-full"
//             value={signingOwnerName}
//             onChange={(e) => setSigningOwnerName(e.target.value)}
//           />
//         </label>
//       </div>

//       <div
//         ref={agreementRef}
//         className="w-[794px] bg-white p-10 text-sm leading-relaxed shadow mx-auto"
//       >
//         <h2 className="text-xl font-bold text-center mb-4">
//           BRIJ DIVINE STAY - Agreement
//         </h2>
//         <p>
//           <strong>BRIJ DIVINE STAY</strong>
//           <br />
//           Dashmesh Plaza, 110, First Floor,
//           <br />
//           Ajronda Chowk, Sector 20B,
//           <br />
//           Faridabad, Haryana 121004
//           <br />
//           📞 +91 9588509096 | 🌐 www.BrijDivineStay.in | ✉️
//           hello@BrijDivineStay.in
//         </p>

//         <p className="mt-4">
//           This Agreement is made on <strong>1st February, 2021</strong>, and
//           shall be effective from the same day (“Effective Date”), by and
//           between the following both parties.
//         </p>

//         <h3 className="font-semibold mt-4">Basic Details of Hotel</h3>
//         <p>
//           <strong>Property Ownership:</strong> {propertyOwnership}
//         </p>
//         <p>
//           <strong>Name of Owner:</strong> {ownerName}
//         </p>
//         <p>
//           <strong>Address of Hotel:</strong> {hotelAddress}
//         </p>
//         <p>
//           <strong>GST No:</strong> {gstNo}
//         </p>
//         <p>
//           <strong>Contact:</strong> {contactNumber}
//         </p>
//         <p>
//           <strong>Emergency Contact:</strong> {emergencyContact}
//         </p>

//         <h3 className="font-semibold mt-4">Agreement Terms</h3>
//         <p>
//           Now therefore, in consideration of the mutual agreement, covenants,
//           promises and conditions contained herein, and for other good and
//           valuable consideration, the parties agree as follows:
//         </p>

//         <ul className="list-decimal ml-6 mt-2 space-y-1">
//           <li>
//             The Brij Divine Stay is Online Travel Agency for Digital Marketing
//             of Hotel.
//           </li>
//           <li>
//             Fee shall be exclusive of all taxes/GST applicable on such
//             transaction.
//           </li>
//           <li>Hotel owner controls pricing and guest policies.</li>
//           <li>
//             Brij Divine Stay can publish room tariffs based on owner
//             communication.
//           </li>
//           <li>
//             Owner responsible for all licenses, compliance, and verifications.
//           </li>
//           <li>
//             Hotel must maintain cleanliness, hygiene, and working facilities
//             (WiFi, AC, Geyser, Intercom, etc).
//           </li>
//           <li>
//             Reception to be available 24x7; staff to wear uniforms and masks.
//           </li>
//           <li>15% + GST commission per booking.</li>
//           <li>Monthly invoicing; payment due within 7 days.</li>
//           <li>
//             Brij Divine Stay can audit hotel anytime and delist in case of
//             violation.
//           </li>
//           <li>Owner to return company items if hotel closes.</li>
//           <li>Brij Divine Stay may promote its brand on hotel premises.</li>
//           <li>
//             <strong>Jurisdiction:</strong> Courts at Faridabad. Laws of India
//             apply.
//           </li>
//         </ul>

//         <p className="mt-6">
//           <strong>Owner's Signature:</strong> {signingOwnerName}
//         </p>
//       </div>

//       <div className="text-right mt-6">
//         <button
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//           onClick={generatePdf}
//         >
//           Download PDF
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function AgreementTwoStep() {
  const agreementRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);

  const [ownerName, setOwnerName] = useState("");
  const [propertyOwnership, setPropertyOwnership] = useState("");
  const [hotelAddress, setHotelAddress] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [signingOwnerName, setSigningOwnerName] = useState("");

  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);
  const [panCard, setPanCard] = useState<File | null>(null);
  const [rentAgreement, setRentAgreement] = useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
    }
  };

  const generatePdf = async () => {
    const input = agreementRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    const imageFiles = [
      { file: aadhaarFront, label: "Aadhaar Card Front" },
      { file: aadhaarBack, label: "Aadhaar Card Back" },
      { file: panCard, label: "PAN Card" },
      ...(propertyOwnership === "Rented" && rentAgreement
        ? [{ file: rentAgreement, label: "Rent Agreement" }]
        : []),
    ];

    for (const { file, label } of imageFiles) {
      if (!file) continue;

      const imgURL = URL.createObjectURL(file);
      const img = new Image();
      img.src = imgURL;

      await new Promise<void>((resolve) => {
        img.onload = () => {
          const ratio = img.width / img.height;
          const pageHeight = pdf.internal.pageSize.getHeight();
          const pageWidth = pdf.internal.pageSize.getWidth();

          let imgWidth = pageWidth;
          let imgHeight = imgWidth / ratio;

          if (imgHeight > pageHeight) {
            imgHeight = pageHeight;
            imgWidth = imgHeight * ratio;
          }

          pdf.addPage();
          pdf.setFontSize(12);
          pdf.text(label, 10, 10);
          pdf.addImage(img, "JPEG", 10, 20, imgWidth - 20, imgHeight - 20);
          resolve();
        };
      });
    }

    pdf.save("brij-divine-agreement.pdf");
  };

  if (step === 1) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow space-y-4">
        <h1 className="text-xl font-bold text-center">
          Step 1: Hotel Details & Documents
        </h1>

        <label className="block">
          Name of Owner:
          <input
            className="border p-2 w-full"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
        </label>
        <label className="block">
          Address of Hotel:
          <input
            className="border p-2 w-full"
            value={hotelAddress}
            onChange={(e) => setHotelAddress(e.target.value)}
          />
        </label>
        <label className="block">
          GST No:
          <input
            className="border p-2 w-full"
            value={gstNo}
            onChange={(e) => setGstNo(e.target.value)}
          />
        </label>
        <label className="block">
          Contact Number:
          <input
            className="border p-2 w-full"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </label>
        <label className="block">
          Emergency Contact:
          <input
            className="border p-2 w-full"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
          />
        </label>

        <div>
          <span className="font-medium">Property Ownership:</span>
          <label className="ml-4">
            <input
              type="radio"
              name="ownership"
              value="Owned"
              checked={propertyOwnership === "Owned"}
              onChange={() => setPropertyOwnership("Owned")}
            />
            Owned
          </label>
          <label className="ml-4">
            <input
              type="radio"
              name="ownership"
              value="Rented"
              checked={propertyOwnership === "Rented"}
              onChange={() => setPropertyOwnership("Rented")}
            />
            Rented
          </label>
        </div>

        <label className="block">
          Aadhaar Card Front:
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setAadhaarFront)}
          />
        </label>
        <label className="block">
          Aadhaar Card Back:
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setAadhaarBack)}
          />
        </label>
        <label className="block">
          PAN Card:
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setPanCard)}
          />
        </label>
        {propertyOwnership === "Rented" && (
          <label className="block">
            Rent Agreement:
            <input
              type="file"
              onChange={(e) => handleFileChange(e, setRentAgreement)}
            />
          </label>
        )}

        <label className="block">
          Owner's Signature Name:
          <input
            className="border p-2 w-full"
            value={signingOwnerName}
            onChange={(e) => setSigningOwnerName(e.target.value)}
          />
        </label>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setStep(2)}
        >
          Continue to Step 2
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-xl font-bold text-center mb-4">
        Step 2: Agreement Preview
      </h1>
      <div
        ref={agreementRef}
        className="bg-white p-10 shadow text-sm leading-relaxed w-[794px] mx-auto"
      >
        <h2 className="text-xl font-bold text-center mb-4">
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
          <strong>GST No:</strong> {gstNo}
        </p>
        <p>
          <strong>Contact:</strong> {contactNumber}
        </p>
        <p>
          <strong>Emergency Contact:</strong> {emergencyContact}
        </p>
        <p className="mt-2">
          This Agreement is made on <strong>1st February, 2021</strong> and
          effective from same date.
        </p>
        <p className="mt-2">Agreement Terms:</p>
        <ul className="list-decimal ml-6">
          <li>Hotel owners retain pricing control.</li>
          <li>Brij Divine Stay provides digital marketing services only.</li>
          <li>Commission: 15% + GST per booking.</li>
          <li>Invoice due within 7 days of issue.</li>
          <li>
            Hotel must maintain hygiene, documentation, and guest ID compliance.
          </li>
          <li>
            Brij Divine Stay can audit and terminate listings for violations.
          </li>
          <li>Legal jurisdiction: Faridabad, India.</li>
        </ul>
        <p className="mt-4">
          <strong>Owner Signature:</strong> {signingOwnerName}
        </p>

        <div className="mt-4 space-y-2">
          {aadhaarFront && <p>Aadhaar Front: {aadhaarFront.name}</p>}
          {aadhaarBack && <p>Aadhaar Back: {aadhaarBack.name}</p>}
          {panCard && <p>PAN Card: {panCard.name}</p>}
          {propertyOwnership === "Rented" && rentAgreement && (
            <p>Rent Agreement: {rentAgreement.name}</p>
          )}
        </div>
      </div>

      <div className="text-right mt-4">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          onClick={generatePdf}
        >
          Download Agreement as PDF
        </button>
      </div>
    </div>
  );
}
