import { useEffect } from "react";
import useVentStore from "../../store/ventStore";
import useTrendingVentStore from "../../store/trendingventStore";
import useCompanyVentStore from "../../store/companyventStore";
import useProfileVentStore from "../../store/profileventStore";
import axios from "axios";
import { useLocation } from "react-router-dom";

const RefreshFeed = () => {

        const refreshButton = useVentStore((state)=> state.refreshButton);
        const setRefreshButton = useVentStore((state)=> state.setRefreshButton);
        const vents = useVentStore((state) => state.vents);
        const refreshTrending = useTrendingVentStore((state)=> state.logout);
        const refreshFeed= useVentStore((state)=> state.logout);
        const refreshCompany = useCompanyVentStore((state)=> state.logout);
        const refreshProfile = useProfileVentStore((state)=> state.logout);
        const {pathname} = useLocation();

        const fetchDbVents = async()=>{
            try {
            
            const lastCreatedAt = vents.sort((a , b  )=> a.createdAt > b.createdAt ? -1: 1)[0];
            const {data: response } = await axios.get(`${import.meta.env.VITE_API}/vents/count?lastcreatedAt=${lastCreatedAt.createdAt}`,{
                withCredentials: true
            });
            if (response.count_vents > 10){
                setRefreshButton(true)
            }else{
                setRefreshButton(false);
            }
            } catch (error) {
                console.error(error);
            }
        }

        const handleRefresh = ()=>{
            refreshTrending();
            refreshFeed();
            refreshProfile();
            refreshCompany();
            setRefreshButton(false);
        }

    useEffect(()=>{
        const interval= setInterval(() => {
            if (vents.length > 0){
                fetchDbVents();
            }
        }, 50000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    return (
        <>
            { refreshButton && pathname != "/companies" &&
               <button
                onClick={handleRefresh}
                className="
                    border border-white text-white 
                    px-6 py-2 text-sm                     /* Mobile */
                    sm:px-8 sm:py-2.5 sm:text-base        /* Tablet */
                    md:px-10 md:py-3 md:text-base         /* Laptop/Desktop */

                    rounded-full tracking-widest uppercase font-semibold
                    hover:bg-white hover:text-black transition
                "
                >
                    New Feeds
                </button>
            }
            </>
        )
}

export default RefreshFeed