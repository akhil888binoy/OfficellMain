import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { TimelineShell } from '../components/common/TimelineShell';

type Item = { id: number; kind: 'POST_REPLY' | 'COMMENT_REPLY' | 'COMPANY_POST'; ventId: number; companyName: string; readAt: string | null; createdAt: string };

export default function NotificationsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API}/notifications`, { withCredentials: true }).then(({ data }) => {
      setItems(data.notifications);
      if (data.unread) axios.put(`${import.meta.env.VITE_API}/notifications/read`, {}, { withCredentials: true }).then(() => window.dispatchEvent(new Event('officell:notifications-read'))).catch(() => {});
    }).catch(() => setError('Could not load notifications.'));
  }, []);
  const label = (item: Item) => item.kind === 'POST_REPLY' ? 'Someone replied to your post' : item.kind === 'COMMENT_REPLY' ? 'Someone replied to your comment' : `New story about ${item.companyName}`;
  return <TimelineShell title="Notifications" subtitle="Private in-app alerts">
    {error && <p role="alert" className="p-5 text-sm text-red-400">{error}</p>}
    {!error && !items.length && <p className="p-8 text-center text-sm text-gray-400">No notifications yet. You can turn them on in Settings.</p>}
    {items.map(item => <Link key={item.id} to={`/vent/${item.ventId}`} className={`block border-b border-gray-800 px-5 py-4 hover:bg-gray-900 ${item.readAt ? '' : 'bg-gray-900/40'}`}><span className="block text-sm text-gray-100">{label(item)}</span><span className="mt-1 block text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span></Link>)}
  </TimelineShell>;
}
