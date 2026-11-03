import { FaArrowUp, FaArrowDown, FaRegComment, FaTrash } from "react-icons/fa";
import { RiBuilding2Line } from "react-icons/ri";
import { MdLocationOn } from "react-icons/md";
import moment from 'moment';
import { forwardRef, useEffect, useState, type Ref } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { getName } from "country-list";
import useVentStore from "../../store/ventStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ConfirmDialog } from '../common/ConfirmDialog';
import useTrendingVentStore from "../../store/trendingventStore";
import useProfileVentStore from "../../store/profileventStore";
import useCompanyVentStore from "../../store/companyventStore";
import type { Vent, VentCardProps, Vote } from "../../types/vent";

const withVote = (vent: Vent, ventId: string, serverVote: Vote): Vent => {
  if (String(vent.id) !== String(ventId)) return vent;
  const votes = vent.votes ?? [];
  const voterId = Number(serverVote.user_id);
  const previous = votes.find(vote => Number(vote.user_id) === voterId)?.vote ?? 'NOVOTE';
  const next = serverVote.vote;
  return {
    ...vent,
    upvote: Math.max(0, Number(vent.upvote) + Number(next === 'UPVOTE') - Number(previous === 'UPVOTE')),
    downvote: Math.max(0, Number(vent.downvote) + Number(next === 'DOWNVOTE') - Number(previous === 'DOWNVOTE')),
    votes: [...votes.filter(vote => Number(vote.user_id) !== voterId), { ...serverVote, user_id: String(serverVote.user_id) }],
  };
};

interface VentCardComponentProps extends VentCardProps{
  ref?: Ref<HTMLDivElement>;
  timeline?: boolean;
}

export const VentCard = forwardRef<HTMLDivElement, VentCardComponentProps>(({ id , company_id, category , content , upvote , downvote , company_name , company_country, location_label, author, author_id, commentcount , createdAt, media, votes, user_id, timeline = false }, ref) => {

  const [time, setTime] = useState("");
  const [isupvote , setIsUpVote] = useState(false);
  const [isdownvote , setIsDownVote] = useState(false);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const deleteVent = useVentStore((state)=>state.deleteVent);
  const deleteTrendingVent = useTrendingVentStore((state)=> state.deleteVent);
  const deleteProfileVent = useProfileVentStore((state)=> state.deleteVent);
  const deleteCompanyVent = useCompanyVentStore((state)=> state.deleteVent);
  const [open , setOpen] = useState(false);
  const page = useLocation();
  const isDetailPage = page.pathname === `/vent/${id}`;
  const navigate = useNavigate();
  const [deletingComment, setDeletingComment] = useState(false);

const cleanCountryName = (name: string | undefined) => {
  if (!name) return '';
  return name
    .replace(/^(?:the\s|The\s)/i, '') 
    .replace(/\s*\(the\)$/i, '') 
    .trim(); 
};

  useEffect(() => {
    const current = votes?.find(vote => Number(vote.user_id) === Number(user_id))?.vote;
    setIsUpVote(current === 'UPVOTE');
    setIsDownVote(current === 'DOWNVOTE');
  }, [votes, user_id]);

  const syncVote = (vote: Vote) => {
    useVentStore.setState(state => ({ vents: state.vents.map(vent => withVote(vent, id, vote)) }));
    useTrendingVentStore.setState(state => ({ trendingvents: state.trendingvents.map(vent => withVote(vent, id, vote)) }));
    useProfileVentStore.setState(state => ({ profilevents: state.profilevents.map(vent => withVote(vent, id, vote)) }));
    useCompanyVentStore.setState(state => ({ companyvents: state.companyvents.map(vent => withVote(vent, id, vote)) }));
    setIsUpVote(vote.vote === 'UPVOTE');
    setIsDownVote(vote.vote === 'DOWNVOTE');
  };

  const voteErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 404) return 'This post is no longer available. Refresh the feed.';
    if (axios.isAxiosError(error) && !error.response) return 'Could not reach the server. Check your connection and try again.';
    return 'Could not save your vote. Please try again.';
  };

const handleDownvote=async ()=>{
  try {
    setDisableSubmitBtn(true);
    const { data } = await axios.post(`${import.meta.env.VITE_API}/vents/${id}/downvote`, {}, { withCredentials: true });
    syncVote(data.vote);
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      navigate('/sessionexpired');
      return;
    }
    toast.error(voteErrorMessage(error));
  } finally {
    setDisableSubmitBtn(false);
  }

}

  const handleUpvote= async ()=>{
    try {
      setDisableSubmitBtn(true);
      const { data } = await axios.post(`${import.meta.env.VITE_API}/vents/${id}/upvote`, {}, { withCredentials: true });
      syncVote(data.vote);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        navigate('/sessionexpired');
        return;
      }
      toast.error(voteErrorMessage(error));
    } finally {
      setDisableSubmitBtn(false);
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
    toast.success('Post deleted.');
    
  } catch (error) {
    console.error(error);
    setDisableSubmitBtn(false);
    toast.error('Could not delete the post. Try again.');
    }finally{
      setDeletingComment(false);
    }
}

useEffect(() => {
  if (createdAt) {
    setTime(`Week of ${moment.utc(createdAt).format('MMM D, YYYY')}`);
  }
}, [createdAt]);

  return (
    <>
    { id &&
    <article className={timeline ? "relative w-full cursor-pointer border-b border-gray-800 bg-gray-950 transition-colors hover:bg-gray-900/40" : "relative flex w-full cursor-pointer flex-col overflow-hidden border-y border-gray-700 bg-gray-950"} ref={ref} onClick={event => {
      if (page.pathname === `/vent/${id}` || (event.target as HTMLElement).closest("a, button, video, input, textarea")) return;
      navigate(`/vent/${id}`);
    }}>
      {timeline && <div aria-hidden="true" className="absolute left-4 top-4 flex size-11 items-center justify-center rounded-full bg-gray-800 text-gray-300"><RiBuilding2Line className="text-xl" /></div>}
        {timeline ? <div className="min-w-0 pb-2 pl-[4.5rem] pr-4 pt-4 sm:pl-[4.75rem]">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <h3 className="max-w-full truncate text-[15px] font-medium text-white">{company_id ? <Link to={`/companies/${company_id}`} className="hover:underline">{company_name || 'Company'}</Link> : company_name || 'Company'}</h3>
            <span className="text-sm text-gray-500">· {time}</span>
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-gray-400">
            <span>{author || 'Anonymous'}</span>
            {location_label && <span className="inline-flex items-center gap-0.5"><MdLocationOn aria-hidden="true" />{location_label}</span>}
            {company_country && getName(company_country) && <span className="inline-flex items-center gap-0.5"><MdLocationOn aria-hidden="true" />{cleanCountryName(getName(company_country))}</span>}
          </div>
        </div> : <div className="flex items-center justify-between px-4 py-3">
          <div><h3 className="text-sm font-semibold text-white">{author}</h3><span className="text-xs text-gray-400">{time}</span></div>
          <div className="flex flex-col items-end gap-1 text-xs text-gray-300">
            <div className="flex items-center gap-1">{company_id ? <Link to={`/companies/${company_id}`} className="max-w-[180px] break-words text-right hover:underline">{company_name}</Link> : <span className="max-w-[180px] break-words text-right">{company_name}</span>}<RiBuilding2Line className="shrink-0 text-blue-400" /></div>
            {company_country && getName(company_country) && <div className="flex items-center gap-1"><span>{cleanCountryName(getName(company_country))}</span><MdLocationOn className="shrink-0 text-red-400" /></div>}
            {location_label && <div className="flex items-center gap-1"><span>{location_label}</span><MdLocationOn className="shrink-0 text-red-400" /></div>}
          </div>
        </div>}

      {/* Confession Text */}
      <div className={timeline ? "pb-3 pl-[4.5rem] pr-4 sm:pl-[4.75rem]" : "px-4 pb-3"}>
        {!timeline && <span className="mb-2 inline-block rounded bg-gradient-to-r from-purple-600 to-indigo-600 px-1.5 py-0.5 text-[10px] font-medium text-white">{category}</span>}
        <Link to={`/vent/${id}`} className="block">
          <p className={timeline ? "whitespace-pre-wrap break-words text-[15px] leading-6 text-gray-200" : "text-sm leading-relaxed text-gray-200 md:text-base lg:text-sm"}>
            {content}
          </p>
        </Link>
        {timeline && <span className="mt-3 inline-block rounded-full border border-gray-700 px-2.5 py-1 text-xs text-gray-400">{category}</span>}
        {media?.length > 0 && <div className={`mt-3 grid gap-1.5 overflow-hidden rounded-xl ${media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {media?.map((item, index) => (
          <div key={item.id} className={`relative min-w-0 overflow-hidden ${media.length === 3 && index === 2 ? 'col-span-2' : ''}`}>
            {item.type === "IMAGE" && (
              <img
                src={item.url}
                alt={media.length === 1 ? 'Post photo' : `Post photo ${index + 1}`}
                className={media.length === 1 ? 'max-h-[480px] w-full bg-gray-900 object-contain' : media.length === 3 && index === 2 ? 'aspect-[2/1] w-full object-cover' : 'aspect-square w-full object-cover'}
              />
            )}
            {item.type === "VIDEO" && (
              <video
                controls
                className="max-h-[480px] w-full"
              >
                <source src={item.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>}

      </div>

      {/* Footer (Upvote / Downvote / Comments / Delete) */}
      <div className={timeline ? "flex items-center justify-between pb-4 pl-[4.5rem] pr-4 pt-1 sm:pl-[4.75rem]" : "flex items-center justify-between px-4 py-3"}>
        <div className={timeline ? isDetailPage ? "flex items-center gap-7" : "flex w-full max-w-sm items-center justify-between gap-3" : "flex items-center gap-6"}>
          {/* UpVote Button */}
            <button
              onClick={() => {
                if (disableSubmitBtn) {
                  toast.warning('Please wait for your vote to save.');
                  return;
                }
                handleUpvote();
              }}
              aria-label={`Upvote, ${upvote} votes`}
              className={`flex items-center gap-2 transition ${timeline ? 'rounded-full p-1 text-sm' : ''}
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
                    toast.warning('Please wait for your vote to save.');
                    return;
                  }
                  handleDownvote();
                }}
                aria-label={`Downvote, ${downvote} votes`}
                className={`flex items-center gap-2 transition ${timeline ? 'rounded-full p-1 text-sm' : ''}
                  ${disableSubmitBtn ? "cursor-not-allowed opacity-50" : "hover:text-red-400 active:text-red-400"} 
                  ${isdownvote ? "text-red-400" : "text-gray-400"}`}
              >
                <FaArrowDown />
                <span className="text-sm md:text-base">{downvote}</span>
              </button>
        {/* Comment */}
        {page.pathname != `/vent/${id}` && 
            <Link to={`/vent/${id}`} aria-label={`${commentcount || 0} comments`} className={timeline ? "flex items-center gap-2 rounded-full p-1 text-sm text-gray-400 transition hover:text-blue-400" : "flex items-center gap-2 text-gray-400 transition hover:text-blue-400"}>
              <FaRegComment /><span>{commentcount || 0}</span>
            </Link>
          }
          
        </div>
      { author_id === user_id && page.pathname != `/vent/${id}`&&
        <button 
                onClick={() => setOpen(true)}
                disabled={disableSubmitBtn} aria-label="Delete post" className={`${timeline ? 'ml-3 ' : ''}flex items-center gap-2 text-gray-400 transition hover:text-red-400 active:text-red-600`}>
          <FaTrash />
        </button>
      }
      
    <ConfirmDialog open={open} title="Delete post?" description="This post and its comments will be removed. This cannot be undone." deleting={deletingComment} onClose={() => setOpen(false)} onDelete={handleDeleteVent} />


      </div>
    </article>
    }
    </>
  );
});
