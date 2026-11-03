import { FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const signIn = () => {
    window.location.href = `${import.meta.env.VITE_API}/auth/linkedin`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <Link to="/" className="font-arimo text-2xl font-bold tracking-tight text-white sm:text-3xl">⟢ OFFICELL</Link>
        <Link to="/" className="text-sm text-gray-400 transition-colors hover:text-white">Back to home</Link>
      </header>

      <main className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-8 sm:px-8 sm:pt-14 lg:min-h-[calc(100vh-104px)] lg:grid-cols-[minmax(0,1fr)_minmax(360px,430px)] lg:gap-16 lg:pb-24 lg:pt-0">
        <section className="max-w-xl">
          <p className="font-arimo text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Know before you join</p>
          <h1 className="mt-4 font-arimo text-4xl font-bold leading-[1.05] tracking-[-0.055em] sm:text-5xl lg:text-6xl">The <span className="text-red-500">warning</span> signs don’t come with the offer.</h1>
          <p className="mt-5 max-w-lg text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">Read what people say about the workplace behind the job ad. Share what you wish you’d known before your first day.</p>
        </section>

        <section className="w-full rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-8" aria-labelledby="login-title">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-gray-500">Welcome to Officell</p>
          <h2 id="login-title" className="mt-3 font-arimo text-3xl font-bold tracking-tight text-white">Punch in.</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">Sign in to read workplace stories and share your own.</p>

          <button
            type="button"
            onClick={signIn}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <FaLinkedin className="text-xl text-[#0A66C2]" aria-hidden="true" />
            Continue with LinkedIn
          </button>

          <div className="mt-8 border-t border-gray-800 pt-5">
            <p className="text-xs leading-5 text-gray-400">LinkedIn is used to sign you in. Your LinkedIn profile is not shown with posts; a username you choose is. Pick one that doesn’t identify you.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
