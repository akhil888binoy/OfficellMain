import { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as maplibregl from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";

maplibregl.setWorkerUrl(workerUrl);

export type CompanyLocation = {
  city: string;
  country: string;
  label: string;
  mapLat: number;
  mapLng: number;
};

type Props = { value: CompanyLocation | null; onChange: (location: CompanyLocation) => void };

export function CompanyLocationPicker({ value, onChange }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const lookupId = useRef(0);
  const [styleUrl, setStyleUrl] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CompanyLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    axios.get(`${import.meta.env.VITE_API}/companies/map/config`, { withCredentials: true, signal: controller.signal })
      .then(({ data }) => {
        if (data.mapStyleUrl) setStyleUrl(data.mapStyleUrl);
        else setError("Map is unavailable right now.");
      })
      .catch(requestError => { if (!axios.isCancel(requestError)) setError("Map is unavailable right now."); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!styleUrl || !container.current) return;
    let instance: maplibregl.Map;
    try {
      instance = new maplibregl.Map({
        container: container.current,
        style: styleUrl,
        center: [0, 20],
        zoom: 1.5,
        attributionControl: false,
      });
    } catch {
      setError("Map is unavailable in this browser. Search for a city instead.");
      return;
    }
    map.current = instance;
    instance.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    instance.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    instance.on("error", () => setError("Map is unavailable right now."));
    instance.on("click", async event => {
      const currentLookup = ++lookupId.current;
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API}/companies/locations/reverse`, {
          params: { lat: event.lngLat.lat, lng: event.lngLat.lng }, withCredentials: true,
        });
        if (currentLookup === lookupId.current) {
          onChange(data.location);
          setResults([]);
        }
      } catch (requestError) {
        if (currentLookup === lookupId.current) setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || "Could not identify this city." : "Could not identify this city.");
      } finally {
        if (currentLookup === lookupId.current) setLoading(false);
      }
    });
    const activeLookup = lookupId;
    return () => { ++activeLookup.current; instance.remove(); map.current = null; };
  }, [styleUrl, onChange]);

  useEffect(() => {
    if (!map.current || !value) return;
    const lngLat: [number, number] = [value.mapLng, value.mapLat];
    const marker = new maplibregl.Marker({ color: "#111827" }).setLngLat(lngLat).addTo(map.current);
    map.current.flyTo({ center: lngLat, zoom: Math.max(map.current.getZoom(), 7), essential: true });
    return () => { marker.remove(); };
  }, [value, styleUrl]);

  const search = async (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim().length < 2) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API}/companies/locations/search`, {
        params: { q: query.trim() }, withCredentials: true,
      });
      setResults(data.locations);
      if (!data.locations.length) setError("No cities found. Try a different search.");
    } catch {
      setError("Could not search cities. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return <div className="space-y-3">
    <div>
      <label htmlFor="company-location-search" className="mb-2 block text-sm text-gray-300">Company location</label>
      <p className="mb-3 text-xs text-gray-400">Search for a city or click the map. Only the city center is shown publicly.</p>
      <form onSubmit={search} className="flex gap-2">
        <input id="company-location-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search city, e.g. Kochi" className="min-w-0 flex-1 rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white focus:border-gray-400 focus:outline-none" />
        <button type="submit" disabled={loading || query.trim().length < 2} className="rounded-xl bg-white px-4 text-sm font-medium text-gray-950 disabled:opacity-50">Search</button>
      </form>
    </div>
    {results.length > 0 && <div className="rounded-xl border border-gray-700 bg-gray-900 p-1" aria-label="City search results">
      {results.map((location, index) => <button key={`${location.label}-${index}`} type="button" onClick={() => { ++lookupId.current; onChange(location); setResults([]); setError(""); }} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-200 hover:bg-gray-800">{location.label}</button>)}
    </div>}
    <div className="relative h-[360px] overflow-hidden rounded-xl border border-gray-700 bg-gray-900 sm:h-[420px]" role="region" aria-label="Choose a company city on the map">
      <div ref={container} className="h-full w-full" />
      {!styleUrl && !error && <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">Loading map…</div>}
      {loading && <div className="absolute bottom-3 left-3 rounded-lg bg-gray-950 px-3 py-2 text-xs text-white shadow-lg">Finding city…</div>}
    </div>
    {value && <p className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white">Selected: {value.label}</p>}
    {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
  </div>;
}
