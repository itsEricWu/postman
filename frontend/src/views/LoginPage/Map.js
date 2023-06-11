import { Box } from "@mui/system";
import { Button, TextField } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

const Map = () => {
  //MAPS API
  const [center, setCenter] = useState({ lat: 40.425003, lng: -86.915833 });
  const [zoom, setZoom] = useState(15);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDHcel8Zif6__KnyYRvsxHCIELH4kCRTTA",
    libraries: ["places"],
  });
  const addressRef = useRef();
  const [map, setMap] = useState(null);

  const handleSearch = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: addressRef.current.value }, (results, status) => {
      if (status === "OK") {
        const position = results[0].geometry.location;
        setCenter({ lat: position.lat(), lng: position.lng() });
        setZoom(15);
      }
    });
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
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
      <Autocomplete>
        <TextField
          sx={{ width: "100%", marginBottom: 1 }}
          id="outlined-basic"
          label="Enter address you want to search for task..."
          variant="outlined"
          inputRef={addressRef}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          InputProps={{
            endAdornment: (
              <Button
                onClick={() => {
                  handleSearch();
                }}
                sx={{
                  width: 100,
                  height: 55,
                  mr: -2,
                  backgroundColor: "grey",
                  whiteSpace: "nowrap",
                  display: "block",
                  color: "black",
                  textTransform: "none",
                }}
              >
                Search
              </Button>
            ),
          }}
        />
      </Autocomplete>
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        // onLoad={(map) => {
        //   setMap(map);
        // }}
      >
        <MarkerF position={center} />
      </GoogleMap>
    </Box>
  );
}
export default Map;
