import { useState, type FormEvent } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useUserStore from '../store/userStore';

export default function AddUsernamePage() {
  const currentUsername = useUserStore(state => state.user.username);
  const [username, setUsername] = useState(currentUsername || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const trimmedUsername = username.trim();
  const validUsername = /^[A-Za-z0-9_]{5,15}$/.test(trimmedUsername);

  const saveUsername = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validUsername || saving) return;

    setSaving(true);
    setError('');
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API}/add-username`, {
        new_username: trimmedUsername,
      }, { withCredentials: true });
      useUserStore.setState({ user: data.user });
      setSaved(true);
      window.setTimeout(() => navigate('/feed'), 1000);
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 409) {
        setError('That username is already taken. Try another.');
      } else {
        setError('Could not save your username. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-12 text-white sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-7 text-center">
          <span className="font-arimo text-3xl font-bold tracking-tight text-white">⟢ OFFICELL</span>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 sm:p-8">
          {saved ? (
            <div className="py-4 text-center" role="status">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-gray-800 text-white">
                <Check size={22} aria-hidden="true" />
              </span>
              <h1 className="mt-5 text-xl font-semibold text-white">Username saved</h1>
              <p className="mt-2 text-sm text-gray-400">You’ll post as <span className="font-medium text-white">@{trimmedUsername}</span>.</p>
            </div>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-white">{currentUsername ? 'Change your username' : 'Choose a username'}</h1>
              <p className="mt-2 text-sm leading-6 text-gray-400">This name appears on new posts and replies. Choose one that doesn’t identify you.</p>

              <form className="mt-7" onSubmit={saveUsername}>
                <label htmlFor="username" className="block text-sm font-medium text-gray-200">Username</label>
                <div className="mt-2 flex items-center rounded-xl border border-gray-700 bg-gray-950 px-4 focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-400">
                  <span className="select-none text-lg text-gray-500" aria-hidden="true">@</span>
                  <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    value={username}
                    onChange={event => { setUsername(event.target.value); setError(''); }}
                    placeholder="yourname"
                    maxLength={15}
                    pattern="[A-Za-z0-9_]{5,15}"
                    aria-describedby="username-hint"
                    aria-invalid={Boolean(error)}
                    className="w-full bg-transparent px-2 py-3 text-base text-white outline-none placeholder:text-gray-600"
                  />
                </div>
                <p id="username-hint" className="mt-2 text-xs text-gray-400">5–15 letters, numbers, or underscores.</p>
                {error && <p role="alert" className="mt-3 text-sm text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={!validUsername || saving}
                  className="mt-7 w-full rounded-full bg-white px-4 py-3 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
                >
                  {saving ? 'Saving…' : currentUsername ? 'Save username' : 'Continue to feed'}
                </button>
              </form>
            </>
          )}
        </div>

        {currentUsername && !saved && (
          <button type="button" onClick={() => navigate('/feed')} className="mx-auto mt-5 block text-sm text-gray-400 transition-colors hover:text-white">
            Back to feed
          </button>
        )}
      </div>
    </main>
  );
}
