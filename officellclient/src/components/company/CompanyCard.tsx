import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { getName } from "country-list";
import { cleanCountryName, cleanDomain } from "../../utils/cleanerText";
import { forwardRef } from "react";

type CompanyCardProps = {
  company_id: string;
  city: string;
  country: string;
  company_name: string;
  industry: string;
  vents_count: number;
  domain?: string;
};

const formatUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `https://${url}`;
};

export const CompanyCard = forwardRef<HTMLDivElement, CompanyCardProps>(
  ({ company_id, city, country, company_name, industry, vents_count, domain }, ref) => {
    return (
      <>
        {company_id ? (
          <div
            className="relative flex flex-col bg-gray-950 border-t border-b border-gray-700 w-full overflow-hidden"
            ref={ref}
          >
            {/* Header */}
            <a href={`/companies/${company_id}`} data-testid="company-link">
              <div className="flex items-center justify-between px-4 py-3">
                <h3 className="text-white font-dmsans font-semibold text-md lg:text-lg">
                  {company_name}
                </h3>
                {/* Category Badge */}
                <span className="px-3 py-1 text-xs tracking-[1px] font-dmsans rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30">
                  {industry}
                </span>
              </div>
            </a>

            {/* Body */}
            <div className="px-4 pb-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-400 text-sm ">
                <FaMapMarkerAlt className="text-red-400" />
                <span>
                {city}, {cleanCountryName(getName(country) ?? "")}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-sm ">
                <BiMessageDetail className="text-blue-400" />
                <span>{vents_count}</span>
              </div>

              {/* Website */}
              {domain && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm ">
                      <FaGlobe className="text-green-400" />
                      <a
                        data-testid="website-link"
                        onClick={(e) => e.stopPropagation()}
                        href={formatUrl(domain)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-300 transition-colors"
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
