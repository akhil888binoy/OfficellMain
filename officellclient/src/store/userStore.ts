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
            user: data?.user ?? { username: "", id: "" },
            location: { city: data?.location?.city ?? "" }
        }))
    },
    reset:()=>{
        set({
            user:{ username: "", id: "" },
            location:{ city: "" }
        })
    }
})

const useUserStore = create(persist(userStore,{
    name:"user",
    storage: createJSONStorage(()=>sessionStorage)
}));

export default useUserStore;
