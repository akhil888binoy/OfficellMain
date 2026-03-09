// src/components/CommentSection.jsx
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import useCommentStore from "../../store/commentStore";
import Shuffle from "../../styles/Shuffle";

interface CommentSectionProps {
  vent_id: string; 
}

export const CommentSection = ({ vent_id }: CommentSectionProps) => {
    const [newComment, setNewComment] = useState("");
    const [loading , setLoading]= useState(false);
    const addComment = useCommentStore((state)=> state.addComment);

    const handleComment = async ()=>{
    if(!newComment){
      toast.error('Type some comment !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
      return;
    }
      try {
        setLoading(true);
      
        const  {data:response} = await axios.post(`${import.meta.env.VITE_API}/vents/${vent_id}/comments`, {
          comment: newComment
        },{
                    withCredentials: true
      });
      setLoading(false);
      addComment(response.comment);
      setNewComment("");
      } catch (error) {
        console.error(error);
        toast.error('Oops Failed to Post!', {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: false,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "dark",
                });
          setLoading(false);
        
      }
    }

  return (
    <div  >
      <ToastContainer></ToastContainer>

      {loading ?   
              <div className="flex justify-center items-center py-10 w-full">
                    <Shuffle
                      text="Thanks for the support"
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
       : 
      <>
      {/* Comment Input Styled like PostCard */}
      <div className="w-full  bg-gray-950  border-b-1 border-gray-700">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 ">
          <input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full resize-none overflow-hidden rounded-lg bg-gray-950 text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
          />
        </div>

        <div className="flex justify-end px-2 sm:px-4 pb-2 pt-2">
          <button
            onClick={handleComment}
            className="ml-auto rounded-full border border-gray-500 
                      px-3 py-2 text-xs 
                      sm:px-5 sm:py-2 sm:text-sm 
                      font-semibold uppercase tracking-wide text-white 
                      hover:bg-white hover:text-black active:scale-95 transition"
          >
            comment
          </button>
        </div>

      </div>
      </>
      }
      
    </div>
  );
};
