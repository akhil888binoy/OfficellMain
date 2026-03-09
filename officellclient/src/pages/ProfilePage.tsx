import {CategoryBar} from "../components/common/CategoryBar";
import { CategoryBarM } from "../components/common/mobile/CategoryBarM";
import PostCard from "../components/vent/PostCard";
import { Sidebar } from "../components/common/Sidebar";
import { UserCard } from "../components/user/UserCard";
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

export const ProfilePage = () => {

  const scrollToRef = useRef<null | HTMLDivElement>(null);
  const scrollToCard= useProfileVentStore((state)=> state.scrollToItem) ;
  const [error, setError] = useState<string | null>(null);
  const skip = useProfileVentStore((state)=> state.scrollSkip);
  const loadingMore = useProfileVentStore((state)=> state.scrollLoadinMore);
  const loading = useProfileVentStore((state)=> state.scrollLoading);
  const category = useProfileVentStore((state)=> state.scrollCategory);
  const hasMore = useProfileVentStore((state)=> state.scrollHasMore);
  const location = useUserStore((state) => state.location)
  const user = useUserStore((state) => state.user);
  const addVents = useProfileVentStore((state) => state.addVents);
  const reset = useProfileVentStore((state)=>state.reset);
  const vents = useProfileVentStore((state) => state.profilevents);
  const addScrollSkip = useProfileVentStore((state)=> state.addScrollSkip);
  const addloading = useProfileVentStore((state)=> state.addScrollLoading);
  const addloadingMore = useProfileVentStore((state)=> state.addScrollLoadingMore);
  const addcategory = useProfileVentStore((state)=> state.addScrollCategory);
  const addHasMore = useProfileVentStore((state)=> state.addHasMore);
  const addScrollToItem = useProfileVentStore((state)=> state.addScrollToItem);
  const resetScrollToItemTrending = useTrendingVentStore((state)=> state.resetScrollToItem);
  const resetScrollToItemCompany = useCompanyStore((state)=> state.resetScrollToItem);
  const resetScrollToItemCompanyVent = useCompanyVentStore((state)=> state.resetScrollToItem);
  const resetScrollToItemFeed = useVentStore((state)=> state.resetScrollToItem);
  const logoutTrendingVents = useTrendingVentStore((state)=> state.logout);
  const refreshButton = useVentStore((state)=> state.refreshButton);

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
  }, [skip, category,refreshButton]);

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
      <div className="h-screen  border-r-1 border-gray-700  " >
      <Sidebar></Sidebar>
      <CategoryBarM
        category={category}
        onSelect={(q)=>{
            addScrollSkip(0);
            addHasMore(true);
            reset();
            addcategory(q)
          }}
          ></CategoryBarM>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 overflow-y-scroll  " onScroll={handleScroll}>
            <PostCard />
            <div className="border-t border-gray-700">
              <UserCard username={user.username} location={location.city} />
            </div>
          
                <h3 className=" tracking-[1px] lg:text-lg  font-dmsans  text-gray-100  lg:pt-3 lg:px-3 lg:pb-3 pt-2 px-2 pb-2">
                    Confessions
                </h3>
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
                <div className="text-center text-gray-500 py-6">
                  Come on! spill something
                </div>
              )}
                            {/* Error message */}
                                    {error && (
                                      <div className="text-red-500 text-center p-4">
                                        {error}
                                      </div>
                                    )}
                                     {/* Companies list */}
                                      {vents.map((vent,index) => (
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
        </div>
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4 ">
          <UserCard username={user.username} location={location.city} />
          <CategoryBar
            category={category}
            onSelect={(q)=>{
            addScrollSkip(0);
            addHasMore(true);
            reset();
            addcategory(q)
          }}  
          ></CategoryBar>
        </div>
      </div>
    </div>
  );
};
