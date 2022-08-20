import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  Polyline,
  Circle,
} from "@react-google-maps/api";
import Actions from "./Actions";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

type viewsInterface =
  | "default"
  | "radiusCheck"
  | "moveAnimation"
  | "goToLocation";

const Map = () => {
  const [locToPanTo, setLocToPanTo] = useState<any | LatLngLiteral>({});
  const [circleInfo, setCircleInfo] = useState<any | LatLngLiteral>({});
  const [currView, setCurrView] = useState<viewsInterface>("default");
  const [zoomLevel, setZoomLevel] = useState(10);
  const [polyPath, setPolyPath] = useState<any[]>([]);
  const [direction, setDirection] = useState<any>(null);
  const [polyLineIconOffset, setPolyLineIconOffset] = useState("");
  const [needPolyline, setNeedPolylline] = useState(false);

  // TODO: move loading, error here. radius field for radius feat

  const mapRef = useRef<GoogleMap>();
  const PolyRef = useRef<Polyline>();
  const center = useMemo<LatLngLiteral>(() => ({ lat: 43, lng: -80 }), []);
  const options = useMemo<MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const lineSymbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    strokeColor: "#393",
  };

  const onLoad = useCallback((map: any) => (mapRef.current = map), []);
  const onPolyLoad = useCallback((polyline: any) => {
    PolyRef.current = polyline;
  }, []);

  let animationInterval: any;

  const doMapAnimation = async (i: LatLngLiteral[]) => {
    console.log("wee", i[0], i[1]);
    const directionsService = new google.maps.DirectionsService();
    try {
      const results = await directionsService.route({
        origin: i[0],
        destination: i[1],
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirection(results);
      const p = results?.routes[0].overview_path?.map((p) => {
        return { lat: p.lat(), lng: p.lng() };
      });
      setPolyPath(p);
      setNeedPolylline(true);
      let count = 0;
      animationInterval = setInterval(() => {
        if (count < 198) {
          count = (count + 1) % 200;
        } else {
          clearInterval(animationInterval);
          setNeedPolylline(false);
        }
        setPolyLineIconOffset(`${count / 2}%`);
        console.log("offset", count);
      }, 500);
    } catch (err: any) {
      console.log("err", err?.message);
    }
  };

  const doSetLocToPanTo = (i: LatLngLiteral) => {
    setLocToPanTo(i);
    mapRef.current?.panTo(i);
  };

  const doSetCircle = (i: LatLngLiteral) => {
    setCircleInfo(i);
    setZoomLevel(12);
    mapRef.current?.panTo(i);
  };

  const circleOptions = {
    strokeOpacity: 0.85,
    strokeWeight: 2,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    zIndex: 3,
    fillOpacity: 0.3,
    strokeColor: "#8BC34A",
    fillColor: "#000",
  };

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
        {currView !== "default" && (
          <Actions
            currView={currView}
            setCircleInfo={(i) => {
              doSetCircle(i);
            }}
            setLocFromTo={(i) => {
              doMapAnimation(i);
            }}
            setLocPanTo={(i) => {
              doSetLocToPanTo(i);
            }}
          />
        )}
      </div>
      <div className="map">
        <GoogleMap
          zoom={zoomLevel}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {Object.keys?.(locToPanTo)?.length && (
            <Marker position={locToPanTo} />
          )}
          {Object.keys?.(circleInfo)?.length && (
            <Circle
              center={{
                lat: -1 * circleInfo?.lat,
                lng:
                  -Math.sign(circleInfo?.lng) *
                  Math.abs((Math.abs(circleInfo?.lng) - 180) % 180),
              }}
              radius={20037508.34 - 10000}
              options={{ radius: 20037508.34 - 10000, ...circleOptions }}
            />
          )}
          {needPolyline && (
            <Polyline
              onLoad={onPolyLoad}
              options={{
                path: polyPath,
                icons: [{ icon: lineSymbol, offset: polyLineIconOffset }],
                strokeColor: "transparent",
              }}
            />
          )}
          {needPolyline && <DirectionsRenderer directions={direction} />}
        </GoogleMap>
      </div>
    </div>
  );
};

export default Map;
