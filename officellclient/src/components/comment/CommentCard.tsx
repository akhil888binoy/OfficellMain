// src/components/CommentCard.jsx
import {  useState } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from 'react-toastify';
import useCommentStore from "../../store/commentStore";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'



export const CommentCard = ({ comment , user_id}) => {

  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const [replyText, setReplyText] = useState("");
  const addSubComment = useCommentStore((state)=>state.addSubComment);
  const deleteComment = useCommentStore((state)=>state.deleteComment);
  const deleteSubComment = useCommentStore((state)=>state.deleteSubComment);
  const [open, setOpen] = useState(false);
  const [openDeleteComment , setOpenDeleteComment] = useState(false);
  const [deletingComment, setDeletingComment] = useState(false);


  const handleReply = async ()=>{
    if(!replyText){
      toast.error('Type some reply !', {
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
     
      const  {data:response }= await axios.post(`${import.meta.env.VITE_API}/comments/${comment.id}/subcomments`, {
          subcomment: replyText
        },{
          withCredentials: true
      });
      addSubComment(response.subcomment)
      setReplyText("");
    } catch (error) {
      console.error(error);
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
      setOpen(false);
    } catch (error) {
      console.error(error);
            setDisableSubmitBtn(false);
    }finally{
      setDeletingComment(false)
    }
  }

  return (
    <>
    {comment.id &&  <div className="bg-gray-950 p-3 sm:p-4 ">

       {/* Comment Content */}
        <div className="flex items-start justify-between">
        <p className="text-gray-200 text-sm  leading-relaxed break-words flex-1">
          {comment.comment}
        </p>

        {comment.author_id === user_id && 
            <button disabled={disableSubmitBtn}  onClick={() => setOpenDeleteComment(true)} className="flex items-center gap-2 text-gray-400 hover:text-red-400 active:text-red-600 transition ml-2">
              <FaTrash />
            </button>
        }

      </div>
        <Dialog open={openDeleteComment} onClose={setOpenDeleteComment} className="relative z-10">
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
                      Delete this Comment
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        Are you sure you want to delete this comment ?
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-950 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex w-full justify-center rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white hover:bg-red-400 sm:ml-3 sm:w-auto"
                >
                    {deletingComment ? "Deleting..." : "Delete"}
                </button>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => setOpenDeleteComment(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400 gap-2 sm:gap-0">
        <span className="text-gray-400">{comment.author?.username}</span>
        <div className="flex gap-3">
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
      </div>
      {replying && (
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button
            onClick={handleReply}
            className="self-end mt-2 sm:self-auto rounded-full border border-gray-500 px-4 sm:px-5 py-1.5 sm:py-2 font-semibold uppercase tracking-wide text-xs sm:text-sm text-white hover:bg-white hover:text-black active:scale-95 transition"
          >
            Send
          </button>
        </div>
      )}


      {showReplies && (

        <div className="mt-3 pl-3 border-l border-gray-700">

          {comment.subcomments.map((reply,index) => (
            <div key={index}>
            {reply &&
                <div className="mt-2 flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-300">{reply.subcomment}</p>
                    <span className="text-xs text-gray-400">{reply.author?.username}</span>
                </div>

                {reply.author.id === user_id &&
                    <button 
                        onClick={() => setOpen(true)}
                        disabled={disableSubmitBtn} 
                        className="text-gray-400 hover:text-red-400 active:text-red-600 transition ml-2"
                    >
                        <FaTrash />
                    </button>
                }

                {/* Subcomment popup */}
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
                      Delete this Reply
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-400">
                        Are you sure you want to delete this reply ?
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-950 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteSubComment(reply.id)
                  }}
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
            }
            </div>
            
          ))}
        </div>


      )}






    </div> }
    </>
  );
};
