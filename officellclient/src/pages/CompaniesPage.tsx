import { useEffect, useRef, useState, type UIEvent } from 'react';
import axios from 'axios';
import { TimelineShell } from '../components/common/TimelineShell';
import CompanySearchBar from '../components/company/CompanySearchBar';
import { CompanyCard } from '../components/company/CompanyCard';
import { CompanyFiltersPanel, type CompanySort, type CompanyTypeFilter } from '../components/company/CompanyFiltersPanel';
import AddCompany from '../components/company/AddCompany';
import RefreshCompanies from '../components/company/RefreshCompanies';
import useCompanyStore from '../store/companyStore';
import useCompanyVentStore from '../store/companyventStore';
import useVentStore from '../store/ventStore';
import useProfileVentStore from '../store/profileventStore';
import useTrendingVentStore from '../store/trendingventStore';
import { PAGE_SIZE } from '../utils/pagesize';
import { countryName } from '../utils/countryName';
import { COMPANY_NEARBY_AREA_KEY, readNearbyArea } from '../utils/companyNearbyArea';

export const CompaniesPage = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshEpoch, setRefreshEpoch] = useState(0);
  const [savedArea] = useState(readNearbyArea);
  const [type, setType] = useState<CompanyTypeFilter>(savedArea?.kind === 'manual' && savedArea.mncOnly ? 'MNC' : '');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState<string | null>(savedArea?.kind === 'manual' ? savedArea.country : null);
  const [region, setRegion] = useState(savedArea?.kind === 'manual' ? savedArea.region : '');
  const [sort, setSort] = useState<CompanySort>('recent-activity');
  const [needsArea, setNeedsArea] = useState(false);
  const [nearbyLabel, setNearbyLabel] = useState<string | null>(null);
  const [nearbyCountry, setNearbyCountry] = useState<string | null>(null);
  const [followedIds, setFollowedIds] = useState<Set<number>>(new Set());
  const [followBusyId, setFollowBusyId] = useState<number | null>(null);
  const [followErrorId, setFollowErrorId] = useState<number | null>(null);
  const [followLoadError, setFollowLoadError] = useState(false);
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API}/feed/preferences`, { withCredentials: true })
      .then(({ data }) => setFollowedIds(new Set<number>(data.companyIds)))
      .catch(() => setFollowLoadError(true));
  }, []);
  const toggleFollow = async (companyId: number) => {
    if (followBusyId !== null) return;
    setFollowBusyId(companyId);
    try {
      const wasFollowing = followedIds.has(companyId);
      await axios({ method: wasFollowing ? 'delete' : 'put', url: `${import.meta.env.VITE_API}/feed/follows/companies/${companyId}`, withCredentials: true });
      setFollowedIds(current => {
        const next = new Set(current);
        if (wasFollowing) next.delete(companyId);
        else next.add(companyId);
        return next;
      });
      useVentStore.setState({ vents: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true, scrollLoadinMore: false });
      setFollowErrorId(null);
    } catch { setFollowErrorId(companyId); }
    finally { setFollowBusyId(null); }
  };

  const search = useCompanyStore(state => state.companySearch);
  const setSearch = useCompanyStore(state => state.setCompanySearch);
  const refreshCompanies = useCompanyStore(state => state.refreshButton);
  const skip = useCompanyStore(state => state.scrollSkip);
  const loadingMore = useCompanyStore(state => state.scrollLoadinMore);
  const loading = useCompanyStore(state => state.scrollLoading);
  const hasMore = useCompanyStore(state => state.scrollHasMore);
  const companies = useCompanyStore(state => state.companies);
  const scrollToCard = useCompanyStore(state => state.scrollToItem);
  const addCompanies = useCompanyStore(state => state.addCompanies);
  const addScrollSkip = useCompanyStore(state => state.addScrollSkip);
  const addLoading = useCompanyStore(state => state.addScrollLoading);
  const addLoadingMore = useCompanyStore(state => state.addScrollLoadingMore);
  const addHasMore = useCompanyStore(state => state.addHasMore);
  const addScrollToItem = useCompanyStore(state => state.addScrollToItem);
  const resetCompanies = useCompanyStore(state => state.resetCompanies);
  const logoutCompanyVent = useCompanyVentStore(state => state.logout);
  const logoutTrendingVents = useTrendingVentStore(state => state.logout);
  const resetScrollToItemFeed = useVentStore(state => state.resetScrollToItem);
  const resetScrollToItemProfileVent = useProfileVentStore(state => state.resetScrollToItem);
  const resetScrollToItemTrending = useTrendingVentStore(state => state.resetScrollToItem);

  const changeFilters = () => {
    resetCompanies();
    setError(null);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    changeFilters();
    setSearch('');
    setType('');
    setIndustry('');
    setCountry(null);
    setRegion('');
    setSort('recent-activity');
    sessionStorage.removeItem(COMPANY_NEARBY_AREA_KEY);
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (target.scrollHeight - (target.offsetHeight + target.scrollTop) < 1000 && !loading && !loadingMore && hasMore) {
      addScrollSkip(companies.length);
    }
  };

  useEffect(() => {
    if (country && (region || type === 'MNC')) {
      sessionStorage.setItem(COMPANY_NEARBY_AREA_KEY, JSON.stringify({ kind: 'manual', country, region, mncOnly: type === 'MNC' }));
    }
  }, [country, region, type]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        if (useCompanyStore.getState().companies.length === 0) addLoading(true);
        else addLoadingMore(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API}/companies`, {
          params: { skip, company_name: search, industry, type, searchcountry: country, region, sort, nearby: '1' },
          signal: controller.signal,
          withCredentials: true,
        });
        if (controller.signal.aborted) return;
        const nextCompanies = data.companies ?? [];
        addHasMore(typeof data.hasMore === 'boolean' ? data.hasMore : nextCompanies.length === PAGE_SIZE);
        if (nextCompanies.length) addCompanies(nextCompanies);
        setNeedsArea(Boolean(data.needsArea));
        setNearbyLabel(data.nearbyLabel ?? null);
        setNearbyCountry(data.nearbyCountry ?? null);
        setError(null);
      } catch (requestError) {
        if (!axios.isCancel(requestError) && !controller.signal.aborted) setError('Could not load companies. Please try again.');
      } finally {
        if (!controller.signal.aborted) {
          addLoading(false);
          addLoadingMore(false);
        }
      }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
    // The store is reset whenever a filter changes; requests are driven by filter and page values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, search, industry, type, country, region, sort, refreshCompanies, refreshEpoch]);

  useEffect(() => {
    resetCompanies();
    resetScrollToItemFeed();
    logoutCompanyVent();
    logoutTrendingVents();
    resetScrollToItemProfileVent();
    resetScrollToItemTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasActiveFilters = Boolean(search || type || industry || country || region || sort !== 'recent-activity');
  const areaLabel = country && type === 'MNC' ? countryName(country) : country && region ? region : nearbyLabel || 'you';
  const filterProps = {
    type, industry, country, region, sort, hasActiveFilters,
    onTypeChange: (value: CompanyTypeFilter) => { changeFilters(); setType(value); if (value === 'MNC') setRegion(''); },
    onIndustryChange: (value: string) => { changeFilters(); setIndustry(value); },
    onCountryChange: (value: string) => { changeFilters(); setCountry(value); setRegion(''); },
    onRegionChange: (value: string) => { changeFilters(); setRegion(value); },
    onSortChange: (value: CompanySort) => { changeFilters(); setSort(value); },
    onClear: clearFilters,
  };

  return <TimelineShell title="Companies" subtitle="Find stories from workplaces of every size" onScroll={handleScroll} scrollRef={scrollRef} aside={<CompanyFiltersPanel idPrefix="company-aside" {...filterProps} />}>
    <RefreshCompanies
      key={`${search}:${industry}:${type}:${country}:${region}:${sort}:${Math.max(0, ...companies.map(company => Number(company.id) || 0))}`}
      search={search} industry={industry} type={type} country={country} region={region} sort={sort} nearby
      onRefresh={() => { setRefreshEpoch(value => value + 1); scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }}
    />

    <div className="border-b border-gray-800 px-4 py-4 sm:px-5">
      <CompanySearchBar search={search} onSearch={value => { changeFilters(); setSearch(value); }} />
    </div>

    <CompanyFiltersPanel idPrefix="company-mobile" mobile {...filterProps} />
    <div className="border-b border-gray-800 px-4 py-3 text-xs text-gray-400 sm:px-5">
      {needsArea ? 'Your location could not be determined from your IP. Choose a country and region in Filters.' : <>Companies near {areaLabel} appear first.{(country || nearbyCountry) && ` More from ${countryName((country || nearbyCountry)!)} follow.`}</>}
    </div>

    {needsArea && !loading && <div className="border-b border-gray-800 px-4 py-8 text-center sm:px-5">
      <h2 className="text-base font-medium text-white">Choose your area</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-gray-400">We could not identify your area from your IP address. Choose a country and region in Filters. We will remember that choice for this browser session.</p>
    </div>}

    {loading && companies.length === 0 && <div className="px-5 py-12 text-center text-sm text-gray-400">Loading companies…</div>}
    {error && <div role="alert" className="px-5 py-6 text-sm text-red-400">{error}</div>}
    {followLoadError && <div role="alert" className="px-5 py-3 text-xs text-red-400">Could not load follow status. Refresh to try again.</div>}
    {!loading && !error && companies.length === 0 && !needsArea && <div className="px-5 py-12 text-center text-sm text-gray-400">No nearby companies match these filters.</div>}

    {companies.map((company, index) => <div key={company.id} onClick={() => addScrollToItem(index)}>
      {company.discoveryScope === 'same-country' && companies[index - 1]?.discoveryScope !== 'same-country' && <div className="border-b border-gray-800 px-4 py-3 text-sm font-medium text-gray-300 sm:px-5">More from {countryName(country || nearbyCountry || company.country || '')}</div>}
      <CompanyCard timeline
        company_id={company.id} type={company.type} country_count={company._count?.locations}
        isRemote={company.isRemote} description={company.description} company_name={company.name}
        industry={company.industry} city={company.city} region={company.region} country={company.country}
        vents_count={company._count?.vents ?? 0} domain={company.domain}
        logoUrl={company.logoUrl} latestStoryWeek={company.latestStoryWeek}
        following={followedIds.has(Number(company.id))} followBusy={followBusyId === Number(company.id)}
        onFollowToggle={() => toggleFollow(Number(company.id))}
        followError={followErrorId === Number(company.id) ? 'Could not update follow.' : undefined}
        ref={index === scrollToCard ? cardRef : null}
      />
    </div>)}

    {loadingMore && <div className="px-5 py-8 text-center text-sm text-gray-400">Loading more companies…</div>}
    {!hasMore && companies.length > 0 && <div className="px-5 py-6 text-center text-sm text-gray-500">You've reached the end of the list</div>}
    <div className="px-4 py-5 sm:px-5"><AddCompany /></div>
  </TimelineShell>;
};
