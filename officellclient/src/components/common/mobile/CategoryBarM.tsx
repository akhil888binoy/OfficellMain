import { useEffect, useRef, useState } from "react";
import { MdOutlineCategory } from "react-icons/md";
import { categories } from "../../../utils/ventCategory";

interface CategoryBarProps {
  category: string;
  onSelect: (value: string) => void;
}

export const CategoryBarM = ({ category, onSelect }: CategoryBarProps) => {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

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

  const handleCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (category) onSelect("");
    else onSelect((e.target as HTMLButtonElement).value);
    setOpen(false); // close drawer on category selection
  };

  return (
    <div className="lg:hidden">

      {/* --- Toggle Button --- */}
      <button
        onClick={() => setOpen(true)}
        className={`items-center justify-center ms-3 mt-2 p-2 hover:bg-gray-800 active:scale-95 transition text-sm sm:hidden
        focus:outline-none focus:ring-2 focus:ring-gray-200 
        ${category ? "bg-gray-50 text-gray-950" : "text-white"}`}
      >
        <MdOutlineCategory className="h-6 w-6" />
      </button>

      {/* --- Backdrop --- */}
      {open && (
        <div className="fixed inset-0 bg-black/60 z-30 sm:hidden"></div>
      )}

      {/* --- Drawer Sidebar --- */}
      <aside
        ref={drawerRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-950 border-r border-gray-700 transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} 
          sm:-translate-x-full`}
      >
        <div className="h-full px-3 py-4 flex flex-col justify-between">

          {/* Logo */}
          <h1 className="text-4xl mt-4 font-arimo text-white font-bold tracking-tight">
            ⟢ OFFICELL
          </h1>

          {/* --- Category Section --- */}
          <div className="mt-3 overflow-y-scroll no-scrollbar bg-gray-950 flex-1">
            <h2 className="px-4 pt-4 text-sm font-dmsans text-white tracking-[1px]">
              Categories
            </h2>

            <div className="flex flex-col gap-4 p-4">
              {categories.map((cat, index) => (
                <button
                  key={index}
                  value={cat.name}
                  onClick={handleCategory}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-dmsans font-light tracking-[0.5px] rounded-3xl
                        border border-gray-700 bg-gray-800 text-gray-200
                        hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.01]
                        active:scale-95 active:bg-gray-600
                        transition-all duration-200 ease-in-out shadow-sm
                        ${category === cat.name ? "border-white" : ""}`}
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
