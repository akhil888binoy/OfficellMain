import { getData } from 'country-list';
import Select, { type StylesConfig } from 'react-select';
import { countryName } from '../../utils/countryName';

type Option = { value: string; label: string };
const options: Option[] = getData().map(({ code }) => ({ value: code, label: countryName(code) })).sort((a, b) => a.label.localeCompare(b.label));
const styles: StylesConfig<Option, false> = {
  control: (base, state) => ({ ...base, minHeight: 46, backgroundColor: '#111827', borderColor: state.isFocused ? '#9ca3af' : '#374151', boxShadow: 'none', borderRadius: 12, ':hover': { borderColor: '#9ca3af' } }),
  menu: base => ({ ...base, zIndex: 20, backgroundColor: '#111827', border: '1px solid #374151' }),
  option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#1f2937' : '#111827', color: '#f9fafb', cursor: 'pointer' }),
  singleValue: base => ({ ...base, color: '#f9fafb' }),
  input: base => ({ ...base, color: '#f9fafb' }),
  placeholder: base => ({ ...base, color: '#9ca3af' }),
};

export function CountryPicker({ value, onChange, label = 'Country', inputId = 'company-country-picker' }: { value: string | null; onChange: (code: string) => void; label?: string; inputId?: string }) {
  return <div>
    <label htmlFor={inputId} className="mb-2 block text-sm text-gray-300">{label}</label>
    <Select<Option, false>
      inputId={inputId}
      options={options}
      value={options.find(option => option.value === value) ?? null}
      onChange={option => { if (option) onChange(option.value); }}
      placeholder="Search for a country…"
      noOptionsMessage={() => 'No countries found'}
      styles={styles}
      isSearchable
    />
  </div>;
}
