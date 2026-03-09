import {create} from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import type { PostCompanyState } from '../types/vent';

const postcompanyStore=(set,get):PostCompanyState=>({

    scrollSkip:0,
    scrollLoading : true,
    scrollLoadinMore: false,
    scrollCategory: "",
    scrollHasMore : true,
    scrollToItem: null,
    companies:[],
    refreshButton: false,
    searchcountry: null,
    region: null,
    companySearch : "",
    setCompanySearch:(data)=>{
        set({
            companySearch: data
        })
    },
    setRegion:(data)=>{
        set({
            region: data
        })
    },
    setCountry:(data)=>{
        set({
            searchcountry: data
        })
    },
    setRefreshButton : (data)=>{
        set({
            refreshButton: data
        })
    },
    addScrollSkip : (data)=>{
        set({
            scrollSkip: data
        })
    },
    addScrollLoading : (data)=>{
        set({
            scrollLoading: data
        })
    },
    addScrollLoadingMore:(data)=>{
        set({
            scrollLoadinMore: data
        })
    },
    addScrollCategory:(data)=>{
        set({
            scrollCategory: data
        })
    },
    addHasMore: (data)=>{
        set({
            scrollHasMore : data,
        })
    },
    addScrollToItem: (data)=>{
        set({
            scrollToItem : data,
        })
    },
    addCompanies:(data)=>{
        set((state)=>({
                companies:[...state.companies, ...data]
        }));
    },
    getCompany :(id)=>{
        const companies = get().companies;
        return companies.find((company) => company.id === Number(id)) || null;
    },
    reset:()=>{
        set({
            companies:[]
        })
    },
    resetScrollToItem:()=>{
        set({
            scrollToItem:null
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
                companies:[],

        })
    },
    resetCompanies:()=>{
        set({
                scrollSkip:0,
                scrollLoading : true,
                scrollLoadinMore: false,
                scrollHasMore : true,
                scrollToItem: null,
                companies:[],
        })
    }

})

const usePostCompanyStore=create(persist(postcompanyStore,{
    name:"postcompanies",
    storage: createJSONStorage(()=>sessionStorage)
}));

export default usePostCompanyStore;