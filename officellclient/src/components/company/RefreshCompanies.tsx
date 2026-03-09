import { useEffect } from "react";
import useCompanyStore from "../../store/companyStore";
import { useLocation } from "react-router-dom";
import axios from "axios";

const RefreshCompanies = () => {

        const refreshButton = useCompanyStore((state)=> state.refreshButton);
        const setRefreshButton = useCompanyStore((state)=> state.setRefreshButton);
        const companies = useCompanyStore((state) => state.companies);
        const refreshCompanies = useCompanyStore((state)=> state.logout);
        const {pathname} = useLocation();

        const fetchDbCompanies = async()=>{
            try {
            const lastCreatedAt = companies.sort((a,b)=> a.createdAt > b.createdAt ? -1: 1)[0];
            const {data: response } = await axios.get(`${import.meta.env.VITE_API}/companies/count?lastcreatedAt=${lastCreatedAt.createdAt}`,{
                withCredentials: true
            });
            if (response.count_companies > 10){
                setRefreshButton(true)
            }else {
                    setRefreshButton(false);
                }
            } catch (error) {
                console.error(error);
            }
        }
        const handleRefresh = ()=>{
            refreshCompanies();
            setRefreshButton(false);
                        }
                useEffect(() => {
                const interval = setInterval(() => {
                    if (companies.length > 0) {
                    fetchDbCompanies();
                    }
                }, 50000);

                return () => clearInterval(interval);
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, []);

    return (
    <>
        {refreshButton && pathname === "/companies" && (
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
                New Companies
                </button>
        )}
    </>

    );

}

export default RefreshCompanies