import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

import usePlacesAutocomplete from "use-places-autocomplete";

interface searchInputInterface {
  placeholder: string;
  getValue: (val: string) => void;
}

const SearchInput = ({ getValue, placeholder }: searchInputInterface) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { data, status },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = (val: string) => {
    setValue(val);
    getValue(val);
    clearSuggestions();
  };

  return (
    <Combobox
      onSelect={(val) => {
        handleSelect(val);
      }}
    >
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="combobox-input"
        disabled={!ready}
        placeholder={placeholder}
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default SearchInput;
