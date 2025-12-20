// import React, { useState, useEffect } from "react";
// import {
//   sendWhatsAppOTP,
//   verifyWhatsAppOTP,
//   resendWhatsAppOTP,
// } from "../api-client";

// interface WhatsAppOTPProps {
//   onVerificationSuccess: (phoneNumber: string) => void;
//   onCancel?: () => void;
// }

// const WhatsAppOTP: React.FC<WhatsAppOTPProps> = ({
//   onVerificationSuccess,
//   onCancel,
// }) => {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState<"phone" | "otp">("phone");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [countdown, setCountdown] = useState(0);

//   useEffect(() => {
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [countdown]);

//   const handleSendOTP = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       await sendWhatsAppOTP(phoneNumber);
//       setSuccess("OTP sent to your WhatsApp number!");
//       setStep("otp");
//       setCountdown(300); // 5 minutes countdown
//     } catch (error: any) {
//       setError(error.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOTP = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       await verifyWhatsAppOTP(phoneNumber, otp);
//       setSuccess("Phone number verified successfully!");
//       onVerificationSuccess(phoneNumber);
//     } catch (error: any) {
//       setError(error.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       await resendWhatsAppOTP(phoneNumber);
//       setSuccess("OTP resent to your WhatsApp number!");
//       setCountdown(300);
//     } catch (error: any) {
//       setError(error.message || "Failed to resend OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatTime = (seconds: number) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
//       <div className="text-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">
//           WhatsApp Verification
//         </h2>
//         <p className="text-gray-600">
//           {step === "phone"
//             ? "Enter your phone number to receive OTP via WhatsApp"
//             : "Enter the OTP sent to your WhatsApp"}
//         </p>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {success}
//         </div>
//       )}

//       {step === "phone" ? (
//         <form onSubmit={handleSendOTP} className="space-y-4">
//           <div>
//             <label
//               htmlFor="phoneNumber"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               id="phoneNumber"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               placeholder="Enter your phone number (e.g., +91 9876543210)"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             <p className="text-xs text-gray-500 mt-1">
//               Include country code (e.g., +91 for India)
//             </p>
//           </div>

//           <div className="flex space-x-3">
//             <button
//               type="submit"
//               disabled={loading || !phoneNumber}
//               className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {loading ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//               ) : (
//                 <>
//                   <svg
//                     className="w-4 h-4 mr-2"
//                     fill="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
//                   </svg>
//                   Send WhatsApp OTP
//                 </>
//               )}
//             </button>

//             {onCancel && (
//               <button
//                 type="button"
//                 onClick={onCancel}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>
//       ) : (
//         <form onSubmit={handleVerifyOTP} className="space-y-4">
//           <div>
//             <label
//               htmlFor="otp"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               Enter OTP
//             </label>
//             <input
//               type="text"
//               id="otp"
//               value={otp}
//               onChange={(e) =>
//                 setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
//               }
//               placeholder="Enter 6-digit OTP"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
//               maxLength={6}
//               required
//             />
//             <p className="text-xs text-gray-500 mt-1 text-center">
//               Sent to: {phoneNumber}
//             </p>
//           </div>

//           {countdown > 0 && (
//             <div className="text-center text-sm text-gray-600">
//               OTP expires in:{" "}
//               <span className="font-mono font-bold">
//                 {formatTime(countdown)}
//               </span>
//             </div>
//           )}

//           <div className="flex space-x-3">
//             <button
//               type="submit"
//               disabled={loading || otp.length !== 6}
//               className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             >
//               {loading ? (
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//               ) : (
//                 "Verify OTP"
//               )}
//             </button>

//             <button
//               type="button"
//               onClick={handleResendOTP}
//               disabled={loading || countdown > 0}
//               className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Resend
//             </button>
//           </div>

//           <button
//             type="button"
//             onClick={() => {
//               setStep("phone");
//               setOtp("");
//               setError("");
//               setSuccess("");
//             }}
//             className="w-full text-sm text-gray-600 hover:text-gray-800"
//           >
//             ← Change phone number
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default WhatsAppOTP;
