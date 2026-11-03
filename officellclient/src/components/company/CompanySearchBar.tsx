import { FaSearch } from "react-icons/fa";

interface CompanySearchBarProps {
  search: string;
  onSearch: (value: string) => void;
  compact?: boolean;
}

export default function CompanySearchBar({ search, onSearch, compact = false }: CompanySearchBarProps) {
  return (
  <div className={`flex w-full items-center text-sm ${compact ? 'rounded-xl border border-gray-700 bg-gray-900 px-3 py-2.5 focus-within:border-gray-400' : 'rounded-full bg-gray-800 px-4 py-3'}`}>
      <FaSearch className="text-gray-400 mr-3 text-lg" />
      <input
        value={search}
        type="text"
        aria-label="Search companies"
        autoFocus={compact}
        placeholder="Search companies..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none"
      />
    </div>
  );
}
