// src/components/CommentCard.jsx
import {  useState } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from 'react-toastify';
import useCommentStore from "../../store/commentStore";
import { ConfirmDialog } from '../common/ConfirmDialog';
import { useNavigate } from 'react-router-dom';
import useUserStore from '../../store/userStore';

export const CommentCard = ({ comment , user_id}) => {
  const navigate = useNavigate();
  const username = useUserStore(state => state.user.username);

  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const [replyText, setReplyText] = useState("");
  const addSubComment = useCommentStore((state)=>state.addSubComment);
  const deleteComment = useCommentStore((state)=>state.deleteComment);
  const deleteSubComment = useCommentStore((state)=>state.deleteSubComment);
  const [deleteReplyId, setDeleteReplyId] = useState<string | null>(null);
  const [openDeleteComment , setOpenDeleteComment] = useState(false);
  const [deletingComment, setDeletingComment] = useState(false);


  const handleReply = async ()=>{
    if(!replyText){
      toast.error('Write a reply first.');
        return;
    }
    try {
     
      const  {data:response }= await axios.post(`${import.meta.env.VITE_API}/comments/${comment.id}/subcomments`, {
          subcomment: replyText
        },{
          withCredentials: true
      });
      addSubComment(response.subcomment)
      setReplyText("");
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.data?.code === 'USERNAME_REQUIRED') {
        navigate('/username');
        return;
      }
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        toast.error('Remove email addresses, phone numbers, and exact dates before replying.');
      }
    }
  }

  const handleDelete = async()=>{
    try {
      setDisableSubmitBtn(true);
          setDeletingComment(true);

      await axios.delete(`${import.meta.env.VITE_API}/comments/${comment.id}?vent_id=${comment.vent_id}`,{
        withCredentials: true
      });

      deleteComment(comment.id);
      setDisableSubmitBtn(false);
      setOpenDeleteComment(false);
      toast.success('Comment deleted.');
    } catch (error) {
      console.error(error);
          setDisableSubmitBtn(false);
          toast.error('Could not delete the comment. Try again.');
    }finally {
    setDeletingComment(false);
    }
  }


  const handleDeleteSubComment = async (subcommentId:string)=>{
    try {
        setDeletingComment(true);
        setDisableSubmitBtn(true);
      await axios.delete(`${import.meta.env.VITE_API}/subcomments/${subcommentId}`,{
                  withCredentials: true
      });
      deleteSubComment( subcommentId, comment.id);
      setDisableSubmitBtn(false);
      setDeleteReplyId(null);
    } catch (error) {
      console.error(error);
            setDisableSubmitBtn(false);
    }finally{
      setDeletingComment(false)
    }
  }

  return (
    <>
    {comment.id &&  <div className="flex gap-3 border-b border-gray-800 bg-gray-950 px-4 py-4 sm:px-5">
      <div aria-hidden="true" className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gray-800 text-sm font-medium text-gray-300">?</div>
      <div className="min-w-0 flex-1">

       {/* Comment Content */}
        <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
        <span className="font-medium text-gray-200">{comment.author?.username || 'Anonymous'}</span>
        {comment.author_id === user_id && 
            <button disabled={disableSubmitBtn} aria-label="Delete comment" onClick={() => setOpenDeleteComment(true)} className="text-gray-500 transition hover:text-red-400 active:text-red-600">
              <FaTrash />
            </button>
        }
      </div>
      <p className="mt-2 break-words text-sm leading-6 text-gray-200">{comment.comment}</p>
        <ConfirmDialog open={openDeleteComment} title="Delete comment?" description="This comment and its replies will be removed. This cannot be undone." deleting={deletingComment} onClose={() => setOpenDeleteComment(false)} onDelete={handleDelete} />

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <button
            className="hover:text-gray-100 transition"
            onClick={() => setReplying(!replying)}
          >
            Reply
          </button>
          {comment.subcomments?.length > 0 && (
            <button
              className="hover:text-gray-100 transition"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies
                ? "Hide Replies"
                : `View Replies (${comment.subcomments.length})`}
            </button>
          )}
          
      </div>
      {replying && (
        <div className="mt-3 flex items-center gap-3 border-b border-gray-800 pb-2">
          <input
            type="text"
            placeholder={username ? `Reply as @${username}...` : 'Write a reply...'}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-1 text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={handleReply}
            className="shrink-0 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-gray-950 transition-colors hover:bg-gray-200"
          >
            Send
          </button>
        </div>
      )}


      {showReplies && (

        <div className="mt-4 ml-1 divide-y divide-gray-800 border-l border-gray-700 pl-4">

          {comment.subcomments.map((reply) => (
            <div key={reply.id}>
            {reply &&
                <div className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-200">{reply.author?.username || 'Anonymous'}</p>
                    <p className="mt-1 break-words text-sm leading-6 text-gray-300">{reply.subcomment}</p>
                </div>

                {reply.author?.id === user_id &&
                    <button 
                        onClick={() => setDeleteReplyId(reply.id)}
                        disabled={disableSubmitBtn} 
                        aria-label="Delete reply"
                        className="shrink-0 p-1 text-gray-500 transition-colors hover:text-red-400 active:text-red-600"
                    >
                        <FaTrash />
                    </button>
                }

            </div>
            }
            </div>
            
          ))}
        </div>


      )}

      <ConfirmDialog open={deleteReplyId !== null} title="Delete reply?" description="This reply will be removed. This cannot be undone." deleting={deletingComment} onClose={() => setDeleteReplyId(null)} onDelete={() => { if (deleteReplyId) void handleDeleteSubComment(deleteReplyId); }} />






      </div>
    </div> }
    </>
  );
};
