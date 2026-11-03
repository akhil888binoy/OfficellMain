import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import axios from "axios";
import useCompanyStore from "../../store/companyStore";

type RefreshCompaniesProps = {
  search: string;
  industry: string;
  type: string;
  country: string | null;
  region: string;
  sort: string;
  nearby?: boolean;
  onRefresh?: () => void;
};

const RefreshCompanies = ({ search, industry, type, country, region, sort, nearby = false, onRefresh }: RefreshCompaniesProps) => {
  const companies = useCompanyStore(state => state.companies);
  const newestId = Math.max(0, ...companies.map(company => Number(company.id) || 0));
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    setNewCount(0);
    if (!newestId) return;
    let active = true;
    const checkForNewCompanies = async () => {
      try {
        const params = new URLSearchParams({ skip: '0', company_name: search, industry, type, searchcountry: country ?? '', region, sort, ...(nearby ? { nearby: '1' } : {}) });
        const { data } = await axios.get(`${import.meta.env.VITE_API}/companies?${params}`, { withCredentials: true });
        if (active) setNewCount((data.companies ?? []).filter(company => Number(company.id) > newestId).length);
      } catch (error) {
        if (active) console.error(error);
      }
    };
    void checkForNewCompanies();
    const interval = setInterval(checkForNewCompanies, 50000);
    return () => { active = false; clearInterval(interval); };
  }, [newestId, search, industry, type, country, region, sort, nearby]);

  if (!newCount) return null;

  const showNewCompanies = () => {
    setNewCount(0);
    useCompanyStore.setState({ companies: [], scrollSkip: 0, scrollHasMore: true, scrollLoading: true, scrollLoadinMore: false, scrollToItem: null, refreshButton: false });
    onRefresh?.();
  };

  return <div className="flex justify-center border-b border-gray-800 bg-gray-950 px-4 py-3">
    <button type="button" onClick={showNewCompanies} className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-100 transition-colors hover:bg-gray-800">
      <ArrowUp className="size-4" aria-hidden="true" />
      Show new companies
    </button>
  </div>;
};

export default RefreshCompanies;
