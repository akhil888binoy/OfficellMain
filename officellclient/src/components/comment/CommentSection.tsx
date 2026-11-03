// src/components/CommentSection.jsx
import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import useCommentStore from "../../store/commentStore";
import Shuffle from "../../styles/Shuffle";
import { useNavigate } from 'react-router-dom';

interface CommentSectionProps {
  vent_id: string; 
}

export const CommentSection = ({ vent_id }: CommentSectionProps) => {
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState("");
    const [loading , setLoading]= useState(false);
    const addComment = useCommentStore((state)=> state.addComment);

    const handleComment = async ()=>{
    if(!newComment){
      toast.error('Write a comment first.');
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
        if (axios.isAxiosError(error) && error.response?.data?.code === 'USERNAME_REQUIRED') {
          setLoading(false);
          navigate('/username');
          return;
        }
        toast.error(axios.isAxiosError(error) && error.response?.status === 422 ? 'Remove email addresses, phone numbers, and exact dates before commenting.' : 'Could not add the comment. Try again.');
          setLoading(false);
        
      }
    }

  return (
    <div  >
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
      {/* Comment composer */}
      <div className="w-full border-b border-gray-800 bg-gray-950">
        <div className="flex gap-3 px-4 py-4 sm:px-5">
          <div aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-medium text-gray-300">?</div>
          <div className="min-w-0 flex-1">
          <label htmlFor="post-comment" className="sr-only">Write a comment</label>
          <textarea
            id="post-comment"
            rows={2}
            maxLength={1000}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="block w-full resize-y bg-transparent text-sm leading-6 text-white placeholder-gray-500 focus:outline-none sm:text-base"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleComment}
              className="shrink-0 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-gray-950 transition-colors hover:bg-gray-200"
            >
              Comment
            </button>
          </div>
          </div>
        </div>

      </div>
      </>
      }
      
    </div>
  );
};
