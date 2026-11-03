import axios from 'axios';
import { lazy, Suspense, useCallback, useState } from 'react';
import type { Company } from '../../types/company';
import type { CompanyLocation } from './CompanyLocationPicker';
import { CountryPicker } from './CountryPicker';
import { countryName } from '../../utils/countryName';

const CompanyLocationPicker = lazy(() => import('./CompanyLocationPicker').then(module => ({ default: module.CompanyLocationPicker })));

type Props = { company: Company; onAdded: (company: Company) => void };

export function AddCompanyOffice({ company, onAdded }: Props) {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<CompanyLocation | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const onLocationChange = useCallback((selected: CompanyLocation) => { setLocation(selected); setError(''); }, []);
  const isMnc = company.type === 'MNC';

  const addOffice = async () => {
    if (isMnc ? !country : !location) { setError(isMnc ? 'Choose a country first.' : 'Choose a city first.'); return; }
    if (company.locations?.some(item => isMnc ? item.country === country : item.city?.toLocaleLowerCase() === location?.city.toLocaleLowerCase() && item.country.toLocaleLowerCase() === location?.country.toLocaleLowerCase())) {
      setError(isMnc ? 'This country is already listed.' : 'This office is already listed.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API}/companies/${company.id}/locations`, isMnc ? { country } : { city: location!.city, country: location!.country }, { withCredentials: true });
      onAdded(data.company);
      setLocation(null);
      setCountry(null);
      setOpen(false);
    } catch (requestError) {
      setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || 'Could not add this office.' : 'Could not add this office.');
    } finally {
      setSaving(false);
    }
  };

  return <section className="border-b border-gray-800 px-4 py-4 sm:px-5" aria-label={isMnc ? 'Add a company country' : 'Add a company office'}>
    <button type="button" onClick={() => { setOpen(value => !value); setError(''); }} aria-expanded={open} className="rounded-full border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:border-gray-500 hover:text-white">{open ? 'Cancel' : isMnc ? 'Add country' : 'Add office'}</button>
    {open && <div className="mt-4 space-y-4">
      <p className="text-sm text-gray-400">{isMnc ? `Add another country for ${company.name}. It will appear as a country on the map.` : `Add a missing office to ${company.name}. Only its city appears on the map.`}</p>
      {isMnc ? <><CountryPicker value={country} onChange={code => { setCountry(code); setError(''); }} label="Country" />{country && <p className="text-xs text-gray-400">Selected: {countryName(country)}</p>}</> : <Suspense fallback={<div className="text-sm text-gray-400">Loading location picker…</div>}>
        <CompanyLocationPicker value={location} onChange={onLocationChange} />
      </Suspense>}
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button type="button" onClick={addOffice} disabled={saving || (isMnc ? !country : !location)} className="rounded-full bg-white px-5 py-2 text-sm font-medium text-gray-950 disabled:opacity-50">{saving ? 'Adding…' : isMnc ? 'Add this country' : 'Add this office'}</button>
    </div>}
  </section>;
}
