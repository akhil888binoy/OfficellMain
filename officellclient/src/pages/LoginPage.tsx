import { FaLinkedin } from "react-icons/fa";

export default function LoginPage() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-lg p-8 shadow-xl border border-white/10">
        
        {/* Logo */}
        <div className="flex justify-center">
          <h1 className="text-4xl sm:text-4xl md:text-6xl lg:text-[40px] mt-4 font-arimo text-white font-bold tracking-[-0.07em]">
            ⟢ OFFICELL
          </h1>
        </div>

        {/* Title */}
            <h2 className="mt-6 text-center text-2xl font-arimo font-bold tracking-tight text-white ">
                Hey Corporate Slave!
            </h2>
            <p className="mt-1 text-center text-sm text-gray-400">
            Spill the tea | No Name | No Shame
            </p>

        {/* LinkedIn Button */}
        <div className="mt-8">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-[#0A66C2] px-4 py-3 font-semibold text-white shadow-lg hover:bg-[#004182] focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
            onClick={()=>{ window.location.href = `${import.meta.env.VITE_API}/auth/linkedin` }}
          >
            <FaLinkedin className="text-xl" />
            Sign in with LinkedIn
          </button>
        </div>
        <h2>
        </h2>
        {/* Privacy Disclaimer */}
        <p className="mt-4 text-xs text-center text-gray-400 leading-relaxed">
          🔒 Your identity will <span className="font-semibold text-gray-200">never be shown</span>.  
          We only use LinkedIn to verify that you’re a real professional.  
          All confessions remain <span className="font-semibold text-gray-200">100% anonymous</span>.
        </p>
      </div>
    </div>

  );
}
