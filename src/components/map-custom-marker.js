import React from 'react';
import GoogleMapReact from 'google-map-react';
import { shallowEqual, useSelector } from 'react-redux';
import { MAP_API_KEY } from '../configs/app-global';

export default function MapCustomMarker({ center, handleLoadMap, children }) {
  const { google_map_key } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual,
  );

  return (
    <GoogleMapReact
      bootstrapURLKeys={{
        key: google_map_key || MAP_API_KEY,
      }}
      defaultZoom={12}
      defaultCenter={center}
      options={{
        fullscreenControl: false,
      }}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={({ map, maps }) => handleLoadMap(map, maps)}
    >
      {children}
    </GoogleMapReact>
  );
}
