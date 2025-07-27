import Register from "./Register";
import SignIn from "./SignIn";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";

const AuthChoice = () => {
  const [showRegister, setShowRegister] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f6f3] px-2 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-[#6A5631] mb-2">
          Welcome to Brij Divine Stay
        </h1>
        <p className="text-gray-600 text-base">
          Please choose an option to continue
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-2xl flex flex-col items-center">
        <div className="flex w-full mb-0">
          <button
            className={`flex-1 py-4 rounded-tl-2xl text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
              ${
                showRegister
                  ? "bg-[#6A5631] text-white shadow"
                  : "bg-gray-100 text-[#6A5631] border-b-2 border-[#6A5631]"
              }
            `}
            onClick={() => setShowRegister(true)}
          >
            <FaUserPlus /> Create Account
          </button>
          <button
            className={`flex-1 py-4 rounded-tr-2xl text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2
              ${
                !showRegister
                  ? "bg-[#6A5631] text-white shadow"
                  : "bg-gray-100 text-[#6A5631] border-b-2 border-[#6A5631]"
              }
            `}
            onClick={() => setShowRegister(false)}
          >
            <FaSignInAlt /> Sign In
          </button>
        </div>
        <div className="w-full flex-1 flex items-center justify-center px-6 py-10">
          {showRegister ? (
            <Register redirectState={location.state} />
          ) : (
            <SignIn redirectState={location.state} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;
