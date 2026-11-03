import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import axios from "axios";
import useVentStore from "../../store/ventStore";

const RefreshFeed = ({ category, sort, onRefresh }: { category: string; sort: string; onRefresh?: () => void }) => {
  const vents = useVentStore(state => state.vents);
  const newestId = Math.max(0, ...vents.map(vent => Number(vent.id) || 0));
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    setNewCount(0);
    if (!newestId || sort !== "new") return;
    let active = true;
    const checkForNewPosts = async () => {
      try {
        const params = new URLSearchParams({ skip: "0", category, sort: "new" });
        const { data } = await axios.get(`${import.meta.env.VITE_API}/vents?${params}`, { withCredentials: true });
        if (active) setNewCount((data.vents ?? []).filter(vent => Number(vent.id) > newestId).length);
      } catch (error) {
        if (active) console.error(error);
      }
    };
    void checkForNewPosts();
    const interval = setInterval(checkForNewPosts, 50000);
    return () => { active = false; clearInterval(interval); };
  }, [newestId, category, sort]);

  if (!newCount) return null;

  const showNewPosts = () => {
    setNewCount(0);
    useVentStore.setState({ vents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true, scrollLoadinMore: false, scrollToItem: null, refreshButton: false });
    onRefresh?.();
  };

  return <div className="flex justify-center border-b border-gray-800 bg-gray-950 px-4 py-3">
    <button type="button" onClick={showNewPosts} className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-100 transition-colors hover:bg-gray-800">
      <ArrowUp className="size-4" aria-hidden="true" />
      Show new posts
    </button>
  </div>;
};

export default RefreshFeed;
