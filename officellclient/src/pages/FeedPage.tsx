import PostCard from "../components/vent/PostCard";
import { Sidebar } from "../components/common/Sidebar";
import {VentCard}  from "../components/vent/VentCard";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import axios from "axios";
import useUserStore from "../store/userStore";
import useVentStore from "../store/ventStore";
import Shuffle from "../styles/Shuffle";
import { PAGE_SIZE } from "../utils/pagesize";
import useTrendingVentStore from "../store/trendingventStore";
import useCompanyStore from "../store/companyStore";
import useCompanyVentStore from "../store/companyventStore";
import useProfileVentStore from "../store/profileventStore";
import { categories } from "../utils/ventCategory";
import RefreshFeed from "../components/vent/RefreshFeed";
import { ventLocationLabel } from '../utils/ventLocationLabel';



export const FeedPage = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSort = searchParams.get('sort');
  const scrollToRef = useRef<null | HTMLDivElement>(null);
  const feedScrollRef = useRef<null | HTMLDivElement>(null);
  const scrollToCard= useVentStore((state)=> state.scrollToItem) ;
  const [error, setError] = useState<string | null>(null);
  const [refreshEpoch, setRefreshEpoch] = useState(0);
  const refreshButton = useVentStore((state)=> state.refreshButton);
  const skip = useVentStore((state)=> state.scrollSkip);
  const loadingMore = useVentStore((state)=> state.scrollLoadinMore);
  const loading = useVentStore((state)=> state.scrollLoading);
  const category = useVentStore((state)=> state.scrollCategory);
  const sort = useVentStore((state)=> state.scrollSort ?? 'for-you');
  const [followedTopics, setFollowedTopics] = useState<string[]>([]);
  const [followError, setFollowError] = useState('');
  useEffect(() => { axios.get(`${import.meta.env.VITE_API}/feed/preferences`, { withCredentials: true }).then(({ data }) => setFollowedTopics(data.topics)).catch(() => setFollowError('Could not load followed topics.')); }, []);
  const toggleTopic = async (topic: string) => {
    const following = followedTopics.includes(topic);
    try {
      await axios({ method: following ? 'delete' : 'put', url: `${import.meta.env.VITE_API}/feed/follows/topics/${encodeURIComponent(topic)}`, withCredentials: true });
      setFollowedTopics(current => following ? current.filter(value => value !== topic) : [...current, topic]);
      setFollowError('');
      if (sort === 'for-you') {
        useVentStore.setState({ vents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true, scrollLoadinMore: false });
        setRefreshEpoch(value => value + 1);
      }
    } catch { setFollowError('Could not update topic follow.'); }
  };
  const period = useVentStore((state)=> state.scrollPeriod ?? 'week');
  const hasMore = useVentStore((state)=> state.scrollHasMore);
  const addUser = useUserStore((state)=>state.addUser);
  const user = useUserStore((state) => state.user);
  const vents = useVentStore((state) => state.vents);
  const addVents = useVentStore((state) => state.addVents);
  const addScrollSkip = useVentStore((state)=> state.addScrollSkip);
  const addloading = useVentStore((state)=> state.addScrollLoading);
  const addloadingMore = useVentStore((state)=> state.addScrollLoadingMore);
  const addHasMore = useVentStore((state)=> state.addHasMore);
  const addScrollToItem = useVentStore((state)=> state.addScrollToItem);
  const resetScrollToItemTrending = useTrendingVentStore((state)=> state.resetScrollToItem);
  const resetScrollToItemCompany = useCompanyStore((state)=> state.resetScrollToItem);
  const resetScrollToItemCompanyVent = useCompanyVentStore((state)=> state.resetScrollToItem);
  const resetScrollToItemProfileVent = useProfileVentStore((state)=> state.resetScrollToItem);
  const logoutTrendingVents = useTrendingVentStore((state)=> state.logout);

  const selectCategory = (value: string) => {
    if (value === category) return;
    useVentStore.setState({
      vents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true,
      scrollLoadinMore: false, scrollCategory: value, scrollToItem: null,
    });
  };

  const selectSort = (value: 'for-you' | 'new' | 'hot' | 'top') => {
    if (value === sort) return;
    const nextParams = new URLSearchParams(searchParams);
    if (value === 'for-you') nextParams.delete('sort');
    else nextParams.set('sort', value);
    setSearchParams(nextParams, { replace: true });
    useVentStore.setState({
      vents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true,
      scrollLoadinMore: false, scrollSort: value, scrollToItem: null,
    });
  };

  useEffect(() => {
    const nextSort = requestedSort === 'new' || requestedSort === 'hot' || requestedSort === 'top' ? requestedSort : 'for-you';
    if (nextSort === useVentStore.getState().scrollSort) return;
    useVentStore.setState({
      vents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true,
      scrollLoadinMore: false, scrollSort: nextSort, scrollToItem: null,
    });
  }, [requestedSort]);

  const selectPeriod = (value: 'today' | 'week' | 'month' | 'all') => {
    if (value === period) return;
    useVentStore.setState({
      vents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true,
      scrollLoadinMore: false, scrollPeriod: value, scrollToItem: null,
    });
  };

  const fetchProfile = async ()=>{
      try {
        const {data: response } = await axios.get(`${import.meta.env.VITE_API}/profile`,{
          withCredentials: true
        });
        addUser(response);
      } catch (error) {
        console.error(error)
      }
    }


  useEffect(()=>{
    logoutTrendingVents();
    fetchProfile();
    resetScrollToItemTrending();
    resetScrollToItemCompany();
    resetScrollToItemCompanyVent();
    resetScrollToItemProfileVent();
    if( scrollToRef.current ) {
          scrollToRef.current.scrollIntoView();
      }
       // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

useEffect(() => {
  const controller = new AbortController();
  const fetchVents = async () => {
    try {
      if (vents.length === 0) {
        addloading(true);
      } else {
        addloadingMore(true);
      }

    
      const params = new URLSearchParams({ skip: String(skip), category, sort, period });
      const { data: ventsJson } = await axios.get(
        `${import.meta.env.VITE_API}/vents?${params.toString()}`,
        {  signal: controller.signal, withCredentials: true } 
      );
      if (ventsJson.vents.length < PAGE_SIZE) {
        addHasMore(false);  
      }
      if (ventsJson.vents.length > 0) {
        addVents(ventsJson.vents);
      }
      setError(null);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error(error);
        setError("Failed to fetch vents");
      }
    } finally {
      addloading(false);
      addloadingMore(false);
    }
  };

  if (hasMore || vents?.length === 0 ) {
    const timer = setTimeout(() => {
      fetchVents();
    }, 100);

    return () => {
      clearTimeout(timer);
      controller.abort(); 
    };
  }
   // eslint-disable-next-line react-hooks/exhaustive-deps
}, [skip, category, sort, period, refreshButton, refreshEpoch]);


 const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const target = e.currentTarget; // safer than e.target
  const { offsetHeight, scrollTop, scrollHeight } = target;
  const threshold = 1000;

  if (scrollHeight - (offsetHeight + scrollTop) < threshold && !loadingMore && hasMore) {
    addScrollSkip(vents.length);
  }
};


  return (
    <div className="h-screen w-full bg-gray-950 text-white">
      <Sidebar />
      <div ref={feedScrollRef} className="h-screen overflow-y-auto sm:ml-64" onScroll={handleScroll}>
        <div className="mx-auto flex max-w-[1040px] items-start justify-center xl:gap-8 xl:px-4">
          <main className="min-h-screen w-full min-w-0 max-w-[640px]">
            <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/95 backdrop-blur-md">
              <div className="flex min-h-14 items-center px-4 pl-16 sm:pl-5">
                <div>
                  <h1 className="text-base font-medium leading-6 text-gray-100 sm:text-lg">Feed</h1>
                </div>
              </div>
              <div aria-label="Filter stories by topic" className="flex gap-1 overflow-x-auto px-3 pb-2 no-scrollbar">
                <button type="button" onClick={() => selectCategory("")} aria-pressed={!category} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${!category ? 'bg-white text-gray-950' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>All posts</button>
                {categories.map((item) => <button key={item.name} type="button" onClick={() => selectCategory(item.name)} aria-pressed={category === item.name} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${category === item.name ? 'bg-white text-gray-950' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>{item.name}</button>)}
              </div>
              {category && <div className="flex items-center justify-between border-t border-gray-800 px-4 py-2 text-xs text-gray-400 xl:hidden"><span>More {category} in For you</span><button type="button" onClick={() => toggleTopic(category)} aria-pressed={followedTopics.includes(category)} className="rounded-full border border-gray-700 px-3 py-1 text-gray-100">{followedTopics.includes(category) ? 'Following' : 'Follow topic'}</button></div>}
              {followError && <p role="alert" className="px-4 pb-2 text-xs text-red-400 xl:hidden">{followError}</p>}
            </header>

            <RefreshFeed key={`${category}:${sort}:${Math.max(0, ...vents.map(vent => Number(vent.id) || 0))}`} category={category} sort={sort} onRefresh={() => { setRefreshEpoch(value => value + 1); feedScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }} />
            <PostCard timeline />

            <div aria-label="Sort stories" className="flex items-center gap-1 border-b border-gray-800 px-4 py-2 text-sm sm:px-5">
              <span className="mr-2 text-xs text-gray-500">Sort by</span>
              {(['for-you', 'new', 'hot', 'top'] as const).map(option => (
                <button key={option} type="button" onClick={() => selectSort(option)} aria-pressed={sort === option} title={option === 'for-you' ? 'Companies and topics you follow, nearby stories, and fresh posts' : option === 'hot' ? 'Recent posts with more net votes' : option === 'top' ? 'Highest net votes' : 'Newest posts first'} className={`rounded-full px-3 py-1.5 font-medium transition-colors ${sort === option ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>{option === 'for-you' ? 'For you' : option[0].toUpperCase() + option.slice(1)}</button>
              ))}
              {sort === 'top' && <><label htmlFor="feed-top-period" className="sr-only">Top posts time range</label><select id="feed-top-period" value={period} onChange={event => selectPeriod(event.target.value as 'today' | 'week' | 'month' | 'all')} className="ml-auto min-w-0 rounded-lg border border-gray-700 bg-gray-900 px-2 py-1.5 text-xs text-gray-200 focus:border-gray-400 focus:outline-none"><option value="today">Past 24h</option><option value="week">Past 7 days</option><option value="month">Past 30 days</option><option value="all">All time</option></select></>}
            </div>

            {loading && vents.length === 0 && <div className="flex justify-center py-10"><Shuffle text="⟢ OFFICELL" className="font-arimo text-xl font-bold text-white" shuffleDirection="right" duration={0.35} animationMode="evenodd" shuffleTimes={1} ease="power3.out" stagger={0.03} threshold={0.1} loop respectReducedMotion /></div>}
            {error && <div role="alert" className="border-b border-gray-800 p-5 text-sm text-red-400">{error}</div>}
            {!loading && !error && vents.length === 0 && <div className="px-8 py-16 text-center"><h2 className="text-xl font-semibold">{sort === 'top' ? 'No posts in this time range' : 'No stories yet'}</h2><p className="mt-2 text-sm text-gray-400">{sort === 'top' ? 'Try a longer time range or another topic.' : 'Share the first experience in this topic.'}</p></div>}

            {vents.map((vent,index) => (
              <div key={vent.id} onClick={() => addScrollToItem(index)}>
                <VentCard timeline id={vent.id} company_id={vent.company_id ?? vent.company?.id} category={vent.category} content={vent.content} upvote={vent.upvote} downvote={vent.downvote} company_country={vent.company?.country} location_label={ventLocationLabel(vent)} company_name={vent.company?.name} author={vent.author?.username} author_id={vent.author_id} commentcount={vent._count?.comments} createdAt={vent.createdAt} media={vent.Media} votes={vent.votes} user_id={user.id} ref={index === scrollToCard ? scrollToRef : null} />
              </div>
            ))}

            {loadingMore && <div className="flex justify-center py-8"><Shuffle text="⟢ OFFICELL" className="font-arimo text-xl font-bold text-white" shuffleDirection="right" duration={0.35} animationMode="evenodd" shuffleTimes={1} ease="power3.out" stagger={0.03} threshold={0.1} loop respectReducedMotion /></div>}
            {!hasMore && vents.length > 0 && <div className="border-t border-gray-800 px-6 py-10 text-center text-sm text-gray-500">You’re all caught up.</div>}
          </main>

          <aside className="sticky top-0 hidden w-[320px] shrink-0 space-y-5 py-5 xl:block">
            <Link to="/companies" className="flex items-center gap-3 rounded-full bg-gray-800 px-5 py-3 text-sm text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"><Search className="size-5" aria-hidden="true" />Search companies</Link>
            <div className="max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl bg-gray-900 no-scrollbar">
              <h2 className="px-5 pb-3 pt-5 text-base font-medium text-gray-100">Explore topics</h2>
              {categories.map((item) => <div key={item.name} className="flex items-center pr-3"><button type="button" onClick={() => selectCategory(item.name)} className={`flex min-w-0 flex-1 items-center gap-3 px-5 py-3 text-left text-sm transition-colors hover:bg-gray-800 ${category === item.name ? 'text-white' : 'text-gray-300'}`}><span className="text-gray-400">{item.icon}</span><span className="font-medium">{item.name}</span></button><button type="button" onClick={() => toggleTopic(item.name)} aria-label={`${followedTopics.includes(item.name) ? 'Unfollow' : 'Follow'} ${item.name}`} aria-pressed={followedTopics.includes(item.name)} className="rounded-full border border-gray-700 px-2.5 py-1 text-xs text-gray-300 hover:bg-gray-800">{followedTopics.includes(item.name) ? 'Following' : 'Follow'}</button></div>)}
              {followError && <p role="alert" className="px-5 text-xs text-red-400">{followError}</p>}
              <button type="button" onClick={() => selectCategory("")} className="w-full px-5 py-4 text-left text-sm text-gray-400 hover:bg-gray-800 hover:text-white">Show all stories</button>
            </div>
            <p className="px-3 text-xs leading-5 text-gray-500">Your username appears on new posts. Avoid details that could identify you or a coworker.</p>
          </aside>
        </div>
      </div>
    </div>
  );
};
