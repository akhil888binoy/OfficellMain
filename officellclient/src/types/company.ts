// types/company.ts
export interface Company {
  id: string;
  name: string;
  type?: 'LOCAL' | 'MNC';
  description?: string | null;
  isRemote?: boolean;
  industry: string;
  city: string | null;
  region?: string | null;
  country: string | null;
  domain: string | null;
  logoUrl?: string | null;
  _count?: {
    vents: number;
    locations?: number;
  };
  locations?: Array<{ id: number; city: string | null; country: string }>;
  createdAt: string;
  latestStoryWeek?: string | null;
  discoveryScope?: 'nearby' | 'same-country';
}

export interface ReactSelectOption {
  value: string;
  label: string;
  key?: string;
}

export interface CompanyState {
  scrollSkip: number;
  scrollLoading: boolean;
  scrollLoadinMore: boolean;
  scrollCategory: string;
  scrollHasMore: boolean;
  scrollToItem: number | null;
  companies: Company[];
  refreshButton: boolean;
  searchcountry: ReactSelectOption | null;
  region: ReactSelectOption | null;
  companySearch: string;
  setCompanySearch: (data: string) => void;
  setRegion: (data: ReactSelectOption | null) => void;
  setCountry: (data: ReactSelectOption | null) => void;
  setRefreshButton: (data: boolean) => void;
  addScrollSkip: (data: number) => void;
  addScrollLoading: (data: boolean) => void;
  addScrollLoadingMore: (data: boolean) => void;
  addScrollCategory: (data: string) => void;
  addHasMore: (data: boolean) => void;
  addScrollToItem: (data: number | null) => void;
  addCompanies: (data: Company[]) => void;
  getCompany: (id: string) => Company | null;
  reset: () => void;
  resetScrollToItem: () => void;
  logout: () => void;
  resetCompanies: () => void;
}
