 import {create} from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import type { VentState } from '../types/vent';
import { normalizeTopic } from '../utils/ventCategory';
import { appendUniqueVents, prependUniqueVent } from '../utils/uniqueVents';

const ventStore=(set,get): VentState=>({

    post:"",
    company_id:"",
    category:null,
    selectedMedia: [],
    mediaType: "",
    scrollSkip:0,
    scrollLoading : true,
    scrollLoadinMore: false,
    scrollCategory: "",
    scrollSort: 'for-you',
    scrollPeriod: 'week',
    scrollHasMore : true,
    scrollToItem: null,
    vents:[],
    refreshButton: false,
   
    setRefreshButton : (data)=>{
        set(({
            refreshButton: data
        }))
    },
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
                vents:appendUniqueVents(state.vents, data)
        }));
    },
    addVent:(data)=>{
        set((state)=>({
            vents:prependUniqueVent(state.vents, data)
        }))
    },
    addTrendingVent:(data)=>{
        set((state)=>({
            vents:appendUniqueVents(state.vents, [data])
        }))
    },
    addPost:(data)=>{
        set({
            post:data
        });
    },
    addCategory:(data)=>{
        set({
            category: data
        });
    },
    addCompany_id:(data)=>{
        set({
            company_id: data
        });
    },
    addSelectedMedia:(data)=>{
        set({
            selectedMedia:data
        });
    },
    addMediaType:(data)=>{
        set({
            mediaType: data
        })
    },
upVote: (id, user_id, votedata) => {
        const vents = get().vents;
            const updatedVents = vents.map((vent) => {
                if (vent.id === id) {
                    if (votedata.vote ==='NOVOTE'){
                        return {
                            ...vent,
                            upvote: Number(vent.upvote) - 1,
                            votes: vent.votes.map((vote)=>{
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
                        const existDownVote = vent.votes.find(
                            (vote) => vote.user_id === user_id && vote.vote === 'DOWNVOTE'
                        );
                        return{
                            ...vent,
                            upvote: Number(vent.upvote) + 1,
                            downvote: existDownVote ? Number(vent.downvote) - 1 : Number(vent.downvote),
                            votes: (() => {
                                let userFound = false;
                                const updatedVotes = vent.votes.map((vote) => {
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
                return vent;
            });
                set({ vents: updatedVents });
            },  
downVote: (id, user_id, votedata) => {
        const vents = get().vents;
            const updatedVents = vents.map((vent) => {
                if (vent.id === id) {
                    if (votedata.vote ==='NOVOTE'){
                        return {
                            ...vent,
                            downvote: Number(vent.downvote) - 1,
                            votes: vent.votes.map((vote)=>{
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
                                                const existUpVote = vent.votes.find(
                                (vote) => vote.user_id === user_id && vote.vote === 'UPVOTE'
                            );

                        return{
                            ...vent,
                            downvote: Number(vent.downvote) + 1,
                            upvote: existUpVote ? Number(vent.upvote) - 1 : Number(vent.upvote),
                            votes: (() => {
                                let userFound = false;
                                const updatedVotes = vent.votes.map((vote) => {
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
                return vent;
            });
                
            set({ vents: updatedVents });
            },
    getVent:(id : string)=>{
        const vents = get().vents;
        return vents.find((vent) => vent.id === Number(id)) || null;
    },
    deleteVent:(id: string)=>{
        const vents= get().vents;
        const updatedVents = vents.filter((vent => vent.id != id));
        set({
            vents: updatedVents
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
            scrollSort: 'for-you',
            scrollPeriod: 'week',
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
            vents:[]
        })
    },
    resetSelectedMedia:()=>{
        set({
            selectedMedia: []
        })
    },
    restMediaType:()=>{
        set({
            mediaType: ""
        })
    },
    resetCompany_id:()=>{
        set({
            company_id: ""
        })
    },
    resetPost:()=>{
        set({
            post: ""
        })
    },
    resetCategory:()=>{
        set({
            category: null
        })
    },
    resetScrollToItem :()=>{
        set({
            scrollToItem: null
        })
    },

    logout:()=>{
        set({
            post:"",
            company_id:"",
            category:"",
            selectedMedia: [],
            mediaType: "",
            scrollSkip:0,
            scrollLoading : true,
            scrollLoadinMore: false,
            scrollCategory: "",
            scrollHasMore : true,
            scrollToItem: null,
            vents:[]
        })
    }
})

const useVentStore=create(persist(ventStore,{
    name:"vents",
    storage: createJSONStorage(()=>sessionStorage),
    partialize: state => ({ ...state, selectedMedia: [], mediaType: '' }),
    version: 5,
    migrate: (persisted) => {
        const previous = persisted as Partial<VentState>;
        return { ...previous, category: normalizeTopic(previous.category), scrollCategory: normalizeTopic(previous.scrollCategory) ?? '', selectedMedia: [], vents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true, scrollLoadinMore: false };
    },
}));

export default useVentStore;
