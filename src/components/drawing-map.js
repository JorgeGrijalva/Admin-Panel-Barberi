import {
  GoogleApiWrapper,
  Map,
  Marker,
  Polygon,
  Polyline,
} from 'google-maps-react';
import React from 'react';
import { useState, useEffect } from 'react';
import { MAP_API_KEY } from '../configs/app-global';
import { BiCurrentLocation } from 'react-icons/bi';

const DrawingManager = (props) => {
  const [center, setCenter] = useState({
    lat: 38.58799374569842,
    lng: -98.47949767583457,
  });
  const [polygon, setPolygon] = useState(
    props.triangleCoords ? props.triangleCoords : []
  );
  const [finish, setFinish] = useState(props.triangleCoords ? true : false);
  const [focus, setFocus] = useState(null);
  props.setMerge(finish);

  const onClick = (t, map, coord) => {
    setFocus(false);
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (finish) {
      setPolygon([]);
      props.settriangleCoords([{ lat, lng }]);
      setCenter({ lat, lng });
      setFinish(false);
    } else {
      props.settriangleCoords((prev) => [...prev, { lat, lng }]);
    }
  };

  const onFinish = (e) => {
    setFinish(props.triangleCoords ? true : false);
    if (
      props.triangleCoords[0]?.lat === e.position?.lat &&
      props.triangleCoords.length > 1
    ) {
      setPolygon(props.triangleCoords);
      props.setLocation(props.triangleCoords);
      setFinish(true);
      setFocus(true);
    }
  };

  const currentLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  useEffect(() => {
    setFocus(true);
  }, []);

  function handleMapReady(_, map) {
    map.setOptions({
      draggableCursor: 'crosshair',
      draggingCursor: 'grab',
    });
  }

  const markers = props.triangleCoords.map((item) => ({
    lat: Number(item.lat || '0'),
    lng: Number(item.lng || '0'),
  }));
  // eslint-disable-next-line no-undef
  var bounds = new props.google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    bounds.extend(markers[i]);
  }

  const OPTIONS = {
    minZoom: 15,
    maxZoom: 15,
  };

  return (
    <div className='map-container' style={{ height: 500, width: '100%' }}>
      <button
        className='map-button'
        type='button'
        onClick={() => {
          currentLocation();
        }}
      >
        <BiCurrentLocation />
      </button>
      <Map
        options={OPTIONS}
        cursor={'pointer'}
        onClick={onClick}
        maxZoom={16}
        minZoom={2}
        google={props.google}
        initialCenter={center}
        center={center}
        onReady={handleMapReady}
        bounds={focus && bounds}
        className='clickable'
      >
        {props.triangleCoords?.map((item, idx) => (
          <Marker
            onClick={(e) => onFinish(e)}
            key={idx}
            position={item}
            icon={{
              url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Circle-image.svg',
              scaledSize: new props.google.maps.Size(10, 10),
            }}
            className='marker'
          />
        ))}

        {!polygon?.length ? (
          <Polyline
            key={props.triangleCoords?.length}
            path={props.triangleCoords}
            strokeColor='black'
            strokeOpacity={0.8}
            strokeWeight={3}
            fillColor='black'
            fillOpacity={0.35}
          />
        ) : (
          <Polygon
            key={polygon?.length}
            path={props.triangleCoords}
            strokeColor='black'
            strokeOpacity={0.8}
            strokeWeight={3}
            fillColor='black'
            fillOpacity={0.35}
          />
        )}
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: MAP_API_KEY,
  libraries: ['places'],
})(DrawingManager);
