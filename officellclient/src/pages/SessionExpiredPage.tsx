import { useEffect } from "react"
import FuzzyText from "../styles/FuzzyText"
import { useNavigate } from "react-router-dom"

const SessionExpiredPage = () => {
    const navigate = useNavigate();

    useEffect(()=>{
            const timer = setTimeout(() => {
                navigate("/login");
            }, 3000);

            return () => clearTimeout(timer);
             // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <div className="h-screen w-screen bg-gray-950 flex  justify-center items-center">
                <FuzzyText 
                    baseIntensity={0.2} 
                    >
                        Session Expired
                    </FuzzyText>
        </div>
    )
}

export default SessionExpiredPage