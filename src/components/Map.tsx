import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  MarkerClusterer,
  OverlayView,
  Polyline,
  Circle,
} from "@react-google-maps/api";
import Actions from "./Actions";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;
type newLoationAlertType = google.maps.LatLng;

type viewsInterface =
  | "default"
  | "radiusCheck"
  | "moveAnimation"
  | "goToLocation";

const Map = () => {
  const [locationFromTo, setLocationFromTo] = useState([]);
  const [locToPanTo, setLocToPanTo] = useState<LatLngLiteral>();
  const [circleInfo, setCircleInfo] = useState<any>();
  const [currView, setCurrView] = useState<viewsInterface>("default");

  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(() => ({ lat: 43, lng: -80 }), []);
  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);

  return (
    <div className="container">
      <div className="controls">
        {currView === "default" && (
          <>
            <h1>Hello! select an action :)</h1>
            <ul className="nav">
              <li
                className="navItem"
                onClick={() => setCurrView("radiusCheck")}
              >
                See radius of an area
              </li>
              <li
                className="navItem"
                onClick={() => setCurrView("moveAnimation")}
              >
                Find distace between two locations and try uber-like animation
              </li>
              <li
                className="navItem"
                onClick={() => setCurrView("goToLocation")}
              >
                Search and pinpoint a location
              </li>
            </ul>
          </>
        )}
        {currView === "radiusCheck" && (
          <>
            <div className="backNavItem" onClick={() => setCurrView("default")}>
              Go back
            </div>
            <h1>Find location and enter area radius</h1>
          </>
        )}
        {currView === "moveAnimation" && (
          <>
            <div className="backNavItem" onClick={() => setCurrView("default")}>
              Go back
            </div>
            <h1>Enter start and stop locations!</h1>
          </>
        )}
        {currView === "goToLocation" && (
          <>
            <div className="backNavItem" onClick={() => setCurrView("default")}>
              Go back
            </div>
            <h1>Find and select go-to locaton.</h1>
          </>
        )}
        {/* <Actions
          setCircleInfo={() => {}}
          setLocFromTo={() => {}}
          setLocPanTo={() => {}}
        /> */}
      </div>
      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        ></GoogleMap>
      </div>
    </div>
  );
};

export default Map;
