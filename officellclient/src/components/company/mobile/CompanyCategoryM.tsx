// React-only Drawer Sidebar (No Flowbite)

import { useEffect, useRef, useState } from "react";
import { MdOutlineCategory } from "react-icons/md";
import { categories } from "../../../utils/companyCategory";
import useCompanyStore from "../../../store/companyStore";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import Select from "react-select";

const customRender = (props) => {
  const { options, disabled, customProps, ...selectProps } = props;

  return (
    <Select
      {...selectProps}
      options={options}
      isDisabled={disabled}
      isSearchable
      isClearable
      value={customProps.reactSelectValue}
      onChange={customProps.onChange}
    />
  );
};

export const CompanyCategoryM = ({ category, onSelect }) => {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const country = useCompanyStore((s) => s.searchcountry);
  const region = useCompanyStore((s) => s.region);
  const resetCompanies = useCompanyStore((s) => s.resetCompanies);
  const setCountry = useCompanyStore((s) => s.setCountry);
  const setRegion = useCompanyStore((s) => s.setRegion);

  const handleCategory = (e) => {
    if (category) onSelect("");
    else onSelect(e.target.value);
  };

  // Close drawer on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        open &&
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="lg:hidden">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center p-2 mt-2 ms-3 hover:bg-gray-800 active:scale-95 transition text-sm sm:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 ${
          category ? "bg-gray-50 text-gray-950" : "text-white"
        }`}
      >
        <MdOutlineCategory className="h-6 w-full" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-950 border-r border-gray-700 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto flex flex-col justify-between">
          {/* Header */}
          <h1 className="text-4xl mt-4 font-arimo text-white font-bold tracking-[-0.07em]">
            ⟢ OFFICELL
          </h1>

          {/* Filters Section */}
          <div className="space-y-6 bg-gray-950 p-6 rounded-2xl">
            {/* Country */}
            <div>
              <h2 className="text-sm font-dmsans tracking-[1px] mb-2 text-gray-50">Country</h2>
              <CountryDropdown
                value={country?.value || ""}
                className="country w-full"
                name="country-field"
                customRender={customRender}
                customProps={{
                  reactSelectValue: country,
                  onChange: (value) => {
                    resetCompanies();
                    setCountry(value || undefined);
                    setRegion(null);
                  },
                }}
              />
            </div>

            {/* City */}
            <div>
              <h2 className="text-sm font-dmsans tracking-[1px] mb-2 text-gray-50">City</h2>
              <RegionDropdown
                country={country?.value || ""}
                value={region?.value || ""}
                className="region w-full"
                name="region-field"
                customRender={customRender}
                customProps={{
                  reactSelectValue: region,
                  onChange: (value) => {
                    resetCompanies();
                    setRegion(value || undefined);
                  },
                }}
              />
            </div>
          </div>

          {/* Category List */}
          <div className="w-full bg-gray-950 overflow-y-scroll no-scrollbar mt-3">
            <h2 className="px-4 pt-4 text-md font-dmsans text-white tracking-[1px]">
              Company Categories
            </h2>
            <div className="flex flex-col gap-4 p-4">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  value={cat.name}
                  onClick={handleCategory}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-dmsans rounded-2xl border border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700 hover:border-gray-500 transition-all ${
                    category === cat.name ? "border-white" : ""
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};