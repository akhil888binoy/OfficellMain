import {create} from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import type { CompanyVentState } from '../types/vent';

const companyventStore=(set,get): CompanyVentState=>({
    
    scrollSkip:0,
    scrollLoading : true,
    scrollLoadinMore: false,
    scrollCategory: "",
    scrollHasMore : true,
    scrollToItem: null,

    companyvents:[],

    addScrollSkip : (data)=>{
        set(({
            scrollSkip: data
        }))
    },
    addScrollLoading : (data)=>{
        set(({
            scrollLoading: data
        }))
    },
    addScrollLoadingMore:(data)=>{
        set(({
            scrollLoadinMore: data
        }))
    },
    addScrollCategory:(data)=>{
        set(({
            scrollCategory: data
        }))
    },
    addHasMore: (data)=>{
        set(({
            scrollHasMore : data,
        }))
    },
    addScrollToItem: (data)=>{
        set(({
            scrollToItem : data,
        }))
    },
    addVents:(data)=>{
        set((state)=>({
                companyvents:[...state.companyvents, ...data]
        }));
    },
    addVent:(data)=>{
        set((state)=>({
            companyvents:[ data, ...state.companyvents]
        }))
    },
    upVote: (id, user_id, votedata) => {

        const companyvents = get().companyvents;

            const updatedVents = companyvents.map((companyvent) => {
                if (companyvent.id === id) {
                    if (votedata.vote ==='NOVOTE'){
                        return {
                            ...companyvent,
                            upvote: Number(companyvent.upvote) - 1,
                            votes: companyvent.votes.map((vote)=>{
                                if( vote.user_id === user_id){
                                    return{
                                        ...vote,
                                        vote:'NOVOTE'
                                    }
                                }
                                return vote
                            })
                        };
                    }else if (votedata.vote === 'UPVOTE'){
                        const existDownVote = companyvent.votes.find((vote)=> vote.vote ==='DOWNVOTE');
                        return{
                            ...companyvent,
                            upvote: Number(companyvent.upvote) + 1,
                            downvote: existDownVote ? Number(companyvent.downvote) - 1 : Number(companyvent.downvote),
                            votes: (() => {
                                let userFound = false;
                                const updatedVotes = companyvent.votes.map((vote) => {
                                    if( vote.user_id === user_id){
                                        userFound = true;
                                        return{
                                            ...vote,
                                            vote:'UPVOTE'
                                        }
                                    }
                                    return vote
                                });
                                
                                if (!userFound) {
                                    return [...updatedVotes, votedata];
                                }
                                return updatedVotes;
                            })()
                        }
                    }
                }
                return companyvent;
            });
                set({ companyvents: updatedVents });
            },
downVote: (id, user_id, votedata) => {
        const companyvents = get().companyvents;
            const updatedVents = companyvents.map((companyvent) => {
                if (companyvent.id === id) {
                    if (votedata.vote ==='NOVOTE'){
                        return {
                            ...companyvent,
                            downvote: Number(companyvent.downvote) - 1,
                            votes: companyvent.votes.map((vote)=>{
                                if( vote.user_id === user_id){
                                    return{
                                        ...vote,
                                        vote:'NOVOTE'
                                    }
                                }
                                return vote
                            })
                        };
                    }else if (votedata.vote === 'DOWNVOTE'){
                        const existUpVote = companyvent.votes.find((vote)=> vote.vote ==='UPVOTE');
                        return{
                            ...companyvent,
                            downvote: Number(companyvent.downvote) + 1,
                            upvote: existUpVote ? Number(companyvent.upvote) - 1 : Number(companyvent.upvote),
                            votes: (() => {
                                let userFound = false;
                                const updatedVotes = companyvent.votes.map((vote) => {
                                    if( vote.user_id === user_id){
                                        userFound = true;
                                        return{
                                            ...vote,
                                            vote:'DOWNVOTE'
                                        }
                                    }
                                    return vote
                                });
                                
                                if (!userFound) {
                                    return [...updatedVotes, votedata];
                                }
                                return updatedVotes;
                            })()
                        }
                    }
                }
                return companyvent;
            });
                
            set({ companyvents: updatedVents });
            },
    getVent:(id)=>{
        const companyvents = get().companyvents;
        return companyvents.find((companyvent) => companyvent.id === Number(id)) || null;
    },
    deleteVent:(id)=>{
        const companyvents= get().companyvents;
        const updatedVents = companyvents.filter((companyvent => companyvent.id != id));
        set({
            companyvents: updatedVents
        })
    },
    resetScrollLoading:()=>{
        set({
            scrollLoading : true,
        })
    },
    resetScrollLoadingMore:()=>{
        set({
            scrollLoadinMore: false,
        })
    },
    resetScrollCategory:()=>{
        set({
            scrollCategory: "",
        })
    },
    resetScrollSkip:()=>{
        set({
            scrollSkip : 0,
        })
    },
    resetHasMore:()=>{
        set({
            scrollHasMore: true
        })
    },
    reset:()=>{
        set({
            companyvents:[]
        })
    },
    resetScrollToItem:()=>{
        set({
            scrollToItem: null
        })
    },
    logout:()=>{
        set({
                scrollSkip:0,
                scrollLoading : true,
                scrollLoadinMore: false,
                scrollCategory: "",
                scrollHasMore : true,
                scrollToItem: null,
                companyvents:[],
        })
    }
})

const useCompanyVentStore=create(persist(companyventStore,{
    name:"companyvents",
    storage: createJSONStorage(()=>sessionStorage)
}));

export default useCompanyVentStore; 

