import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as maplibregl from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { countryName } from '../../utils/countryName';

maplibregl.setWorkerUrl(workerUrl);

export type MapCompany = {
  id: number;
  name: string;
  type?: 'LOCAL' | 'MNC';
  domain: string | null;
  description?: string | null;
  isRemote?: boolean;
  city: string | null;
  region?: string | null;
  country: string | null;
  mapLat: number | null;
  mapLng: number | null;
  _count: { vents: number };
  locationCount?: number;
  locationId?: number;
};

type Props = { companies: MapCompany[]; styleUrl: string; onShowList: () => void };

export function CompanyMap({ companies, styleUrl, onShowList }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [mapError, setMapError] = useState(false);

  const groups = useMemo(() => {
    const result = new Map<string, MapCompany[]>();
    for (const company of companies) {
      if (company.mapLat == null || company.mapLng == null) continue;
      const key = `${company.type === 'MNC' ? '' : company.city ?? company.region ?? ""}|${company.country ?? ""}|${company.mapLat.toFixed(3)}|${company.mapLng.toFixed(3)}`;
      result.set(key, [...(result.get(key) ?? []), company]);
    }
    return result;
  }, [companies]);
  const unmapped = companies.filter(company => company.mapLat == null || company.mapLng == null);

  useEffect(() => {
    if (!container.current || map.current) return;
    let instance: maplibregl.Map;
    try {
      instance = new maplibregl.Map({
        container: container.current,
        style: styleUrl,
        center: [78.96, 20.59],
        zoom: 3,
        attributionControl: false,
      });
    } catch {
      setMapError(true);
      return;
    }
    map.current = instance;
    instance.scrollZoom.disable();
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    instance.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    instance.on("error", () => setMapError(true));
    return () => { instance.remove(); map.current = null; };
  }, [styleUrl]);

  useEffect(() => {
    if (!map.current) return;
    const markers: maplibregl.Marker[] = [];
    const bounds = new maplibregl.LngLatBounds();
    for (const [key, group] of groups) {
      const first = group[0];
      const lngLat: [number, number] = [first.mapLng!, first.mapLat!];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "rounded-full border-2 border-white bg-gray-950 px-3 py-1.5 text-sm font-semibold text-white shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400";
      const label = group.length === 1 ? (first.type === 'MNC' ? countryName(first.country ?? '') : first.locationCount && first.locationCount > 1 ? first.city ?? first.name : first.name) : `${group.length} companies`;
      button.textContent = label.length > 24 ? `${label.slice(0, 24)}…` : label;
      button.setAttribute("aria-label", `Show companies in ${first.type === 'MNC' ? countryName(first.country ?? '') : first.city ?? first.region ?? first.country ?? "this location"}`);
      button.addEventListener("click", () => setSelected(key));
      markers.push(new maplibregl.Marker({ element: button }).setLngLat(lngLat).addTo(map.current));
      bounds.extend(lngLat);
    }
    if (markers.length > 1) map.current.fitBounds(bounds, { padding: 65, maxZoom: companies.some(company => company.type === 'MNC') ? 5 : 11, duration: 0 });
    else if (markers.length === 1) {
      const onlyCompany = groups.values().next().value?.[0];
      map.current.jumpTo({ center: bounds.getCenter(), zoom: onlyCompany?.type === 'MNC' ? 4 : onlyCompany?.region && !onlyCompany.city ? 6 : 10 });
    }
    return () => markers.forEach(marker => marker.remove());
  }, [groups, companies]);

  const selectedCompanies = selected ? groups.get(selected) : undefined;

  return (
    <div>
      <div className="relative h-[440px] bg-gray-900 sm:h-[520px]" role="region" aria-label="Company map">
        <div ref={container} className="h-full w-full" />
        {mapError && <div className="absolute inset-x-4 top-4 rounded-xl bg-gray-950 p-4 text-sm text-white shadow-xl">The map could not load. <button className="underline" onClick={onShowList}>View the company list</button>.</div>}
        {groups.size === 0 && !mapError && <div className="absolute inset-x-4 top-4 rounded-xl bg-gray-950 p-4 text-sm text-white shadow-xl">No mapped companies match these filters. <button className="underline" onClick={onShowList}>View the list</button>.</div>}
        {selectedCompanies && (
          <div className="absolute bottom-4 left-4 right-4 z-10 max-h-[48%] overflow-y-auto rounded-2xl border border-gray-700 bg-gray-950 p-4 shadow-2xl sm:right-auto sm:w-[340px]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="font-medium text-white">{selectedCompanies[0].type === 'MNC' ? countryName(selectedCompanies[0].country ?? '') : [selectedCompanies[0].city, selectedCompanies[0].region, selectedCompanies[0].country ? countryName(selectedCompanies[0].country) : null].filter(Boolean).join(', ')}</h2>
              <button type="button" aria-label="Close company preview" onClick={() => setSelected(null)} className="px-2 text-xl text-gray-400 hover:text-white">×</button>
            </div>
            <div className="space-y-3">
              {selectedCompanies.map(company => <div key={`${company.id}-${company.locationId ?? 'primary'}`} className="border-t border-gray-800 pt-3 first:border-0 first:pt-0">
                <Link to={`/companies/${company.id}${company.locationId && (company.type === 'MNC' || company.locationCount && company.locationCount > 1) ? `?location=${company.locationId}` : ''}`} className="font-medium text-white hover:underline">{company.name}</Link>
                {company.domain && <p className="truncate text-xs text-gray-400">{company.domain}</p>}
                <p className="mt-1 text-xs text-gray-400">{company.locationCount && company.locationCount > 1 ? `${company.locationCount} ${company.type === 'MNC' ? 'countries' : 'locations'} · ` : ""}{company._count.vents} {company._count.vents === 1 ? "story" : "stories"}</p>
                <Link to={`/companies/${company.id}${company.locationId && (company.type === 'MNC' || company.locationCount && company.locationCount > 1) ? `?location=${company.locationId}` : ''}`} className="mt-2 inline-block text-sm text-blue-400 hover:underline">{company.type === 'MNC' ? 'View country stories →' : company.locationCount && company.locationCount > 1 ? 'View location stories →' : 'View stories →'}</Link>
              </div>)}
            </div>
          </div>
        )}
      </div>
      {unmapped.length > 0 && <div className="border-b border-gray-800 px-4 py-4 sm:px-5">
        <h2 className="mb-2 text-sm font-medium text-gray-200">Other companies</h2>
        <div className="space-y-2">{unmapped.map(company => <Link key={company.id} to={`/companies/${company.id}`} className="block text-sm text-gray-300 hover:text-white hover:underline">{company.name}{company.isRemote ? ` · Remote${company.country ? `, ${countryName(company.country)}` : ''}` : company.city || company.region ? ` · ${[company.city, company.region].filter(Boolean).join(', ')}` : ''}{company.domain ? ` · ${company.domain}` : company.description ? ` · ${company.description}` : ''}</Link>)}</div>
      </div>}
      <p className="px-4 py-3 text-xs text-gray-500 sm:px-5">Markers show city, region, or country centers, not office addresses.</p>
    </div>
  );
}
