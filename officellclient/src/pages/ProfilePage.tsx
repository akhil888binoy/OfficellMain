import { TimelineShell } from "../components/common/TimelineShell";
import { TopicAside, TopicFilters } from "../components/common/TopicFilters";
import PostCard from "../components/vent/PostCard";
import { VentCard } from "../components/vent/VentCard";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useUserStore from "../store/userStore";
import Shuffle from "../styles/Shuffle";
import { FaSkullCrossbones } from "react-icons/fa";
import useProfileVentStore from "../store/profileventStore";
import { PAGE_SIZE } from "../utils/pagesize";
import useTrendingVentStore from "../store/trendingventStore";
import useCompanyStore from "../store/companyStore";
import useCompanyVentStore from "../store/companyventStore";
import useVentStore from "../store/ventStore";
import { ventLocationLabel } from '../utils/ventLocationLabel';

export const ProfilePage = () => {

  const scrollToRef = useRef<null | HTMLDivElement>(null);
  const scrollToCard= useProfileVentStore((state)=> state.scrollToItem) ;
  const [error, setError] = useState<string | null>(null);
  const skip = useProfileVentStore((state)=> state.scrollSkip);
  const loadingMore = useProfileVentStore((state)=> state.scrollLoadinMore);
  const loading = useProfileVentStore((state)=> state.scrollLoading);
  const category = useProfileVentStore((state)=> state.scrollCategory);
  const hasMore = useProfileVentStore((state)=> state.scrollHasMore);
  const user = useUserStore((state) => state.user);
  const addUser = useUserStore((state) => state.addUser);
  const addVents = useProfileVentStore((state) => state.addVents);
  const vents = useProfileVentStore((state) => state.profilevents);
  const addScrollSkip = useProfileVentStore((state)=> state.addScrollSkip);
  const addloading = useProfileVentStore((state)=> state.addScrollLoading);
  const addloadingMore = useProfileVentStore((state)=> state.addScrollLoadingMore);
  const addHasMore = useProfileVentStore((state)=> state.addHasMore);
  const addScrollToItem = useProfileVentStore((state)=> state.addScrollToItem);
  const resetScrollToItemTrending = useTrendingVentStore((state)=> state.resetScrollToItem);
  const resetScrollToItemCompany = useCompanyStore((state)=> state.resetScrollToItem);
  const resetScrollToItemCompanyVent = useCompanyVentStore((state)=> state.resetScrollToItem);
  const resetScrollToItemFeed = useVentStore((state)=> state.resetScrollToItem);
  const logoutTrendingVents = useTrendingVentStore((state)=> state.logout);
  const refreshButton = useVentStore((state)=> state.refreshButton);

  const selectCategory = (value: string) => {
    if (value === category) return;
    useProfileVentStore.setState({ profilevents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true, scrollLoadinMore: false, scrollCategory: value, scrollToItem: null });
  };

  useEffect(()=>{
    logoutTrendingVents();
    resetScrollToItemTrending();
    resetScrollToItemCompany();
    resetScrollToItemCompanyVent();
    resetScrollToItemFeed();
    if(scrollToRef.current ) {
          scrollToRef.current.scrollIntoView();
      }
       // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${import.meta.env.VITE_API}/profile`, { withCredentials: true, signal: controller.signal })
      .then(({ data }) => addUser(data))
      .catch(error => { if (!axios.isCancel(error)) console.error(error); });
    return () => controller.abort();
  }, [addUser]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchVents = async () => {
      try {

        if (!user.id) return;

        if (vents.length === 0) {
          addloading(true);
        } else {
          addloadingMore(true);
        }
        
       
        const { data: ventsJson } = await axios.get(`${import.meta.env.VITE_API}/vents?skip=${skip}&author_id=${user.id}&category=${category}`,
          { 
           signal: controller.signal,
            withCredentials: true
          } 
        );
        
        
        if (ventsJson.vents.length < PAGE_SIZE) {
          addHasMore(false);  
        }
        if (ventsJson.vents.length > 0) {
          addVents(ventsJson.vents);
        }

        setError(null);
      } catch (error) {
          if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
          } else {
            console.error(error);
            setError("Failed to fetch vents");
          }
      } finally {
        addloading(false);
        addloadingMore(false);
      }
    };
    
    if (hasMore || vents.length === 0) {
      const timer = setTimeout(()=>{
        fetchVents();
      },100) ;
      return () => {
          clearTimeout(timer);
          controller.abort(); 
      };
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, category, refreshButton, user.id]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const target = e.currentTarget; // safer than e.target
  const { offsetHeight, scrollTop, scrollHeight } = target;
  const threshold = 1000;

  if (scrollHeight - (offsetHeight + scrollTop) < threshold && !loadingMore && hasMore) {
    addScrollSkip(vents.length);
  }
};

  return (
    <TimelineShell title={user.username || "Profile"} prominentTitle subtitle="Your stories and activity" onScroll={handleScroll} headerContent={<TopicFilters category={category} onSelect={selectCategory} />} aside={<TopicAside category={category} onSelect={selectCategory} />}>
            <PostCard timeline />
            <h3 className="border-b border-gray-800 px-5 py-3 text-sm font-medium text-gray-300">Your posts</h3>
              {loading && vents.length === 0 && 
                                          <div className="flex justify-center items-center py-10 w-full">
                    <Shuffle
                      text="⟢ OFFICELL"
                      className="font-arimo text-white font-bold tracking-[-0.001em] text-xl sm:text-xl md:text-6xl lg:text-[70px]"
                      shuffleDirection="right"
                      duration={0.35}
                      animationMode="evenodd"
                      shuffleTimes={1}
                      ease="power3.out"
                      stagger={0.03}
                      threshold={0.1}
                      loop={true}
                      respectReducedMotion={true}
                    />
                  </div>
                        }
              {!loading && vents.length === 0 && (
                <div className="text-center text-gray-500 py-6">Come on! spill something</div>
              )}
                            {/* Error message */}
                                    {error && (
                                      <div className="text-red-500 text-center p-4">
                                        {error}
                                      </div>
                                    )}
                                     {/* Companies list */}
                                      {vents.map((vent,index) => (
                                            <div key={vent.id} onClick={()=> addScrollToItem(index) }>
                                              <VentCard timeline
                                                id={vent.id}
                                                company_id={vent.company_id ?? vent.company?.id}
                                                category= {vent.category}
                                                content = {vent.content}
                                                upvote={vent.upvote}
                                                downvote={vent.downvote}
                                                company_country={vent.company?.country}
                                                location_label={ventLocationLabel(vent)}
                                                company_name={vent.company?.name}
                                                author={vent.author?.username}
                                                author_id = {vent.author_id}
                                                commentcount = {vent._count?.comments}
                                                createdAt= {vent.createdAt}
                                                media = {vent.Media}
                                                votes={vent.votes}
                                                user_id = {user.id}
                                                ref={index === scrollToCard ?  scrollToRef : null}
                                            />     
                                            </div>
                                      ))}
                                     {/* Loading more indicator */}
                                    {loadingMore && 
                                      <div className="flex justify-center items-center py-10 w-full">
                    <Shuffle
                      text="⟢ OFFICELL"
                      className="font-arimo text-white font-bold tracking-[-0.001em] text-xl sm:text-xl md:text-6xl lg:text-[70px]"
                      shuffleDirection="right"
                      duration={0.35}
                      animationMode="evenodd"
                      shuffleTimes={1}
                      ease="power3.out"
                      stagger={0.03}
                      threshold={0.1}
                      loop={true}
                      respectReducedMotion={true}
                    />
                  </div>
                                  }
                                    
                                     {/* End of results message */}
                                    {!hasMore && vents.length > 0 && (
                                      <div className="text-center text-gray-400 py-6 flex justify-center items-center space-x-2">
                                        <FaSkullCrossbones />
                                        <span>THE END</span>
                                      </div>
                                    )}
    </TimelineShell>
  );
};
