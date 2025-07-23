import Register from "./Register";
import SignIn from "./SignIn";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const AuthChoice = () => {
  const [showRegister, setShowRegister] = useState(true);
  const location = useLocation();

  // Pass location.state to Register and SignIn for redirect after auth
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            showRegister
              ? "bg-[#6A5631] text-white"
              : "bg-white text-[#6A5631] border"
          }`}
          onClick={() => setShowRegister(true)}
        >
          Create Account
        </button>
        <button
          className={`px-4 py-2 rounded ${
            !showRegister
              ? "bg-[#6A5631] text-white"
              : "bg-white text-[#6A5631] border"
          }`}
          onClick={() => setShowRegister(false)}
        >
          Sign In
        </button>
      </div>
      <div className="w-full max-w-md">
        {showRegister ? (
          <Register redirectState={location.state} />
        ) : (
          <SignIn redirectState={location.state} />
        )}
      </div>
    </div>
  );
};

export default AuthChoice;
