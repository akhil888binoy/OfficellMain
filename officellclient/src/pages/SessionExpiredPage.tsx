import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { COMPANY_NEARBY_AREA_KEY } from '../utils/companyNearbyArea';

const SessionExpiredPage = () => {
    const navigate = useNavigate();

    useEffect(()=>{
            sessionStorage.removeItem(COMPANY_NEARBY_AREA_KEY);
            const timer = setTimeout(() => {
                navigate("/login");
            }, 3000);

            return () => clearTimeout(timer);
             // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-5 text-center text-white">
          <h1 className="text-2xl font-medium text-gray-100">Session expired</h1>
          <p className="mt-3 text-sm text-gray-400">Taking you back to sign in…</p>
        </div>
    )
}

export default SessionExpiredPage
