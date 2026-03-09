import { CompanyCategory } from "../components/company/CompanyCategory";
import { Sidebar } from "../components/common/Sidebar";
import { CompanyCategoryM } from "../components/company/mobile/CompanyCategoryM";
import CompanySearchBar from "../components/company/CompanySearchBar";
import { CompanyCard } from "../components/company/CompanyCard";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AddCompany from "../components/company/AddCompany";
import useCompanyStore from "../store/companyStore";
import Shuffle from "../styles/Shuffle";
import { PAGE_SIZE } from "../utils/pagesize";
import useCompanyVentStore from "../store/companyventStore";
import useVentStore from "../store/ventStore";
import useProfileVentStore from "../store/profileventStore";
import useTrendingVentStore from "../store/trendingventStore";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import Select from 'react-select';


const customRender = (props) => {
  const {
    options,
    disabled,
    customProps,
    ...selectProps
  } = props;

  return (
    <Select
      {...selectProps}
      options={options}
      isDisabled={disabled}
      isSearchable={true}
      isClearable={true}
      value={customProps.reactSelectValue}
      onChange={customProps.onChange}   
    />
  );
};



export const CompaniesPage = () => {

  const scrollToRef = useRef<null | HTMLDivElement>(null);
  const scrollToCard= useCompanyStore((state)=> state.scrollToItem) ;
  const [error, setError] = useState<string | null>(null);
  // const [search , setSearch] = useState("");
  const search = useCompanyStore((state)=>state.companySearch);
  const setSearch = useCompanyStore((state)=>state.setCompanySearch);
  // const [country, setCountry] = useState<ReactSelectOption | undefined>();
  // const [region, setRegion] = useState<ReactSelectOption | undefined>();
  const country = useCompanyStore((state)=>state.searchcountry);
  const region = useCompanyStore((state)=> state.region);
  const setCountry = useCompanyStore((state)=>state.setCountry);
  const setRegion = useCompanyStore((state)=> state.setRegion);
  const refreshCompanies = useCompanyStore((state)=> state.refreshButton);
  const skip = useCompanyStore((state)=> state.scrollSkip);
  const loadingMore = useCompanyStore((state)=> state.scrollLoadinMore);
  const loading = useCompanyStore((state)=> state.scrollLoading);
  const category = useCompanyStore((state)=> state.scrollCategory);
  const hasMore = useCompanyStore((state)=> state.scrollHasMore);
  const companies = useCompanyStore((state) => state.companies);
  const addCompanies = useCompanyStore((state) => state.addCompanies);
  const addScrollSkip = useCompanyStore((state)=> state.addScrollSkip);
  const addloading = useCompanyStore((state)=> state.addScrollLoading);
  const addloadingMore = useCompanyStore((state)=> state.addScrollLoadingMore);
  const addcategory = useCompanyStore((state)=> state.addScrollCategory);
  const addHasMore = useCompanyStore((state)=> state.addHasMore);
  const addScrollToItem = useCompanyStore((state)=> state.addScrollToItem);
  const logout = useCompanyStore((state)=> state.logout);
  const logoutCompanyVent = useCompanyVentStore((state)=>state.logout);
  const resetScrollToItemFeed = useVentStore((state)=> state.resetScrollToItem);
  const resetScrollToItemProfileVent = useProfileVentStore((state)=> state.resetScrollToItem);
  const resetScrollToItemTrending = useTrendingVentStore((state)=> state.resetScrollToItem);
  const logoutTrendingVents = useTrendingVentStore((state)=> state.logout);
  const resetCompanies= useCompanyStore((state)=> state.resetCompanies);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const target = e.currentTarget; // safer than e.target
  const { offsetHeight, scrollTop, scrollHeight } = target;
  const threshold = 1000;

  if (scrollHeight - (offsetHeight + scrollTop) < threshold && !loadingMore && hasMore) {
    addScrollSkip(companies.length);
  }
};



  useEffect(() => {
    const controller = new AbortController();
    const fetchCompanies = async () => {

      try {
        
        if (companies.length === 0) {
          addloading(true);
        } else {
          addloadingMore(true);
        }
        
        const { data: companiesJson } = await axios.get(`${import.meta.env.VITE_API}/companies?skip=${skip}&company_name=${search}&industry=${category}&place=${region ? region.value:''}&searchcountry=${country? country.key:''}`, {
          signal: controller.signal , withCredentials: true
        });
        const newCompanies = companiesJson.companies;
        // Check if we've reached the end of the list
        if (newCompanies.length < PAGE_SIZE) {
              addHasMore(false);  
            }
        if (newCompanies.length > 0) {
              addCompanies(newCompanies);
          }
        setError(null);
      } catch (error) {
          if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
          } else {
            console.error(error);
            setError("Failed to fetch companies");
          }
      } finally {
        addloading(false);
        addloadingMore(false);
      }
    };
  
    if (hasMore || companies?.length === 0 ) {
      const timer = setTimeout(()=>{
        fetchCompanies();
      },1000);
      return () => {
        clearTimeout(timer);
        controller.abort(); 
      };
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, search, category, refreshCompanies, country , region]);


  useEffect(()=>{
   
    resetScrollToItemFeed();
    logoutCompanyVent();
    logoutTrendingVents();
    resetScrollToItemProfileVent();
    resetScrollToItemTrending();
    if( scrollToRef.current ) {
        scrollToRef.current.scrollIntoView();
      }
       // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  
  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="h-screen border-r-1 border-gray-700 ">
        <Sidebar />
        <CompanyCategoryM 
          category={category}
          onSelect={(q:string)=>{
            logout()
            addcategory(q)
          }} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 overflow-y-scroll" onScroll={handleScroll}>
          <CompanySearchBar  search={search} onSearch={(q:string) => {
            resetCompanies();
            setSearch(q);
          }} />
          
          {/* Initial loading indicator */}
          {loading && companies?.length === 0 && 
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
          {/* Error message */}
          {error && (
            <div className="text-red-500 text-center p-4">
              {error}
            </div>
          )}
          
          {/* Companies list */}
          {companies?.map((company, index) => (
          <span key={index} onClick={()=> addScrollToItem(index) }>
            <CompanyCard
              company_id={company.id}
              company_name={company.name}
              industry={company.industry}
              city={company.city}
              country={company.country}
              vents_count={company._count?.vents ? company._count?.vents : 0}
              domain={company.domain}
              ref={index === scrollToCard ?  scrollToRef : null}
            />
          </span>
          ))}
          
          {/* Loading more indicator */}
          {loadingMore &&  <div className="flex justify-center items-center py-10 w-full">
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
          <AddCompany></AddCompany>
          {/* End of results message */}
          {!hasMore && companies.length > 0 && (
            <div className="text-center text-gray-400 py-6">
              You've reached the end of the list
            </div>
          )}
        </div>
        
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4 overflow-y-scroll">
            <div className="space-y-6 bg-gray-950 p-6 rounded-2xl">
            {/* Country */}
            <div>
              <h2 className="text-sm font-dmsans tracking-[1px] mb-2 text-gray-50 ">
                Country
              </h2>
                <CountryDropdown
                  value={country?.value || ""}
                  className="country w-ful"
                  name="country-field"
                  customRender={customRender}
                  customProps={{
                    reactSelectValue: country,
                    classNamePrefix: "country-",
                    onChange: (value) => {
                      resetCompanies();
                      setCountry(value ? value : undefined);
                      setRegion(null);
                    },
                  }}
                />
            </div>
            {/* City */}
            <div>
              <h2 className="text-sm font-dmsans  tracking-[1px] mb-2 text-gray-50">
                City
              </h2>
                <RegionDropdown
                  country={country?.value || ""}
                  value={region?.value || ""}
                  className="region w-full"
                  name="region-field"
                  customRender={customRender}
                  customProps={{
                    reactSelectValue: region,
                    classNamePrefix: "region-",
                    onChange: (value) => {
                      resetCompanies();
                      setRegion(value ? value : undefined);
                    },
                  }}
                />
            </div>
          </div>
          <CompanyCategory 
          category={category}
          onSelect={(q:string)=>{
            logout()
            addcategory(q)
          }} />
        </div>

      </div>
    </div>
  );
}; 
