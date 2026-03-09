import { useNavigate } from "react-router-dom";
import ScrollVelocity from "../styles/ScrollVelocity";

export const LandingPage = () => {
    const navigate = useNavigate();
    const wallet = "founderofficell@gmail.com";

    return (
    <div className="bg-gray-950 w-screen min-h-screen">
    <div className="flex items-center justify-between ">
    {/* LEFT: Officell Text */}
    <h1 className="text-2xl lg:mt-4 ml-2 lg:ml-3 lg:text-6xl font-arimo text-white font-bold tracking-tight">
            ⟢ OFFICELL
    </h1>
    {/* RIGHT: Punch In Button */}
    <button
        onClick={() => navigate("/login")}
        className="
            lg:text-5xl text-2xl
            lg:px-10 px-6
            lg:py-2 py-1.5
            bg-white text-gray-950
            font-arimo font-bold tracking-[-0.07em]
            hover:bg-gray-950 hover:text-white
        "
    >
        Punch In.
    </button>

</div>



                        <div className="relative w-full mt-10 flex items-center justify-center overflow-x-hidden">

                    <ScrollVelocity
                        texts={['SPILL THE TEA', 'NO NAME . NO SHAME .']}
                        velocity={100}
                        className="
                            custom-scroll-text font-arimo text-white font-bold tracking-[-0.07em]
                            text-[200px]
                            sm:text-[120px]
                            md:text-[180px]
                            lg:text-[260px]
                            xl:text-[330px]
                            leading-[1]
                            whitespace-nowrap
                        "
                    />
                </div>
        <div className="mt-8 flex justify-center">
                <button
                    className="text-white font-arimo text-sm lg:text-xl tracking-wide opacity-80 flex items-center gap-2 hover:opacity-100"
                >
                {wallet}
                </button>
            </div>
        </div>
    );
};

