import {create} from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";

const commentStore=(set,get)=>({
    comments:[],
    addComments:(data)=>{
        set((state)=>({
            comments:[...state.comments, ...data]
        }))
    },
    addComment:(data)=>{
        set((state)=>({
            comments:[data , ...state.comments]
        }))
    },
    addSubComment:(data)=>{
        const comments = get().comments;
        const updatedComments = comments.map((comment)=>{
            if (comment.id === data.comment_id) { 
            return {
                ...comment,
                subcomments: [data, ...comment.subcomments] 
            }
        }
            return comment;
        })
        set({ comments: updatedComments });
    },
    deleteComment:(id)=>{
        const comments = get().comments;
        const updatedComments = comments.filter((comment=> comment.id != id));
        set({
            comments: updatedComments
        })
    },
    deleteSubComment:(id , comment_id)=>{
        const comments = get().comments;
        const updatedComments = comments.map((comment)=>{
            if (comment.id === comment_id) { 
                return {
                    ...comment,
                    subcomments: comment.subcomments.filter((subcomment => subcomment.id != id))
                }
            }
            return comment;
        });
        set({
            comments: updatedComments
        })
    },
    resetComments:()=>{
        set({
            comments:[]
        })
    }
})

const useCommentStore = create(persist(commentStore,{
    name:"comments",
    storage:createJSONStorage(()=>sessionStorage)
}));

export default useCommentStore;