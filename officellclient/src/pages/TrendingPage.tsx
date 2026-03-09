 import PostCard from "../components/vent/PostCard";
import { Sidebar } from "../components/common/Sidebar";
import { UserCard } from "../components/user/UserCard";
import { VentCard } from "../components/vent/VentCard";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useUserStore from "../store/userStore";
import useVentStore from "../store/ventStore";
import Shuffle from "../styles/Shuffle";
import useTrendingVentStore from "../store/trendingventStore";
import { PAGE_SIZE } from "../utils/pagesize";
import useCompanyStore from "../store/companyStore";
import useCompanyVentStore from "../store/companyventStore";
import useProfileVentStore from "../store/profileventStore";

export const TrendingPage = () => {

  const scrollToRef = useRef<null | HTMLDivElement>(null);
  const scrollToCard= useVentStore((state)=> state.scrollToItem) ;
  const [error, setError] = useState<string | null>(null);
  const refreshButton = useVentStore((state)=> state.refreshButton);
  const skip = useTrendingVentStore((state)=> state.scrollSkip);
  const loadingMore = useTrendingVentStore((state)=> state.scrollLoadinMore);
  const loading = useTrendingVentStore((state)=> state.scrollLoading);
  const hasMore = useTrendingVentStore((state)=> state.scrollHasMore);
  const location = useUserStore((state) => state.location);
  const user = useUserStore((state) => state.user);
  const vents = useTrendingVentStore((state) => state.trendingvents);
  const addVents = useTrendingVentStore((state) => state.addVents);
  const addScrollSkip = useTrendingVentStore((state)=> state.addScrollSkip);
  const addloading = useTrendingVentStore((state)=> state.addScrollLoading);
  const addloadingMore = useTrendingVentStore((state)=> state.addScrollLoadingMore);
  const addHasMore = useTrendingVentStore((state)=> state.addHasMore);
  const addScrollToItem = useTrendingVentStore((state)=> state.addScrollToItem);
  const resetScrollToItemFeed = useVentStore((state)=> state.resetScrollToItem);
  const resetScrollToItemCompany = useCompanyStore((state)=> state.resetScrollToItem);
  const resetScrollToItemCompanyVent = useCompanyVentStore((state)=> state.resetScrollToItem);
  const resetScrollToItemProfileVent = useProfileVentStore((state)=> state.resetScrollToItem);


  useEffect(()=>{
      resetScrollToItemFeed();
      resetScrollToItemCompany();
      resetScrollToItemCompanyVent();
      resetScrollToItemProfileVent();
    if(scrollToRef.current) {
        scrollToRef.current.scrollIntoView();
      }
       // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

useEffect(() => {
    const fetchVents = async () => {
      try {
        if (vents.length === 0) {
          addloading(true);
        } else {
          addloadingMore(true);
        }
        
      
        const { data: ventsJson } = await axios.get(`${import.meta.env.VITE_API}/vents/trending?skip=${skip}`, {
          withCredentials: true
        });
        
        
      if (ventsJson.vents.length < PAGE_SIZE) {
        addHasMore(false);  
      }
      if (ventsJson.vents.length > 0) {
        addVents(ventsJson.vents);
      }
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch companies");
      } finally {
        addloading(false);
        addloadingMore(false);
      }
    };
    
    if (hasMore || vents.length === 0) {
      const timer = setTimeout(()=>{
        fetchVents();
      },100) ;
      return()=>clearTimeout(timer);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, refreshButton]);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const target = e.currentTarget; // safer than e.target
  const { offsetHeight, scrollTop, scrollHeight } = target;
  const threshold = 1000;

  if (scrollHeight - (offsetHeight + scrollTop) < threshold && !loadingMore && hasMore) {
    addScrollSkip(vents.length);
  }
};


  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="h-screen border-r-1 border-gray-700  " >
      <Sidebar/>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 overflow-y-scroll " onScroll={handleScroll}>
            <PostCard />
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
             {/* Error message */}
                      {error && (
                        <div className="text-red-500 text-center p-4">
                          {error}
                        </div>
                      )}
                      
              {!loading && vents.length === 0 && vents && (
                <div className="text-center text-gray-500 py-6">
                  Spill the first trending confession of this week
                </div>
              )}
                      {/* Companies list */}
                      {vents
                      .map((vent ,index)=> (
                        <span key={index} onClick={()=> addScrollToItem(index) }>
                          <VentCard
                            id={vent.id}
                            category= {vent.category}
                            content = {vent.content}
                            upvote={vent.upvote}
                            downvote={vent.downvote}
                            company_country={vent.company?.country}
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
                      </span>
                      ))}
                      
                      {/* Loading more indicator */}
                      {loadingMore && 
                      <div className="flex justify-center items-center py-10 w-full">
                      <Shuffle
                          text="⟢ OFFICELL"
                          className="font-arimo text-white font-bold tracking-[-0.001em] text-xl sm:text-xl md:text-6xl lg:text-[70px] lg:ml-80"
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
                        <div className="text-center text-gray-400 py-6">
                          You've reached the end of the list
                        </div>
                      )}
        </div>
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4 ">
          <UserCard username={user.username} location={location.city} />
        </div>
      </div>
    </div>
  );
};