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

  // const generatePdf = async () => {
  //   const input = agreementRef.current;
  //   if (!input) return;

  //   try {
  //     // Generate canvas from the agreement content
  //     const canvas = await html2canvas(input, {
  //       scale: 2, // Increase scale for better quality
  //       useCORS: true, // Handle cross-origin issues
  //       scrollY: -window.scrollY, // Ensure the entire element is captured
  //     });

  //     // Convert canvas to image data
  //     const imgData = canvas.toDataURL("image/png");

  //     // Create a new PDF document
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const margin = 10; // Margin for the PDF

  //     // Calculate the height of the canvas in PDF units
  //     const canvasHeightInPdfUnits =
  //       (canvas.height * (pdfWidth - margin * 2)) / canvas.width;

  //     let yPosition = 0;

  //     // Add agreement content to the PDF page by page
  //     while (yPosition < canvasHeightInPdfUnits) {
  //       pdf.addImage(
  //         imgData,
  //         "PNG",
  //         margin,
  //         margin - yPosition,
  //         pdfWidth - margin * 2,
  //         canvasHeightInPdfUnits
  //       );

  //       yPosition += pdfHeight - margin * 2;

  //       if (yPosition < canvasHeightInPdfUnits) {
  //         pdf.addPage();
  //       }
  //     }

  //     // Add additional documents (Aadhaar, PAN, Rent Agreement)
  //     const imageFiles = [
  //       { file: aadhaarFront, label: "Aadhaar Card Front" },
  //       { file: aadhaarBack, label: "Aadhaar Card Back" },
  //       { file: panCard, label: "PAN Card" },
  //       ...(propertyOwnership === "Rented" && rentAgreement
  //         ? [{ file: rentAgreement, label: "Rent Agreement" }]
  //         : []),
  //     ];

  //     for (const { file, label } of imageFiles) {
  //       if (!file) continue;

  //       const imgURL = URL.createObjectURL(file);
  //       const img = new Image();
  //       img.src = imgURL;

  //       await new Promise<void>((resolve) => {
  //         img.onload = () => {
  //           const ratio = img.width / img.height;
  //           const pageHeight = pdf.internal.pageSize.getHeight() - margin * 2;
  //           const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2;

  //           let imgWidth = pageWidth;
  //           let imgHeight = imgWidth / ratio;

  //           if (imgHeight > pageHeight) {
  //             imgHeight = pageHeight;
  //             imgWidth = imgHeight * ratio;
  //           }

  //           pdf.addPage();
  //           pdf.setFontSize(12);
  //           pdf.text(label, margin, margin);
  //           pdf.addImage(img, "JPEG", margin, margin + 10, imgWidth, imgHeight);
  //           resolve();
  //         };
  //       });
  //     }

  //     // Save the PDF
  //     pdf.save("brij-divine-agreement.pdf");
  //   } catch (error) {
  //     console.error("Error generating PDF:", error);
  //   }
  // };

  const generatePdf = async () => {
    const input = agreementRef.current;
    if (!input) return;

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Margins in mm
      const marginX = 10; // left & right margin
      const marginY = 10; // top & bottom margin

      const imgWidth = pdfWidth - 2 * marginX;
      // const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pageHeightInPx =
        (canvas.width / imgWidth) * (pdfHeight - 2 * marginY);
      let pageCount = Math.ceil(canvas.height / pageHeightInPx);

      for (let i = 0; i < pageCount; i++) {
        // Create page slice
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

        const pageData = pageCanvas.toDataURL("image/png");

        if (i > 0) pdf.addPage();
        pdf.addImage(
          pageData,
          "PNG",
          marginX,
          marginY,
          imgWidth,
          (pageCanvas.height * imgWidth) / canvas.width
        );
      }

      // Add additional documents with margins
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
            const availableWidth = pdfWidth - 2 * marginX;
            const availableHeight = pdfHeight - 2 * marginY - 10; // leave space for label

            let imgW = availableWidth;
            let imgH = imgW / ratio;

            if (imgH > availableHeight) {
              imgH = availableHeight;
              imgW = imgH * ratio;
            }

            pdf.addPage();
            pdf.setFontSize(12);
            pdf.text(label, marginX, marginY);
            pdf.addImage(img, "JPEG", marginX, marginY + 10, imgW, imgH);
            resolve();
          };
        });
      }

      pdf.save("brij-divine-agreement.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
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

        <div className="mt-4 border p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Agreement Terms</h3>
          <p>
            Now therefore, in consideration of the mutual agreement, covenants,
            promises and conditions contained herein, and for other good and
            valuable consideration (the receipt and sufficiency of which are
            hereby acknowledged), the parties agree as follows:
          </p>
          <h4 className="text-md font-semibold mt-4">Important Terms</h4>
          <ul className="list-disc ml-6">
            <li>International guests are not allowed</li>
            <li>Room rents as per owner’s choice</li>
            <li>Payment at the time of Check-in</li>
            <li>Clarity of reconciliation</li>
          </ul>
          <h4 className="text-md font-semibold mt-4">
            Terms & Conditions for Using Mobile Application & Digital Marketing
          </h4>
          <p>
            "This Marketing and Operational Consulting Agreement ("Agreement")
            is entered into on the “Signing Date” by and between Brij Divine
            Stay India, a firm registered under the MSME scheme, through its
            authorized signatory Mr. Shivam (“Brij Divine Stay”), and:"
          </p>
          <p>
            _________________________________________
            <br />
            (Hereinafter referred to as the “Owner”, which expression shall,
            unless repugnant to the context or meaning hereof, mean heirs and
            permitted assigns.)
          </p>
          <p>
            Whereas for the purposes of this Agreement, it is hereby agreed
            between the parties that directors of a company (jointly and
            severally) shall be deemed to be the Owner in case of a Company and
            similarly partners (jointly and severally) in case of Partnership
            Firm or LLP and proprietor (in case of any other format including
            Proprietorship Firm) shall be deemed to be the Owner. Both parties
            are agreed on the following Terms and Conditions:
          </p>
          <p>
            The agreement between Brij Divine Stay and the Owner will have its
            validity till 31-12-2025 (“Term”). Brij Divine Stay shall have the
            right to terminate the agreement if the terms and conditions are not
            met by the Owner/the Hotel as per this Agreement. However, post the
            completion of the Lock-in period or the expiry of the commercials
            end date, either party (Brij Divine Stay or Owner) can terminate the
            Agreement with a 30 days’ notice.
          </p>
          <h4 className="text-md font-semibold mt-4">Terms:</h4>
          <ol className="list-decimal ml-6">
            <li>
              The Brij Divine Stay is an Online Travel Agency for Digital
              Marketing of Hotel.
            </li>
            <li>
              Fee shall be exclusive of all taxes/GST applicable on such
              transaction as per extant laws for its services of mobile
              application.
            </li>
            <li>
              Brij Divine Stay will not control pricing of the Hotel owner. All
              prices and terms & conditions related to guest is exclusive right
              of hotel owner.
            </li>
            <li>
              Brij Divine Stay will not full authority to determine and publish
              room tariffs on booking website at any point in time by exercising
              Hotel Owner decision through email or Mobile. All bookings made
              through Brij Divine Stay website must be honored by the Owner for
              the Hotel.
            </li>
            <li>
              Hotel owner shall be exclusively responsible for all kinds of law
              and regulations related to Hotel operating, State Government i.e.,
              Fire, Hotel License, Municipal Corporation, Labour, Food License,
              Liquor License, PF, ESI, Police verification, register
              verification, Maintaining proper entry & Id of guests etc.
            </li>
            <li>
              Hotel Management is held responsible to maintain Cleaning,
              Sanitizing, Hygiene, Rooms, Toilets, Reception, Dining area,
              Lights, Common area, Outer area, of the hotels & providing neat
              and clean, all furniture, Bedsheets pillow, Pillow covers, Linen,
              Curtains, Towels, Glasses, Basket, Mug etc.
            </li>
            <li>
              Parking shall be properly maintained & available, Entry lane
              should be clean & maintain with daily cleaning.
            </li>
            <li>
              Hotel Manager/Guest Relation Executive/Front Office
              Executive/Kitchen staff To maintain a fair and secure platform for
              all users, hotel owners are strictly prohibited from uploading or
              displaying their direct contact information (including but not
              limited to phone numbers, WhatsApp numbers, or email addresses) on
              their hotel listing pages, profile, images, or any other publicly
              accessible areas of the website.
            </li>
            <li>
              Violation of this policy will result in the following actions:
              <ul className="list-disc ml-6">
                <li>
                  First Offense: Immediate suspension of the hotel listing for
                  15 days.
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
              check-in or after 12:00 AM (midnight) on the check-in date, or if
              they are a no-show, the customer will not receive any refund.
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
              booking amount will be paid to the hotel owner, and the remaining
              15% will be retained by the website platform.
            </li>
          </ul>
        </div>

        {/* <div className="mt-4 space-y-2">
          {aadhaarFront && <p>Aadhaar Front: {aadhaarFront.name}</p>}
          {aadhaarBack && <p>Aadhaar Back: {aadhaarBack.name}</p>}
          {panCard && <p>PAN Card: {panCard.name}</p>}
          {propertyOwnership === "Rented" && rentAgreement && (
            <p>Rent Agreement: {rentAgreement.name}</p>
          )}
        </div> */}
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
