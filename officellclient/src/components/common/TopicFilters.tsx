import { categories } from "../../utils/ventCategory";

export const TopicFilters = ({ category, onSelect }: { category: string; onSelect: (value: string) => void }) => (
  <div aria-label="Filter stories by topic" className="flex gap-1 overflow-x-auto px-3 pb-2 no-scrollbar">
    <button type="button" onClick={() => onSelect("")} aria-pressed={!category} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${!category ? "bg-white text-gray-950" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>All posts</button>
    {categories.map(item => <button key={item.name} type="button" onClick={() => onSelect(item.name)} aria-pressed={category === item.name} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${category === item.name ? "bg-white text-gray-950" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>{item.name}</button>)}
  </div>
);

export const TopicAside = ({ category, onSelect }: { category: string; onSelect: (value: string) => void }) => (
  <div className="max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl bg-gray-900 no-scrollbar">
    <h2 className="px-5 pb-3 pt-5 text-base font-medium text-gray-100">Explore topics</h2>
    {categories.map(item => <button key={item.name} type="button" onClick={() => onSelect(item.name)} className={`flex w-full items-center gap-3 px-5 py-3 text-left text-sm transition-colors hover:bg-gray-800 ${category === item.name ? "text-white" : "text-gray-300"}`}><span className="text-gray-400">{item.icon}</span><span className="font-medium">{item.name}</span></button>)}
    <button type="button" onClick={() => onSelect("")} className="w-full px-5 py-4 text-left text-sm text-gray-400 hover:bg-gray-800 hover:text-white">Show all stories</button>
  </div>
);
