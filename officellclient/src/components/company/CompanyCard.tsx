import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { getName } from "country-list";
import { cleanCountryName, cleanDomain } from "../../utils/cleanerText";
import { forwardRef } from "react";
import { countryName } from '../../utils/countryName';
import { RiBuilding2Line } from 'react-icons/ri';

type CompanyCardProps = {
  company_id: string;
  type?: 'LOCAL' | 'MNC';
  country_count?: number;
  isRemote?: boolean;
  description?: string | null;
  city: string | null;
  region?: string | null;
  country: string | null;
  company_name: string;
  industry: string | null;
  vents_count: number;
  domain?: string | null;
  logoUrl?: string | null;
  latestStoryWeek?: string | null;
  timeline?: boolean;
  following?: boolean;
  followBusy?: boolean;
  onFollowToggle?: () => void;
  followError?: string;
};

const formatUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

export const CompanyCard = forwardRef<HTMLDivElement, CompanyCardProps>(
  ({ company_id, type, country_count, isRemote, description, city, region, country, company_name, industry, vents_count, domain, logoUrl, latestStoryWeek, timeline = false, following, followBusy, onFollowToggle, followError }, ref) => {
    const currentWeek = new Date();
    currentWeek.setUTCHours(0, 0, 0, 0);
    currentWeek.setUTCDate(currentWeek.getUTCDate() - ((currentWeek.getUTCDay() + 6) % 7));
    const activeThisWeek = latestStoryWeek && new Date(latestStoryWeek) >= currentWeek;
    return (
      <>
        {company_id ? (
          <div
            className={`relative flex w-full flex-col overflow-hidden bg-gray-950 ${timeline ? "border-b border-gray-800" : "border-t border-b border-gray-700"}`}
            ref={ref}
          >
            {/* Header */}
              <div className="flex flex-wrap items-center gap-3 px-4 pb-2 pt-4 sm:px-5">
                <a href={`/companies/${company_id}`} data-testid="company-link" className="flex min-w-0 flex-1 items-center gap-3 hover:underline">
                  <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-800 text-gray-400"><RiBuilding2Line className="size-5" aria-hidden="true" />{logoUrl && <img src={logoUrl} alt="" loading="lazy" referrerPolicy="no-referrer" onError={event => { event.currentTarget.style.display = 'none'; }} className="absolute inset-0 size-full bg-white object-contain p-1" />}</span>
                  <h3 className="truncate text-base font-semibold text-white">{company_name}</h3>
                </a>
                {/* Category Badge */}
                <div className="flex shrink-0 gap-2">
                  {type === 'MNC' && <span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300">MNC</span>}
                  {industry && <span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400">{industry}</span>}
                </div>
                {onFollowToggle && <button type="button" onClick={onFollowToggle} disabled={followBusy} aria-label={`${following ? 'Unfollow' : 'Follow'} ${company_name}`} aria-pressed={Boolean(following)} className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${following ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-white bg-white text-gray-950 hover:bg-gray-200'}`}>{following ? 'Following' : 'Follow'}</button>}
              </div>

            {/* Body */}
            <div className="flex flex-col gap-2 px-4 pb-4 sm:px-5">
              {followError && <span role="alert" className="text-xs text-red-400">{followError}</span>}
              {(city || country) && <div className="flex items-center gap-2 text-gray-400 text-sm ">
                <FaMapMarkerAlt className="text-gray-500" />
                <span>
                {isRemote ? `Remote · ${country ? countryName(country) : ''}` : [city, region, country ? cleanCountryName(getName(country) ?? country) : ''].filter(Boolean).join(', ')}
                </span>
              </div>}
              {type === 'MNC' && <div className="flex items-center gap-2 text-gray-400 text-sm"><FaMapMarkerAlt className="text-gray-500" /><span>Across {country_count ?? 0} {(country_count ?? 0) === 1 ? 'country' : 'countries'}</span></div>}
              {description && <p className="text-sm leading-5 text-gray-300">{description}</p>}

              <div className="flex items-center gap-2 text-gray-400 text-sm ">
                <BiMessageDetail className="text-gray-500" />
                <span>{vents_count} {vents_count === 1 ? "story" : "stories"}</span>
                {activeThisWeek && <span className="rounded-full border border-gray-700 px-2 py-0.5 text-xs text-gray-300">Active this week</span>}
              </div>

              {/* Website */}
              {domain && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm ">
                      <FaGlobe className="text-gray-500" />
                      <a
                        data-testid="website-link"
                        onClick={(e) => e.stopPropagation()}
                        href={formatUrl(domain)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-white"
                      >
                        {cleanDomain(domain)}
                      </a>
                    </div>
                  )}
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    );
  }
);
