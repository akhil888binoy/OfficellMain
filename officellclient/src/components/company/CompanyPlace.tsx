import { useState } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import Select from 'react-select';

const customRender = (props) => {
  const {
    options,
    disabled,
    customProps,
    ...selectProps
  } = props;

  return (
    <Select
      {...selectProps}
      options={options}
      isDisabled={disabled}
      isSearchable={true}
      isClearable={true}
      value={customProps.reactSelectValue}
      onChange={customProps.onChange}   
    />
  );
};

type ReactSelectOption = {
  label: string;
  key:string;
  value: string;
};


const CompanyPlace = () => {
    const [country, setCountry] = useState<ReactSelectOption | null>(null);
    const [region, setRegion] = useState<ReactSelectOption | null>(null);

  return (
  <div className="space-y-5">
  <div>
    <h2 className="text-md font-light font-dmsans mb-2 tracking-[1px] text-gray-50">Country</h2>
    <CountryDropdown
      value={country?.value || ""}
      className="country"
      name="country-field"
      customRender={customRender}
      customProps={{
        reactSelectValue: country,
        classNamePrefix: "country-",
        onChange: (value) => {
          setCountry(value ? value : undefined)
          setRegion(null)
        },
      }}
    />
  </div>

  <div>
    <h2 className="text-md font-dmsans font-light tracking-[1px] mb-2 text-gray-50">City</h2>
    <RegionDropdown
      country={country?.value || ""}
      value={region?.value || ""}
      className="region"
      name="region-field"
      customRender={customRender}
      customProps={{
        reactSelectValue: region,
        classNamePrefix: "region-",
        onChange: (value) => {
          setRegion(value ? value : undefined)
          
        },
      }}
    />
  </div>
</div>

  )
}

export default CompanyPlace