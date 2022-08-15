import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

interface ActionInterface {
  setLocFromTo: ([{}]: google.maps.LatLngLiteral[]) => void;
  setLocPanTo: ({}: google.maps.LatLngLiteral) => void;
  setCircleInfo: ({}: google.maps.LatLngLiteral) => void;
}
const Actions = ({
  setCircleInfo,
  setLocFromTo,
  setLocPanTo,
}: ActionInterface) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { data, status },
    clearSuggestions,
  } = usePlacesAutocomplete();

  return (
    <Combobox onSelect={() => {}}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="combobox-input"
        disabled={!ready}
        placeholder="Search an address"
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

export default Actions;
