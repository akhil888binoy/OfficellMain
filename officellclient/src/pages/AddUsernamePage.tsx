import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function AddUsernamePage() {

  const [username, setUsername] = useState("");
  const [step, setStep] = useState(2); 
  const navigate = useNavigate();

  const handleNext = async () => {
    if (username.trim()) {

      setStep(3);
      await axios.post(`${import.meta.env.VITE_API}/add-username`, {
        new_username: username
      },{
          withCredentials: true
      });
      setTimeout(() => {
        navigate("/feed");
      }, 1200);

    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6">
      {/* Stepper */}
      <div className="flex items-center justify-center w-full max-w-xl mb-10">
        {/* Step 1 */}
        <div className="flex flex-col items-center flex-1">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <p className="mt-2 text-sm">LinkedIn</p>
        </div>
        <div className="flex-1 h-1 bg-green-500" />

        {/* Step 2 */}
        <div className="flex flex-col items-center flex-1">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step === 2 ? "bg-blue-500" : " bg-green-500"
            }`}
          >
            <FaUser className="w-5 h-5 text-white" />
          </div>
          <p className="mt-2 text-sm">Username</p>
        </div>
        <div className={`flex-1 h-1 ${step === 3 ? "bg-green-500" : "bg-gray-700"}`} />

        {/* Step 3 */}
        <div className="flex flex-col items-center flex-1">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step === 3 ? "bg-green-500" : "bg-gray-700"
            }`}
          >
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <p className="mt-2 text-sm">Done</p>
        </div>
      </div>

      {/* Username Form */}
      {step === 2 && (
  <div className="w-full max-w-md bg-gray-950 p-6 shadow-lg">
    <h2 className="text-xl font-semibold mb-4">Choose your username</h2>

    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="Enter your username"
      className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    {username.length > 0 && username.length < 5 && (
      <p className="text-red-500 text-sm mt-2">
        Username must be at least 5 characters long.
      </p>
    )}

    <button
      onClick={handleNext}
      disabled={username.trim().length < 5}
      className={`mt-4 w-full py-3 rounded-lg text-sm font-semibold transition ${
        username.trim().length >= 5
          ? "bg-blue-500 hover:bg-blue-600 text-white"
          : "bg-gray-700 text-gray-400 cursor-not-allowed"
      }`}
    >
      Continue
    </button>
  </div>
)}

      {step === 3 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-400 tracking-tighter" >🎉 All Done !</h2>
          <p className="mt-2 text-gray-400 font-arimo">
            Your username <span className="text-white font-semibold">{username}</span> has been saved.
          </p>
        </div>
      )}
    </div>
  );
}
