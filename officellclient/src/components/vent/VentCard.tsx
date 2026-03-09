import { FaArrowUp, FaArrowDown, FaRegComment, FaTrash } from "react-icons/fa";
import { RiBuilding2Line } from "react-icons/ri";
import { MdLocationOn } from "react-icons/md";
import moment from 'moment';
import { forwardRef, useEffect, useState, type Ref } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getName } from "country-list";
import useVentStore from "../../store/ventStore";
import { useLocation } from "react-router-dom";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import useTrendingVentStore from "../../store/trendingventStore";
import useProfileVentStore from "../../store/profileventStore";
import useCompanyVentStore from "../../store/companyventStore";
import type { VentCardProps } from "../../types/vent";

interface VentCardComponentProps extends VentCardProps{
  ref?: Ref<HTMLDivElement>;
}

export const VentCard = forwardRef<HTMLDivElement, VentCardComponentProps>(({ id , category , content , upvote , downvote , company_name , company_country, author, author_id, commentcount , createdAt, media, votes, user_id }, ref) => {

  const [time, setTime] = useState("");
  const [isupvote , setIsUpVote] = useState(false);
  const [isdownvote , setIsDownVote] = useState(false);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const upVote = useVentStore((state)=> state.upVote);
  const upVoteTrending = useTrendingVentStore((state)=> state.upVote);
  const upVoteProfile = useProfileVentStore((state)=> state.upVote);
  const upVoteCompany = useCompanyVentStore((state)=> state.upVote);
  const downVote = useVentStore((state)=> state.downVote);
  const downVoteTrending = useTrendingVentStore((state)=> state.downVote);
  const downVoteProfile = useProfileVentStore((state)=> state.downVote);
  const downVoteCompany = useCompanyVentStore((state)=> state.downVote);
  const deleteVent = useVentStore((state)=>state.deleteVent);
  const deleteTrendingVent = useTrendingVentStore((state)=> state.deleteVent);
  const deleteProfileVent = useProfileVentStore((state)=> state.deleteVent);
  const deleteCompanyVent = useCompanyVentStore((state)=> state.deleteVent);
  const [open , setOpen] = useState(false);
  const page = useLocation();
  const [deletingComment, setDeletingComment] = useState(false);

const cleanCountryName = (name: string | undefined) => {
  if (!name) return '';
  return name
    .replace(/^(?:the\s|The\s)/i, '') 
    .replace(/\s*\(the\)$/i, '') 
    .trim(); 
};

  useEffect(()=>{
    if (votes?.length > 0 ){
      for (const vote of votes){
        if(vote.user_id == user_id && vote.vote=='UPVOTE'){
          setIsUpVote(true)
        } else if (vote.user_id == user_id && vote.vote=='DOWNVOTE'){
          setIsDownVote(true)
        }
      }
    }
         // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

const handleDownvote=async ()=>{
  try {
      setDisableSubmitBtn(true)
      
      let voteenum;
      const vote = votes.find((vote)=> vote.user_id === user_id);
        if(vote){
          if(vote.vote === 'NOVOTE' || vote.vote === 'UPVOTE'){
            voteenum = 'DOWNVOTE';
            setIsDownVote(true);
            setIsUpVote(false);
          }else if (vote.vote ==='DOWNVOTE'){
            voteenum = 'NOVOTE';
            setIsDownVote(false);
            setIsUpVote(false);
          }
        }else{
          voteenum = 'DOWNVOTE';
          setIsDownVote(true);
          setIsUpVote(false);
        }
        downVote(id , user_id, { vent_id: id, user_id, vote: voteenum });
        downVoteProfile(id , user_id, { vent_id: id, user_id, vote: voteenum });
        downVoteTrending(id , user_id, { vent_id: id, user_id, vote: voteenum });
        downVoteCompany(id , user_id, { vent_id: id, user_id, vote: voteenum });
      await axios.post(`${import.meta.env.VITE_API}/vents/${id}/downvote`,"",{
          withCredentials: true
      });

    setDisableSubmitBtn(false)
  } catch (error) {
    console.error(error);
    setDisableSubmitBtn(false);
    toast.error('Oops Failed to Down Vote! Dont worry its a mistake from our side ', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
        });
  }

}

  const handleUpvote= async ()=>{
    try {
        setDisableSubmitBtn(true);
        let voteenum;
        const vote = votes.find((vote)=> vote.user_id === user_id);
        if(vote){
          if(vote.vote === 'NOVOTE' || vote.vote === 'DOWNVOTE'){
            voteenum = 'UPVOTE';
            setIsUpVote(true)
            setIsDownVote(false)
          }else if (vote.vote ==='UPVOTE'){
            voteenum = 'NOVOTE';
            setIsUpVote(false)
            setIsDownVote(false)
          }
        }else{
          voteenum = 'UPVOTE';
          setIsUpVote(true);
          setIsDownVote(false);
        }
       
        upVote(id , user_id, { vent_id: id, user_id, vote: voteenum });
        upVoteProfile(id , user_id, { vent_id: id, user_id, vote: voteenum });
        upVoteTrending(id , user_id, { vent_id: id, user_id, vote: voteenum });
        upVoteCompany(id , user_id, { vent_id: id, user_id, vote: voteenum });
        await axios.post(`${import.meta.env.VITE_API}/vents/${id}/upvote`,"",{
            withCredentials: true
        });
        setDisableSubmitBtn(false);
    } catch (error) {
      console.error(error);
      setDisableSubmitBtn(false);
      toast.error('Oops Failed to Up Vote! Dont worry its a mistake from our side ', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
          });
    }

  }

const handleDeleteVent =async()=>{
  try {
      setDisableSubmitBtn(true);
      setDeletingComment(true);
      await axios.delete(`${import.meta.env.VITE_API}/vents/${id}`,{
          withCredentials: true
      });
    deleteVent(id);
    deleteProfileVent(id);
    deleteTrendingVent(id);
    deleteCompanyVent(id);
    setDisableSubmitBtn(false);
    setOpen(false);
    toast.success('Deleted Successfully 💀', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
    
  } catch (error) {
    console.error(error);
    setDisableSubmitBtn(false);
    toast.error('Oops Failed to Delete! Dont worry its a mistake from our side ', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
        });
    }finally{
      setDeletingComment(false);
    }
}

useEffect(() => {
  if (createdAt) {
    setTime(moment.utc(createdAt).local().startOf("seconds").fromNow());
  }
}, [createdAt]);

  return (
    <>
    { id &&
    <div className="relative flex flex-col bg-gray-950 border-t border-b border-gray-700 w-full overflow-hidden" ref={ref}>
      <a href={`/vent/${id}`} >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* User + Time */}
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-white font-semibold text-sm md:text-baseclea">
                {author}
              </h3>
              <span className="text-xs text-gray-400">{time}</span>
            </div>
          </div>
        
          {/* Company + Location */}
          <div className="flex flex-col items-end text-xs text-gray-300 lg:gap-2 gap-1">
            <div className="flex items-center gap-1 flex-wrap justify-end">
              <span className="text-right  break-words max-w-[140px] md:max-w-[180px]">
                {company_name}
              </span>
                    <RiBuilding2Line className="text-blue-400 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-end">
              <span className="text-right break-words max-w-[140px] md:max-w-[180px]">
  {cleanCountryName(getName(company_country || ''))}
              </span>
              <MdLocationOn className="text-red-400 flex-shrink-0" />
            </div>
          </div>
        </div>
      </a>

      {/* Confession Text */}
      <div className="px-4 pb-3">
        <div className="mb-2">

        <span className="inline-block px-1.5 py-0.5 text-[10px] font-medium rounded bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          {category}
        </span>

        </div>
        <p className="text-gray-200 leading-relaxed text-sm md:text-base lg:text-sm ">
          {content}
        </p>
        <div className="mt-3 flex flex-wrap justify-center items-center gap-3">
        {media?.map((item) => (
          <div key={item.id} className="relative group">
            {item.type === "IMAGE" && (
              <img
                src={item.url}
                alt="Post content"
                className="max-w-full h-auto rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg"
                style={{
                  maxHeight: media.length === 1 ? '480px' : '320px',
                  minHeight: '160px'
                }}
              />
            )}
            {item.type === "VIDEO" && (
              <video
                controls
                className="max-w-full rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg"
                style={{
                  maxHeight: media.length === 1 ? '480px' : '320px',
                  minHeight: '160px'
                }}
              >
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>

      </div>

      {/* Footer (Upvote / Downvote / Comments / Delete) */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          {/* UpVote Button */}
            <button
              onClick={() => {
                if (disableSubmitBtn) {
                  toast.warning('Please wait… Dont spam the button', {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "dark",
                  });
                  return;
                }
                handleUpvote();
              }}
              className={`flex items-center gap-2 transition 
                ${disableSubmitBtn ? 'cursor-not-allowed opacity-50' : 'hover:text-green-400 active:text-green-400'} 
                ${isupvote ? 'text-green-400' : 'text-gray-400'}`}
            >
              <FaArrowUp />
              <span className="text-sm md:text-base">{upvote}</span>
            </button>

          {/* Down Vote */}
              <button
                onClick={() => {
                  if (disableSubmitBtn) {
                    toast.warning("Please wait… Dont spam the button", {
                      position: "top-right",
                      autoClose: 3000,
                      theme: "dark",
                    });
                    return;
                  }
                  handleDownvote();
                }}
                className={`flex items-center gap-2 transition 
                  ${disableSubmitBtn ? "cursor-not-allowed opacity-50" : "hover:text-red-400 active:text-red-400"} 
                  ${isdownvote ? "text-red-400" : "text-gray-400"}`}
              >
                <FaArrowDown />
                <span className="text-sm md:text-base">{downvote}</span>
              </button>
        {/* Comment */}
        {page.pathname != `/vent/${id}` && 
            <button 
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 active:text-blue-400 transition"
              > <a href={`/vent/${id}`} >
                <FaRegComment />
                </a>
                <span className="text-sm md:text-base">{commentcount}</span>
              </button>
          }
          
        </div>
      { author_id === user_id && page.pathname != `/vent/${id}`&&
        <button 
                onClick={() => setOpen(true)}
                disabled={disableSubmitBtn}  className="flex items-center gap-2 text-gray-400 hover:text-red-400 active:text-red-600 transition">
          <FaTrash />
        </button>
      }
      
    <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-gray-950 text-left shadow-xl outline -outline-offset-1 outline-white/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-gray-950 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
                    <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-white">
                      Delete this Confession
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        Are you sure you want to delete this confession ?
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-950 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">

                <button
                  type="button"
                  onClick={handleDeleteVent}
                  className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                >
                {deletingComment ? "Deleting..." : "Delete"}
                </button>
                
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>


      </div>
    </div> 
    }
    </>
  );
});