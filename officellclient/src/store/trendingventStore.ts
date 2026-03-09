import {create} from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import type { TrendingVentState } from '../types/vent';

const trendingventStore=(set,get): TrendingVentState=>({
    scrollSkip:0,
    scrollLoading : true,
    scrollLoadinMore: false,
    scrollCategory: "",
    scrollHasMore : true,
    scrollToItem: null,
    trendingvents:[],
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
                trendingvents:[...state.trendingvents, ...data]
        }));
    },
    addVent:(data)=>{
        set((state)=>({
            trendingvents:[...state.trendingvents, data]
        }))
    },
    upVote: (id, user_id, votedata) => {
        const trendingvents = get().trendingvents;
            const updatedVents = trendingvents.map((trendingvent) => {
                if (trendingvent.id === id) {
                    if (votedata.vote ==='NOVOTE'){
                        return {
                            ...trendingvent,
                            upvote: Number(trendingvent.upvote) - 1,
                            votes: trendingvent.votes.map((vote)=>{
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
                        const existDownVote = trendingvent.votes.find((vote)=> vote.vote ==='DOWNVOTE');
                        return{
                            ...trendingvent,
                            upvote: Number(trendingvent.upvote) + 1,
                            downvote: existDownVote ? Number(trendingvent.downvote) - 1 : Number(trendingvent.downvote),
                            votes: (() => {
                                let userFound = false;
                                const updatedVotes = trendingvent.votes.map((vote) => {
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
                return trendingvent;
            });
                set({ trendingvents: updatedVents });
            },
downVote: (id, user_id, votedata) => {
        const trendingvents = get().trendingvents;
            const updatedVents = trendingvents.map((trendingvent) => {
                if (trendingvent.id === id) {
                    if (votedata.vote ==='NOVOTE'){
                        return {
                            ...trendingvent,
                            downvote: Number(trendingvent.downvote) - 1,
                            votes: trendingvent.votes.map((vote)=>{
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
                        const existUpVote = trendingvent.votes.find((vote)=> vote.vote ==='UPVOTE');
                        return{
                            ...trendingvent,
                            downvote: Number(trendingvent.downvote) + 1,
                            upvote: existUpVote ? Number(trendingvent.upvote) - 1 : Number(trendingvent.upvote),
                            votes: (() => {
                                let userFound = false;
                                const updatedVotes = trendingvent.votes.map((vote) => {
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
                return trendingvent;
            });
                
            set({ trendingvents: updatedVents });
            },
    getVent:(id)=>{
        const trendingvents = get().trendingvents;
        return trendingvents.find((trendingvent) => trendingvent.id === Number(id)) || null;
    },
    deleteVent:(id)=>{
        const trendingvents= get().trendingvents;
        const updatedVents = trendingvents.filter((trendingvent => trendingvent.id != id));
        set({
            trendingvents: updatedVents
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
    resetScrollToItem :()=>{
        set({
            scrollToItem: null
        })
    },
    reset:()=>{
        set({
            trendingvents:[]
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
            trendingvents:[],
        })
    }
})

const useTrendingVentStore=create(persist(trendingventStore,{
    name:"trendingvents",
    storage: createJSONStorage(()=>sessionStorage)
}));

export default useTrendingVentStore; 
