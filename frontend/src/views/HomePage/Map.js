import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/system';
import { Button, TextField } from '@mui/material';
import { useRef, useEffect, useState } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Marker,
  Autocomplete,
  DirectionsRenderer
} from '@react-google-maps/api';
import emailjs from '@emailjs/browser';

import apis from '../../apis/user';
const Markers = (props) => {
  // return the markers from the mapped array
  return props.taskList.map((task, index) => {
    // TODO: adjust the coordinates later
    if (
      task.isTaken === false &&
      task.posterId !== localStorage.getItem('userId') &&
      task.status !== 'completed'
    ) {
      return (
        <Marker
          key={index}
          position={{
            lat: task.location.coordinates[0],
            lng: task.location.coordinates[1]
          }}
          onClick={() => props.onMarkerClick(index)}
        />
      );
    }
  });
};

const Map = (props) => {
  const navigate = useNavigate();
  //MAPS API
  const [center, setCenter] = useState({ lat: 40.425003, lng: -86.915833 });
  const [zoom, setZoom] = useState(10);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDHcel8Zif6__KnyYRvsxHCIELH4kCRTTA',
    libraries: ['places']
  });
  const addressRef = useRef();
  const [map, setMap] = useState(null);

  const handleSearch = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: addressRef.current.value }, (results, status) => {
      if (status === 'OK') {
        const position = results[0].geometry.location;
        setCenter({ lat: position.lat(), lng: position.lng() });
        setZoom(15);
      }
    });
  };

  // substitute with real data
  const mockupMarkers = [
    {
      lat: 48,
      lng: 2
    },
    {
      lat: 48.5,
      lng: 2.5
    },
    {
      lat: 49,
      lng: 3
    }
  ];

  const sendemail = (input) => {
    let email = localStorage.getItem('userId');
    apis.FinduserByEmail({ email }).then((res) => {
      let nickname = res[0].nickname;
      let bio = res[0].bio;
      let phone = res[0].phoneNumber;
      let emailVisibility = res[0].emailVisibility;
      if (emailVisibility === true) {
        const templateParams = {
          to_name: input.senderInfo.name,
          id: input.title,
          nickname: nickname,
          bio: bio,
          phone: phone,
          User_email: input.posterId
        };
        emailjs
          .send('service_wvvskxm', 'template_gvukolw', templateParams, '6TQG4qyO0kxVbL4GQ')
          .then(
            (result) => {
              console.log(result.text);
            },
            (error) => {
              console.log(error.text);
            }
          );
      }
    });
  };

  const handleMarkerClick = (index) => {
    console.log(index);
    console.log(props.taskList[index]);
    // click the marker to take task
    const taskInfo = props.taskList[index];
    // check if the task is taken
    if (taskInfo.isTaken === true) {
      console.log('task is taken');
      return;
    }
    // set the task taken
    taskInfo.isTaken = true;
    taskInfo.takerId = localStorage.getItem('userId');
    taskInfo.status = 'taken';
    // update the status in the database
    apis.UpdateTask(taskInfo._id, taskInfo).then((res) => {
      console.log('res', res);
      sendemail(res);
    });

    props.setTaskTaken((taskTaken) => [...taskTaken, taskInfo]);
    // redirect to task progress page
    console.log(taskInfo);
    navigate({
      pathname: '/task-progress',
      search: `?taskId=${taskInfo._id}`
    });
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
      <Autocomplete>
        <TextField
          sx={{ width: '100%', marginBottom: 1 }}
          id="outlined-basic"
          label="Enter address you want to search for task..."
          variant="outlined"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          inputRef={addressRef}
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
                  backgroundColor: 'grey',
                  whiteSpace: 'nowrap',
                  display: 'block',
                  color: 'black',
                  textTransform: 'none'
                }}>
                Search
              </Button>
            )
          }}
        />
      </Autocomplete>
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerStyle={{ width: '100%', height: '100%' }}
        // onLoad={(map) => {
        //   setMap(map);
        // }}
      >
        {/* <MarkerF position={center} /> */}
        <Markers taskList={props.taskList} onMarkerClick={handleMarkerClick} />
      </GoogleMap>
    </Box>
  );
};
export default Map;
