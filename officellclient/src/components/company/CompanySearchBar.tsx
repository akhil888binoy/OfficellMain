import { FaSearch } from "react-icons/fa";

interface CompanySearchBarProps {
  search: string;
  onSearch: (value: string) => void;
}

export default function CompanySearchBar({ search, onSearch }: CompanySearchBarProps) {
  return (
  <div className="flex items-center w-full max-w-sm mx-auto bg-gray-950 
        mt-3 mb-3 border rounded-2xl lg:border-gray-700 px-3 py-2 text-sm">
      <FaSearch className="text-gray-400 mr-3 text-lg" />
      <input
        value={search}
        type="text"
        placeholder="Search companies..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full bg-gray-950 text-gray-200 placeholder-gray-500 focus:outline-none"
      />
    </div>
  );
}
