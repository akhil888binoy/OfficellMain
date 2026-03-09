
import { categories } from "../../utils/ventCategory";

interface CategoryBarProps {
  category: string;
  onSelect: (value: string) => void;
}


export const CategoryBar = ({ category, onSelect }: CategoryBarProps) => {


  const handleCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
  if (category) {
    onSelect("");
  } else {
    onSelect((e.target as HTMLButtonElement).value);
  }
};

  return (
    <div className="w-full  bg-gray-950 overflow-y-auto no-scrollbar mt-3">
      {/* Heading */}
      <h2 className="px-4 pt-4 text-md font-dmsans text-white tracking-[1px]">Categories</h2>
      
      {/* Category Buttons */}
      <div className="flex flex-col gap-4 p-4">
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={handleCategory}
            value={cat.name}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-dmsans fopnt-light tracking-[1px] rounded-4xl
              border border-gray-700 bg-gray-800 text-gray-200
              hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.02] 
              active:scale-95 active:bg-gray-600
              focus:outline-none
              transition-all duration-200 ease-in-out shadow-sm
              ${category === cat.name?'border-2 border-white':''} `}>
            <span className="text-lg">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};
