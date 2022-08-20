import { useState } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import SearchInput from "./SearchInput";

interface ActionInterface {
  setLocFromTo: ([{ lat, lng }]: google.maps.LatLngLiteral[]) => void;
  setLocPanTo: ({ lat, lng }: google.maps.LatLngLiteral) => void;
  setCircleInfo: ({ lat, lng }: google.maps.LatLngLiteral) => void;
  currView: "default" | "radiusCheck" | "moveAnimation" | "goToLocation";
}

const Actions = ({
  setCircleInfo,
  setLocFromTo,
  setLocPanTo,
  currView,
}: ActionInterface) => {
  const [startLocation, setStartLocation] = useState("");
  const [stopLocation, setStopLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const displayError = (err: any) => {
    setError(err);
    setTimeout(() => {
      setError("");
    }, 1500);
  };

  const radiusCheck = async (val: string) => {
    try {
      setLoading(true);
      const results = await getGeocode({ address: val });
      const { lat, lng } = await getLatLng(results[0]);
      setCircleInfo({ lat, lng });
    } catch (err) {
      displayError(err);
    } finally {
      setLoading(false);
    }
  };

  const moveAnimation = async () => {
    try {
      setLoading(true);
      if (!stopLocation.length && !startLocation.length) {
        displayError("You Need to Select start and stop Location !");
      } else {
        const results1 = await getGeocode({ address: startLocation });
        const { lat: lat1, lng: lng1 } = await getLatLng(results1[0]);
        const results2 = await getGeocode({ address: stopLocation });
        const { lat: lat2, lng: lng2 } = await getLatLng(results2[0]);

        // console.log(
        //   "inside",
        //   { lat: lat1, lng: lng1 },
        //   { lat: lat2, lng: lng2 }
        // );
        setLocFromTo([
          { lat: lat1, lng: lng1 },
          { lat: lat2, lng: lng2 },
        ]);
      }
    } catch (err) {
      displayError(err);
    } finally {
      setLoading(false);
    }
  };

  const pinpointing = async (val: string) => {
    try {
      setLoading(true);
      const results = await getGeocode({ address: val });
      const { lat, lng } = await getLatLng(results[0]);
      setLocPanTo({ lat, lng });
    } catch (err) {
      displayError(err);
    } finally {
      setLoading(false);
    }
  };

  return currView === "radiusCheck" ? (
    // radius
    <div className="column">
      <SearchInput
        placeholder={`Search for origin location`}
        getValue={(val) => radiusCheck(val)}
      />
      {error && <div className="error">{error}</div>}
    </div>
  ) : currView === "moveAnimation" ? (
    // distance
    <div className="column">
      <SearchInput
        placeholder={`Enter start location`}
        getValue={(val) => setStartLocation(val)}
      />
      <SearchInput
        placeholder={`Enter stop location`}
        getValue={(val) => setStopLocation(val)}
      />
      {error && <div className="error">{error}</div>}
      <div className="btn" onClick={() => moveAnimation()}>
        {loading ? `Loading...` : `Start Moving`}
      </div>
    </div>
  ) : (
    // pinpointing
    <div className="column">
      <SearchInput
        placeholder={`Search and pinpoint location`}
        getValue={(val) => pinpointing(val)}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default Actions;
