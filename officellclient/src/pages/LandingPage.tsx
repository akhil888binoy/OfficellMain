import { useNavigate } from "react-router-dom";
import ScrollVelocity from "../styles/ScrollVelocity";

export const LandingPage = () => {
    const navigate = useNavigate();
    const contactEmail = "founderofficell@gmail.com";

    return (
    <div className="flex min-h-screen w-full flex-col bg-gray-950">
    <header className="flex items-center justify-between">
    {/* LEFT: Officell Text */}
    <h1 className="text-2xl lg:mt-4 ml-2 lg:ml-3 lg:text-6xl font-arimo text-white font-bold tracking-tight">
            ⟢ OFFICELL
    </h1>
    <a href={`mailto:${contactEmail}`} className="mr-5 border-b border-gray-600 pb-1 font-arimo text-sm text-gray-300 transition-colors hover:border-white hover:text-white sm:mr-8">
        Talk to the creator
    </a>

</header>



        <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-14 text-white sm:px-8 sm:pt-20">
            <p className="font-arimo text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 sm:text-sm">The side they don’t put in the job ad</p>
            <h2 className="mt-4 max-w-4xl font-arimo text-4xl font-bold leading-[1.04] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Don’t discover the <span className="text-red-500">red flags</span> after you join.</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">Behind a polished interview can be toxic leadership, impossible workloads, and promises that disappear once you start. Officell is where people share those experiences so you can spot the warning signs before taking the job.</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">Lived it? Share what you wish someone had told you.</p>
            <button onClick={() => navigate("/login")} className="mt-8 inline-flex items-center rounded-full bg-white px-7 py-3 font-arimo text-base font-bold text-gray-950 transition-colors hover:bg-gray-200">
                Punch In.
            </button>
        </main>

        <footer className="relative mt-12 w-full overflow-x-hidden">

                    <ScrollVelocity
                        texts={['⟢ OFFICELL']}
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
        </footer>
        </div>
    );
};

