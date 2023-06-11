import { Box } from "@mui/system";
import { Button, TextField } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";

let showed = false;
function Map(props) {
  console.log(props.start, props.end);
  //MAPS API
  const [center, setCenter] = useState({ lat: 40.425003, lng: -86.915833 });
  const [zoom, setZoom] = useState(10);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDHcel8Zif6__KnyYRvsxHCIELH4kCRTTA",
    libraries: ["places"],
  });
  const addressRef = useRef();
  const [map, setMap] = useState(null);

  const handleSearch = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: addressRef.current.value },
      (results, status) => {
        if (status === "OK") {
          const position = results[0].geometry.location;
          setCenter({ lat: position.lat(), lng: position.lng() });
          setZoom(15);
        }
      }
    );
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  async function calculateRoute() {
    var start = new window.google.maps.LatLng(props.start[0], props.start[1]);
    var end = new window.google.maps.LatLng(props.end[0], props.end[1]);
    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: start,
      destination: end,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    showed = true;
    // setDistance(results.routes[0].legs[0].distance.text);
    // setDuration(results.routes[0].legs[0].duration.text);
  }
  if (!showed) {
    calculateRoute();
  }
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        // onLoad={(map) => {
        //   setMap(map);
        // }}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
    </Box>
  );
}
export default Map;
