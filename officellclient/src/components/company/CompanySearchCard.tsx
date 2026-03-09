import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import {getName} from "country-list";
import { cleanCountryName, cleanDomain } from "../../utils/cleanerText";

interface CompanySearchCardProps {
  company_id: string;
  city: string;
  country: string;
  company_name: string;
  industry: string;
  domain: string;
}


export const CompanySearchCard = ({
  company_id,
  city,
  country,
  company_name,
  industry,
  domain,
}: CompanySearchCardProps) =>  {

  return (
     <>
    {company_id &&
     <div className="relative flex flex-col bg-gray-950 w-full overflow-hidden 
rounded-xl p-3 gap-2 border border-gray-800 hover:border-gray-600 transition">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
         <h3 className="text-white font-dmsans font-semibold text-sm sm:text-base">
            {company_name}
        </h3>
        {/* Category Badge */}
          <span className="  px-2 py-0.5 text-[10px] sm:text-xs tracking-[1px] font-dmsans rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30">
          {industry}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pb-3 flex flex-col gap-2">
        <div className="flex items-center gap-1 text-gray-400 text-[11px] sm:text-xs ">
          <FaMapMarkerAlt className="text-red-400" />
              <span>
                {city}, {cleanCountryName(getName(country) ?? "")}
              </span>
        </div>
        {domain && (
                        <div className="flex items-center gap-1 text-gray-400 text-[11px] sm:text-xs ">
                          <FaGlobe className="text-green-400" />
                          <a
                            data-testid="website-link"
                            onClick={(e) => e.stopPropagation()}
                            href={domain}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-300 transition-colors"
                          >
                            {cleanDomain(domain)}
                          </a>
                        </div>
            )}
      </div>

    </div>}
    </>
  );
};
