import { Check } from 'lucide-react';
import { RiBuilding2Line } from 'react-icons/ri';
import { cleanDomain } from '../../utils/cleanerText';
import { countryName } from '../../utils/countryName';

type CompanySearchCardProps = {
  type?: 'LOCAL' | 'MNC';
  isRemote?: boolean;
  city: string | null;
  region?: string | null;
  country: string | null;
  company_name: string;
  industry: string | null;
  domain: string | null;
  logoUrl?: string | null;
  selected: boolean;
  onSelect: () => void;
};

export const CompanySearchCard = ({
  type,
  isRemote,
  city,
  region,
  country,
  company_name,
  industry,
  domain,
  logoUrl,
  selected,
  onSelect,
}: CompanySearchCardProps) => {
  const place = type === 'MNC'
    ? 'Multiple countries'
    : isRemote
      ? `Remote${country ? ` · ${countryName(country)}` : ''}`
      : [city, region, country ? countryName(country) : null].filter(Boolean).join(', ');

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white ${selected ? 'bg-gray-900' : 'hover:bg-gray-900/70'}`}
    >
      <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-800 text-gray-400">
        <RiBuilding2Line className="size-5" aria-hidden="true" />
        {logoUrl && <img src={logoUrl} alt="" loading="lazy" referrerPolicy="no-referrer" onError={event => { event.currentTarget.style.display = 'none'; }} className="absolute inset-0 size-full bg-white object-contain p-1" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-white">{company_name}</span>
        <span className="mt-0.5 block truncate text-xs text-gray-400">{[place, industry].filter(Boolean).join(' · ')}</span>
        {domain && <span className="mt-0.5 block truncate text-xs text-gray-500">{cleanDomain(domain)}</span>}
      </span>
      <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-white bg-white text-gray-950' : 'border-gray-600 text-transparent'}`} aria-hidden="true">
        <Check className="size-3" />
      </span>
    </button>
  );
};
