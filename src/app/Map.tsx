// "use client";
//
// import React from "react";
// import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
//
// const containerStyle = {
//   width: "100%",
//   height: "400px"
// };
//
// const center = {
//   lat: 53.567664,
//   lng: -0.057698
// };
//
export default function Map() {
    return '';
//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
//   });
//
//   const [map, setMap] = React.useState(null);
//
//   const onLoad = React.useCallback(function callback(map) {
//     // This is just an example of getting and using the map instance!!! don't just blindly copy!
//     const bounds = new window.google.maps.LatLngBounds(center);
//     map.fitBounds(bounds);
//
//     setMap(map);
//   }, []);
//
//   const onUnmount = React.useCallback(function callback(map) {
//     setMap(null);
//   }, []);
//
//   return isLoaded ? (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={center}
//       zoom={10}
//       onLoad={onLoad}
//       onUnmount={onUnmount}
//     >
//       <Marker position={center} />
//       <></>
//     </GoogleMap>
//   ) : <></>;
}
//

