import { RegionDropdown } from 'react-country-region-selector';
import { CountryPicker } from './CountryPicker';
import { categories as companyCategories } from '../../utils/companyCategory';

export type CompanyTypeFilter = '' | 'LOCAL' | 'MNC';
export type CompanySort = 'recent-activity' | 'most-stories' | 'newest';

type Props = {
  idPrefix: string;
  mobile?: boolean;
  type: CompanyTypeFilter;
  industry: string;
  country: string | null;
  region: string;
  sort: CompanySort;
  onTypeChange: (value: CompanyTypeFilter) => void;
  onIndustryChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onSortChange: (value: CompanySort) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
};

export function CompanyFiltersPanel(props: Props) {
  const { idPrefix, mobile, type, industry, country, region, sort, onTypeChange, onIndustryChange, onCountryChange, onRegionChange, onSortChange, onClear, hasActiveFilters } = props;
  const controls = <div className="space-y-4">
    <div>
      <label htmlFor={`${idPrefix}-type`} className="mb-1.5 block text-xs text-gray-400">Company type</label>
      <select id={`${idPrefix}-type`} value={type} onChange={event => onTypeChange(event.target.value as CompanyTypeFilter)} className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-3 text-sm text-white focus:border-gray-400 focus:outline-none">
        <option value="">All types</option>
        <option value="LOCAL">One country</option>
        <option value="MNC">MNC</option>
      </select>
    </div>
    <div>
      <label htmlFor={`${idPrefix}-industry`} className="mb-1.5 block text-xs text-gray-400">Industry</label>
      <select id={`${idPrefix}-industry`} value={industry} onChange={event => onIndustryChange(event.target.value)} className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-3 text-sm text-white focus:border-gray-400 focus:outline-none">
        <option value="">All industries</option>
        {companyCategories.filter(item => item.name !== 'MNCs' && item.name !== 'Startups').map(item => <option key={item.name} value={item.name}>{item.name.trim()}</option>)}
      </select>
    </div>
    <div>
      <CountryPicker value={country} onChange={onCountryChange} label="Country" inputId={`${idPrefix}-country`} />
    </div>
    {type !== 'MNC' && <div>
      <label htmlFor={`${idPrefix}-region`} className="mb-1.5 block text-xs text-gray-400">Region or state</label>
      {country ? <RegionDropdown id={`${idPrefix}-region`} country={country} countryValueType="short" value={region} onChange={onRegionChange} defaultOptionLabel="Choose a region" className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-3 text-sm text-white focus:border-gray-400 focus:outline-none" />
        : <select id={`${idPrefix}-region`} disabled className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-3 text-sm text-gray-500"><option>Choose a country first</option></select>}
    </div>}
    <div>
      <label htmlFor={`${idPrefix}-sort`} className="mb-1.5 block text-xs text-gray-400">Sort by</label>
      <select id={`${idPrefix}-sort`} value={sort} onChange={event => onSortChange(event.target.value as CompanySort)} className="w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-3 text-sm text-white focus:border-gray-400 focus:outline-none">
        <option value="recent-activity">Recently active</option>
        <option value="most-stories">Most stories</option>
        <option value="newest">Recently added</option>
      </select>
    </div>
  </div>;

  if (mobile) return <details className="border-b border-gray-800 px-4 py-4 xl:hidden" aria-label="Company filters">
    <summary className="cursor-pointer text-sm font-medium text-gray-200">Filters{hasActiveFilters ? ' · Active' : ''}</summary>
    <div className="mt-4">
      {hasActiveFilters && <button type="button" onClick={onClear} className="mb-4 text-xs text-gray-400 hover:text-white">Clear filters</button>}
      {controls}
    </div>
  </details>;

  return <section className="max-h-[calc(100vh-2.5rem)] overflow-y-auto rounded-2xl border border-gray-800 bg-gray-900 p-5" aria-label="Company filters">
    <div className="mb-5 flex items-center justify-between gap-2">
      <h2 className="text-base font-medium text-white">Filters</h2>
      {hasActiveFilters && <button type="button" onClick={onClear} className="text-xs text-gray-400 hover:text-white">Clear all</button>}
    </div>
    {controls}
  </section>;
}
