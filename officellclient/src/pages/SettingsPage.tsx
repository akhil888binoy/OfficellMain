
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TimelineShell } from '../components/common/TimelineShell';

type Alerts = { replies: boolean; companyPosts: boolean };

const SettingsPage = () => {
  const [alerts, setAlerts] = useState<Alerts>({ replies: false, companyPosts: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { axios.get(`${import.meta.env.VITE_API}/feed/preferences`, { withCredentials: true }).then(({ data }) => setAlerts(data.alerts)).catch(() => setError('Could not load settings.')); }, []);
  const update = async (key: keyof Alerts) => {
    const next = { ...alerts, [key]: !alerts[key] };
    setSaving(true);
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_API}/feed/alerts`, next, { withCredentials: true });
      setAlerts(data.alerts);
      setError('');
    } catch { setError('Could not save settings.'); }
    finally { setSaving(false); }
  };
  return <TimelineShell title="Settings" subtitle="Choose which in-app alerts you receive">
    <div className="divide-y divide-gray-800 px-5">
      <label className="flex cursor-pointer items-center justify-between gap-5 py-5"><span><span className="block text-sm text-gray-100">Replies</span><span className="block text-xs text-gray-400">When someone replies to your post or comment</span></span><input type="checkbox" checked={alerts.replies} disabled={saving} onChange={() => update('replies')} className="size-5 accent-white" /></label>
      <label className="flex cursor-pointer items-center justify-between gap-5 py-5"><span><span className="block text-sm text-gray-100">Followed company posts</span><span className="block text-xs text-gray-400">When a new story is posted about a company you follow</span></span><input type="checkbox" checked={alerts.companyPosts} disabled={saving} onChange={() => update('companyPosts')} className="size-5 accent-white" /></label>
      <p className="py-5 text-xs text-gray-500">Follows and alerts are private to your account. Alerts start off.</p>
      {error && <p role="alert" className="py-3 text-sm text-red-400">{error}</p>}
    </div>
  </TimelineShell>;
};

export default SettingsPage;
