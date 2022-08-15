import React from 'react';
import {useJsApiLoader} from '@react-google-maps/api'
import Map from './components/Map';

function App() {
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ["places"],
  });

  if(!isLoaded) return <>Loading...</>
  return <Map />
}

export default App;
