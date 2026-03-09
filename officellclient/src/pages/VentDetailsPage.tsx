import { useParams } from "react-router-dom";
import { CommentSection } from "../components/comment/CommentSection";
import { Sidebar } from "../components/common/Sidebar";
import { VentCard } from "../components/vent/VentCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { CommentCard } from "../components/comment/CommentCard";
import { UserCard } from "../components/user/UserCard";
import useUserStore from "../store/userStore";
import useVentStore from "../store/ventStore";
import useCommentStore from "../store/commentStore";
import Shuffle from "../styles/Shuffle";
import { FaSkullCrossbones } from "react-icons/fa";
import useProfileVentStore from "../store/profileventStore";
import useCompanyVentStore from "../store/companyventStore";
import useTrendingVentStore from "../store/trendingventStore";
import type { Vent } from "../types/vent";




export const VentDetailsPage = () => {

  const {id} = useParams<{id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [interact , setInteract] = useState(false);
  const location = useUserStore((state) => state.location);
  const user = useUserStore((state) => state.user);
  const addComments = useCommentStore((state)=>state.addComments);
  const [vent , setVent] = useState<Vent | null>(null);
  const feedVent = useVentStore((state) => state.getVent(id || ""));
  const profileVent = useProfileVentStore((state)=> state.getVent(id || ""));
  const companyVent = useCompanyVentStore((state)=> state.getVent(id || ""));
  const trendingVent = useTrendingVentStore((state)=>state.getVent(id || ""));
  const comments = useCommentStore((state)=>state.comments);
  const resetComments = useCommentStore((state)=>state.resetComments);


  useEffect(() => {
    const selectedVent =
    feedVent ||
    profileVent ||
    companyVent ||
    trendingVent ||
    null; 
    setVent(selectedVent);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id,interact]);

  useEffect(()=>{
      resetComments();
       // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (comments.length === 0) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        
      
        const { data: commentsJson } = await axios.get(`${import.meta.env.VITE_API}/vents/${id}/comments?skip=${skip}`, {
          withCredentials: true
        });
        
        const newComments = commentsJson.comments;
        
        // Check if we've reached the end of the list
        if (newComments.length === 0) {
          setHasMore(false);
        } else {
          addComments(newComments);
        }
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch companies");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    if (hasMore || comments.length === 0) {
      const timer = setTimeout(()=>{
        fetchComments();
      },100) ;
      return()=>clearTimeout(timer);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, id]);

    const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    const threshold = 1000; 
        if (scrollHeight - (offsetHeight + scrollTop) < threshold && !loadingMore && hasMore) {
              setSkip(comments.length);
    }
  }

  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
    <div className="border-r-1  border-gray-700  " >
      <Sidebar/>
      </div>
      {/* Main Content */}
        <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        <div className="flex-1 bg-gray-950 overflow-y-scroll " onScroll={handleScroll} >
        { vent &&
                    <span onClick={()=>{
                      setInteract(!interact);
                    }}>
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
                    />
                    </span>
                    
        }
          <div className="space-y-4 ">
          {vent &&  <CommentSection vent_id ={vent.id}></CommentSection> }
              {loading && !vent && 
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
              {!loading && comments.length === 0 && vent && (
                <div className="text-center text-gray-500 py-6">
                  Be the first to comment
                </div>
              )}
                {/* Error message */}
                      {error && (
                          <div className="text-red-500 text-center p-4">
                                {error}
                            </div>
                          )}

            {/* Render Comments */}
          {comments.map((comment, index )=> (
            <CommentCard
              key={index}
              comment={comment}
              user_id = {user.id}
            />
          ))}

              {/* Loading more indicator */}
                  {loadingMore &&   <div className="flex justify-center items-center py-10 w-full">
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
                  </div>}
                                     {/* End of results message */}
                                    {!hasMore && comments.length > 0 && (
                                        <div className="text-center text-gray-400 py-6 flex justify-center items-center space-x-2">
                                                                <FaSkullCrossbones />
                                                                <span>THE END</span>
                                        </div>
                              )}
          </div>
        </div>
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4 ">
              <UserCard username={user.username} location={location.city} />
        </div>
      </div>
    </div>
  );
};