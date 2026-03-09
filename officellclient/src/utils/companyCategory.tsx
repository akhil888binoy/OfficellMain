import { FaRocket, FaBuilding, FaLaptopCode, FaBriefcase, FaIndustry, FaHospital, FaGraduationCap, FaFilm, FaBalanceScale, FaLeaf } from "react-icons/fa";

export const categories = [
  { name: "Startups", icon: <FaRocket className="text-pink-500" /> },
  { name: "MNCs", icon: <FaBuilding className="text-blue-500" /> },
  { name: "Tech", icon: <FaLaptopCode className="text-indigo-500" /> },
  { name: "Finance", icon: <FaBriefcase className="text-gray-50" /> },
  { name: "Manufacturing", icon: <FaIndustry className="text-orange-500" /> },
  { name: "Healthcare", icon: <FaHospital className="text-red-500" /> },
  { name: "Education", icon: <FaGraduationCap className="text-green-600" /> },
  { name: "Media ", icon: <FaFilm className="text-pink-600" /> },
  { name: "Law", icon: <FaBalanceScale className="text-yellow-700" /> },
  { name: "NGOs ", icon: <FaLeaf className="text-green-500" /> },
];