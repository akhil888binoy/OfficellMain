import {create} from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";

const userStore=(set)=>({
    user:{
        username:"",
        id:""
    },
    location:{
        city:""
    },
    addUser:(data)=>{
        set(({
            user: data.user,
            location:data.location
        }))
    },
    reset:()=>{
        set({
            user:{},
            location:{}
        })
    }
})

const useUserStore = create(persist(userStore,{
    name:"user",
    storage: createJSONStorage(()=>sessionStorage)
}));

export default useUserStore;