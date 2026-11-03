import axios from 'axios';
import { useEffect, useState } from 'react';
import { RegionDropdown } from 'react-country-region-selector';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CountryPicker } from './CountryPicker';
import { countryName } from '../../utils/countryName';
import type { Company } from '../../types/company';
import { categories } from '../../utils/companyCategory';

const API = import.meta.env.VITE_API;

function validPublicUrl(value: string) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.');
  } catch {
    return false;
  }
}

export default function CompanyRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [companyType, setCompanyType] = useState<'LOCAL' | 'MNC'>('LOCAL');
  const [country, setCountry] = useState<string | null>(null);
  const [region, setRegion] = useState('');
  const [industry, setIndustry] = useState('');
  const [identityKind, setIdentityKind] = useState<'link' | 'description'>('link');
  const [publicUrl, setPublicUrl] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [matches, setMatches] = useState<Company[]>([]);
  const [existingCompanyId, setExistingCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (name.trim().length < 3) { setMatches([]); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const { data } = await axios.get(`${API}/companies`, { params: { company_name: name.trim() }, withCredentials: true, signal: controller.signal });
        setMatches((data.companies ?? []).slice(0, 5));
      } catch (requestError) {
        if (!axios.isCancel(requestError)) setMatches([]);
      }
    }, 350);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [name]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setExistingCompanyId(null);
    const cleanName = name.trim();
    const cleanUrl = publicUrl.trim();
    const cleanDescription = description.trim();
    if (cleanName.length < 2 || cleanName.length > 100) { setError('Enter a company name of 2–100 characters.'); return; }
    if (!country) { setError('Choose a country.'); return; }
    if (companyType === 'LOCAL' && !region) { setError('Choose a region or state.'); return; }
    if (!industry) { setError('Choose an industry.'); return; }
    if (identityKind === 'link' && !validPublicUrl(cleanUrl)) { setError('Add a valid public website, LinkedIn, or registry link.'); return; }
    if (identityKind === 'description' && (cleanDescription.length < 20 || cleanDescription.length > 180)) { setError('Describe what the company does in 20–180 characters.'); return; }
    setSaving(true);
    try {
      const { data } = await axios.post(`${API}/companies`, {
        name: cleanName,
        type: companyType,
        ...(companyType === 'MNC' ? { locations: [{ country }] } : { country, region }),
        industry,
        ...(identityKind === 'link' ? { domain: cleanUrl } : { description: cleanDescription }),
      }, { withCredentials: true });
      toast.success('Company added. You can now post about it.');
      navigate(`/companies/${data.company.id}`);
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 409) {
        const existing = requestError.response.data?.company;
        if (existing?.id) setExistingCompanyId(String(existing.id));
        setError('A company with these details may already exist. Check its profile.');
      } else {
        setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || 'Could not add the company.' : 'Could not add the company.');
      }
    } finally {
      setSaving(false);
    }
  };

  return <div>
    <form onSubmit={submit} className="space-y-6 px-4 py-6 sm:px-5">
      <div>
        <label htmlFor="company-name" className="mb-2 block text-sm text-gray-300">Company name</label>
        <input id="company-name" value={name} onChange={event => { setName(event.target.value); setError(''); setExistingCompanyId(null); }} maxLength={100} required placeholder="The name people know" className="block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white focus:border-gray-400 focus:outline-none" />
        {matches.length > 0 && <div className="mt-3 rounded-xl border border-gray-700 bg-gray-900 p-3" aria-label="Possible matching companies">
          <p className="mb-2 text-xs font-medium text-gray-300">Is your company already here?</p>
          <div className="space-y-1">{matches.map(company => <Link key={company.id} to={`/companies/${company.id}`} className="block rounded-lg px-2 py-2 text-sm text-gray-200 hover:bg-gray-800">
            <span className="font-medium">{company.name}</span>
            <span className="ml-2 text-xs text-gray-400">{company.type === 'MNC' ? `MNC · ${company._count?.locations ?? company.locations?.length ?? 0} ${(company._count?.locations ?? company.locations?.length ?? 0) === 1 ? 'country' : 'countries'}` : [company.isRemote ? 'Remote' : company.city, company.region, company.country ? countryName(company.country) : null].filter(Boolean).join(', ')}{company.domain ? ` · ${company.domain.replace(/^https?:\/\//, '')}` : ''}</span>
          </Link>)}</div>
        </div>}
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-gray-200">Company reach</legend>
        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
          <label className="flex items-center gap-2"><input type="radio" name="company-type" checked={companyType === 'LOCAL'} onChange={() => setCompanyType('LOCAL')} />One country</label>
          <label className="flex items-center gap-2"><input type="radio" name="company-type" checked={companyType === 'MNC'} onChange={() => setCompanyType('MNC')} />Multiple countries (MNC)</label>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-gray-200">Location</legend>
        <CountryPicker value={country} onChange={code => { setCountry(code); setRegion(''); }} label={companyType === 'MNC' ? 'First country' : 'Country'} />
        {companyType === 'LOCAL' && <div>
          <label htmlFor="company-region" className="mb-2 block text-sm text-gray-300">Region or state</label>
          <RegionDropdown id="company-region" country={country ?? ''} countryValueType="short" value={region} onChange={setRegion} disabled={!country} defaultOptionLabel="Choose a region or state" className="block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white focus:border-gray-400 focus:outline-none disabled:opacity-50" />
        </div>}
        {companyType === 'MNC' && <p className="text-xs text-gray-500">Start with one country. Anyone can add more countries from the company page.</p>}
      </fieldset>

      <div>
        <label htmlFor="company-industry" className="mb-2 block text-sm text-gray-300">Industry</label>
        <select id="company-industry" value={industry} onChange={event => setIndustry(event.target.value)} required className="block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white focus:border-gray-400 focus:outline-none">
          <option value="">Choose an industry</option>
          {categories.filter(item => item.name !== 'Startups' && item.name !== 'MNCs').map(item => <option key={item.name} value={item.name}>{item.name.trim()}</option>)}
        </select>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-gray-200">Help others recognize this company</legend>
        <div className="flex flex-wrap gap-4 text-sm text-gray-300">
          <label className="flex items-center gap-2"><input type="radio" name="identity-kind" checked={identityKind === 'link'} onChange={() => setIdentityKind('link')} />Public link</label>
          <label className="flex items-center gap-2"><input type="radio" name="identity-kind" checked={identityKind === 'description'} onChange={() => setIdentityKind('description')} />No public link</label>
        </div>
        {identityKind === 'link' ? <div><label htmlFor="company-public-link" className="mb-2 block text-sm text-gray-300">Website, company LinkedIn, or registry link</label><input id="company-public-link" type="url" value={publicUrl} onChange={event => setPublicUrl(event.target.value)} placeholder="https://example.com" className="block w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white focus:border-gray-400 focus:outline-none" /><p className="mt-1 text-xs text-gray-500">A company website may provide a logo automatically.</p></div>
          : <div><label htmlFor="company-description" className="mb-2 block text-sm text-gray-300">What does this company do?</label><textarea id="company-description" value={description} onChange={event => setDescription(event.target.value)} maxLength={180} rows={3} placeholder="A short, neutral description to distinguish it from similarly named companies" className="block w-full resize-y rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white focus:border-gray-400 focus:outline-none" /><p className="mt-1 text-xs text-gray-500">No opinions or employee names. {description.trim().length}/180 characters</p></div>}
      </fieldset>

      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      {existingCompanyId && <Link to={`/companies/${existingCompanyId}`} className="inline-flex rounded-full border border-gray-600 px-5 py-2.5 text-sm font-medium text-white hover:border-white">Open existing company</Link>}
      <div><button type="submit" disabled={saving} className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-950 transition-colors hover:bg-gray-200 disabled:opacity-50">{saving ? 'Adding…' : 'Add company'}</button></div>
    </form>
  </div>;
}
