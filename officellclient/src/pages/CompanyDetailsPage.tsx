
import { useParams, useSearchParams } from "react-router-dom";
import { TimelineShell } from "../components/common/TimelineShell";
import { TopicAside, TopicFilters } from "../components/common/TopicFilters";
import { CompanyCard } from "../components/company/CompanyCard";
import { AddCompanyOffice } from "../components/company/AddCompanyOffice";
import PostCard from "../components/vent/PostCard";
import  {VentCard } from "../components/vent/VentCard";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useUserStore from "../store/userStore";
import useCompanyStore from "../store/companyStore";
import Shuffle from "../styles/Shuffle";
import { FaSkullCrossbones } from "react-icons/fa";
import useCompanyVentStore from "../store/companyventStore";
import { PAGE_SIZE } from "../utils/pagesize";
import useVentStore from "../store/ventStore";
import type { Company } from "../types/company";
import { countryName } from '../utils/countryName';


export const CompanyDetailsPage = () => {

  const {id} = useParams<{id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedLocationId = Number(searchParams.get('location'));
  const activeLocationId = Number.isInteger(requestedLocationId) && requestedLocationId > 0 ? requestedLocationId : null;
  const scrollToRef = useRef<null | HTMLDivElement>(null);
  const scrollToCard= useCompanyVentStore((state)=> state.scrollToItem) ;
  const [error, setError] = useState<string | null>(null);
  const skip = useCompanyVentStore((state)=> state.scrollSkip);
  const loadingMore = useCompanyVentStore((state)=> state.scrollLoadinMore);
  const loading = useCompanyVentStore((state)=> state.scrollLoading);
  const category = useCompanyVentStore((state)=> state.scrollCategory);
  const hasMore = useCompanyVentStore((state)=> state.scrollHasMore);
  const user = useUserStore((state) => state.user);
  const cachedCompany = useCompanyStore((state)=>state.getCompany(id || ""));
  const [fetchedCompany, setFetchedCompany] = useState<Company | null>(null);
  const [following, setFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [followError, setFollowError] = useState('');
  useEffect(() => { axios.get(`${import.meta.env.VITE_API}/feed/preferences`, { withCredentials: true }).then(({ data }) => setFollowing(data.companyIds.includes(Number(id)))).catch(() => setFollowError('Could not load follow status.')); }, [id]);
  const toggleFollow = async () => {
    if (!id || followBusy) return;
    setFollowBusy(true);
    try {
      await axios({ method: following ? 'delete' : 'put', url: `${import.meta.env.VITE_API}/feed/follows/companies/${id}`, withCredentials: true });
      setFollowing(!following);
      useVentStore.setState({ vents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true, scrollLoadinMore: false });
      setFollowError('');
    } catch { setFollowError('Could not update follow.'); }
    finally { setFollowBusy(false); }
  };
  const company = fetchedCompany && String(fetchedCompany.id) === id ? fetchedCompany : cachedCompany;
  const isMnc = company?.type === 'MNC';
  const locations = company?.locations ?? [];
  const isMultiLocation = isMnc ? locations.length > 0 : locations.length > 1;
  const activeLocation = locations.find(location => location.id === activeLocationId);
  const addVents = useCompanyVentStore((state) => state.addVents);
  const addScrollSkip = useCompanyVentStore((state)=> state.addScrollSkip);
  const addloading = useCompanyVentStore((state)=> state.addScrollLoading);
  const addloadingMore = useCompanyVentStore((state)=> state.addScrollLoadingMore);
  const addHasMore = useCompanyVentStore((state)=> state.addHasMore);
  const addScrollToItem = useCompanyVentStore((state)=> state.addScrollToItem);
  const vents = useCompanyVentStore((state) => state.companyvents);
  const refreshButton = useVentStore((state)=> state.refreshButton);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    axios.get(`${import.meta.env.VITE_API}/companies/${id}`, { withCredentials: true, signal: controller.signal })
      .then(({ data }) => setFetchedCompany(data.company ?? null))
      .catch(error => { if (!axios.isCancel(error)) console.error(error); });
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!activeLocationId || !fetchedCompany || String(fetchedCompany.id) !== id || fetchedCompany.locations?.some(location => location.id === activeLocationId)) return;
    const next = new URLSearchParams(searchParams);
    next.delete('location');
    setSearchParams(next, { replace: true });
  }, [activeLocationId, fetchedCompany, id, searchParams, setSearchParams]);

  const selectCategory = (value: string) => {
    if (value === category) return;
    useCompanyVentStore.setState({ companyvents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true, scrollLoadinMore: false, scrollCategory: value, scrollToItem: null });
  };

  const selectLocation = (locationId: number | null) => {
    if (locationId === activeLocationId) return;
    const next = new URLSearchParams(searchParams);
    if (locationId) next.set('location', String(locationId));
    else next.delete('location');
    setSearchParams(next);
    useCompanyVentStore.setState({ companyvents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true, scrollLoadinMore: false, scrollToItem: null });
  };

  useEffect(() => {
    useCompanyVentStore.setState({ companyvents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true, scrollLoadinMore: false, scrollToItem: null });
  }, [id, activeLocationId]);

useEffect(() => {
    const controller = new AbortController();
    const fetchVents = async () => {
      try {
        if (!id) return ;
        if (vents.length === 0) {
          addloading(true);
        } else {
          addloadingMore(true);
        }
        
      
        const params = new URLSearchParams({ skip: String(skip), company_id: id, category });
        if (activeLocationId) params.set('location_id', String(activeLocationId));
        const { data: ventsJson } = await axios.get(`${import.meta.env.VITE_API}/vents?${params}`, {
          signal: controller.signal , withCredentials: true
        });
        
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
    
    if (hasMore || vents.length === 0|| category.length > 0) {
      const timer = setTimeout(()=>{
        fetchVents();
      },100) ;
      return () => {
        clearTimeout(timer);
        controller.abort(); 
    };
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, id, category, activeLocationId, refreshButton]);


  useEffect(()=>{
    if(scrollToRef.current ) {
      scrollToRef.current.scrollIntoView();
    }
  },[id]);


  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const target = e.currentTarget; // safer than e.target
  const { offsetHeight, scrollTop, scrollHeight } = target;
  const threshold = 1000;

  if (scrollHeight - (offsetHeight + scrollTop) < threshold && !loadingMore && hasMore) {
    addScrollSkip(vents.length);
  }
};


  return (
    <TimelineShell title={company?.name || "Company stories"} subtitle="Workplace stories, shared under usernames" onScroll={handleScroll} headerContent={<TopicFilters category={category} onSelect={selectCategory} />} aside={<TopicAside category={category} onSelect={selectCategory} />}>
        {company && <CompanyCard timeline
          key={company.id}
          company_id={String(company.id)} type={company.type} country_count={company._count?.locations}
          company_name={company.name} industry={company.industry} city={company.city} region={company.region}
          country={company.country} isRemote={company.isRemote} description={company.description}
          vents_count={company._count?.vents ?? 0} domain={company.domain}
          logoUrl={company.logoUrl}
          following={following} followBusy={followBusy} onFollowToggle={toggleFollow} followError={followError}
        />}
        {company && isMultiLocation && <section className="border-b border-gray-800 px-4 py-5 sm:px-5" aria-label="Company locations">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-medium text-gray-100">{isMnc ? `Across ${locations.length} countries` : `Across ${locations.length} locations`}</h2>
            <div className="flex items-center gap-2">
              {isMnc && <span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300">MNC</span>}
              {company.industry && <span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400">{company.industry}</span>}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2" aria-label={isMnc ? 'Filter stories by country' : 'Filter stories by location'}>
            <button type="button" onClick={() => selectLocation(null)} aria-pressed={!activeLocationId} className={`rounded-full border px-3 py-1.5 text-xs ${!activeLocationId ? 'border-white bg-white text-gray-950' : 'border-gray-700 bg-gray-900 text-gray-300 hover:text-white'}`}>{isMnc ? 'All countries' : 'All locations'}</button>
            {locations.map(location => <button key={location.id} type="button" onClick={() => selectLocation(location.id)} aria-pressed={activeLocationId === location.id} className={`rounded-full border px-3 py-1.5 text-xs ${activeLocationId === location.id ? 'border-white bg-white text-gray-950' : 'border-gray-700 bg-gray-900 text-gray-300 hover:text-white'}`}>{isMnc ? countryName(location.country) : `${location.city}, ${location.country}`}</button>)}
          </div>
          <p className="mt-3 text-xs text-gray-400">{activeLocation ? `Showing stories tagged ${isMnc ? countryName(activeLocation.country) : activeLocation.city}.` : `${company._count?.vents ?? 0} ${(company._count?.vents ?? 0) === 1 ? "story" : "stories"} across all ${isMnc ? 'countries' : 'locations'}, including company-wide posts.`}</p>
        </section>}
          {company && <PostCard timeline fixedCompany={{ id: String(company.id), type: company.type, locations }} activeLocationId={activeLocationId} />}
          {company && !company.isRemote && (company.type === 'MNC' || company.city) && <AddCompanyOffice company={company} onAdded={setFetchedCompany} />}
              {!loading && vents.length === 0 && (
                <div className="text-center text-gray-500 py-6">
                  {activeLocation ? `No stories tagged ${isMnc ? countryName(activeLocation.country) : activeLocation.city} yet.` : 'Be the first to bitch'}
                </div>
              )}
                            {/* Error message */}
                                    {error && (
                                      <div className="text-red-500 text-center p-4">
                                        {error}
                                      </div>
                                    )}
                                    
                                     {/* Companies list */}
                                    {vents.map((vent,index) => (
                                      <div key={vent.id} onClick={()=> addScrollToItem(index) }>
                                          <VentCard timeline
                                            id={vent.id}
                                            company_id={vent.company_id ?? vent.company?.id ?? company?.id}
                                            category= {vent.category}
                                            content = {vent.content}
                                            upvote={vent.upvote}
                                            downvote={vent.downvote}
                                            company_country={isMultiLocation ? undefined : vent.company?.country}
                                            location_label={isMnc && vent.location ? countryName(vent.location.country) : vent.location?.city ?? undefined}
                                            company_name={vent.company?.name}
                                            author={vent.author?.username}
                                            author_id = {vent.author_id}
                                            commentcount = {vent._count?.comments}
                                            createdAt= {vent.createdAt}
                                            media = {vent.Media}
                                            votes={vent.votes}
                                            user_id = {user.id}
                                            ref={index === scrollToCard ?  scrollToRef : null}
                                        />     
                                      </div>
                  
                                    ))}
                                    
                                     {/* Loading more indicator */}
                                    {loadingMore || loading && 
                                  <div className="flex justify-center items-center py-10 w-full">
                                    <Shuffle
                                      text="⟢ OFFICELL"
                                      className="font-arimo text-white font-bold tracking-[-0.001em] text-xl sm:text-xl md:text-6xl lg:text-[70px]"
                                      shuffleDirection="right"
                                      duration={0.35}
                                      animationMode="evenodd"
                                      shuffleTimes={1}
                                      ease="power3.out"
                                      stagger={0.03}
                                      threshold={0.1}
                                      loop={true}
                                      respectReducedMotion={true}
                                    />
                                  </div>
                                  }
                                    
                                     {/* End of results message */}
                                    {!hasMore && vents.length > 0 && (
                                      <div className="text-center text-gray-400 py-6 flex justify-center items-center space-x-2">
                                                                <FaSkullCrossbones />
                                                                <span>THE END</span>
                                      </div>
                              )}
    </TimelineShell>
  );
};
