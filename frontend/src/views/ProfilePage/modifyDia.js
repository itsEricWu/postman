import React from "react";
import { useState, useEffect, useRef } from "react";
import apis from "../../apis/user";
import { Box } from "@mui/material";
import "./taskposterpanel.css";
import emailjs from "@emailjs/browser";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  Autocomplete,
} from "@react-google-maps/api";

const ModifyDia = () => {
  const [taskName, setTaskName] = useState("");
  const [taskDscrpt, setTaskDscrpt] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [senderAddress1, setSenderAddress1] = useState("");
  const [senderTele, setSenderTele] = useState("");
  const [receiverTele, setReceiverTele] = useState("");
  const [receiverAddress1, setReceiverAddress1] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);

  const [centerSender, setCenterSender] = useState({
    lat: 40.425003,
    lng: -86.915833,
  });
  const [centerReceiver, setCenterReceiver] = useState({
    lat: 40.425003,
    lng: -86.915833,
  });
  const [zoomSender, setZoomSender] = useState(10);
  const [zoomReceiver, setZoomReceiver] = useState(10);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDHcel8Zif6__KnyYRvsxHCIELH4kCRTTA",
    libraries: ["places"],
  });
  const addressRefSender = useRef();
  const addressRefReceiver = useRef();

  const reset = () => {
    setTaskName("");
    setTaskDscrpt("");
    setSenderName("");
    setReceiverName("");
    setConfirmCode("");
    setSenderAddress1("");
    setReceiverAddress1("");
    setSenderTele("");
    setReceiverTele("");
  };

  async function sendemail() {
    let email = localStorage.getItem("userId");
    apis.FinduserByEmail({ email: email }).then((res) => {
      let emailVisibility = res[0].emailVisibility;
      if (emailVisibility === true) {
        console.log("emailVisibility is true" + res[0].nickname);
        const templateParams = {
          User_email: email,
          to_name: res[0].nickname,
          task_title: taskName,
          task_description: taskDscrpt,
          sender_address: addressRefSender.current.value,
          receiver_address: addressRefReceiver.current.value,
        };
        emailjs
          .send(
            "service_289kt24",
            "template_s1o1gqt",
            templateParams,
            "B5jGQN4gC8kDhnRqc"
          )
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
  }

  const handleSearchSender = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: addressRefSender.current.value },
      (results, status) => {
        if (status === "OK") {
          const position = results[0].geometry.location;
          console.log({ lat: position.lat(), lng: position.lng() });
          setCenterSender({ lat: position.lat(), lng: position.lng() });
          setZoomSender(15);
        }
      }
    );
  };

  const handleSearchReceiver = () => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: addressRefReceiver.current.value },
      (results, status) => {
        if (status === "OK") {
          const position = results[0].geometry.location;
          setCenterReceiver({ lat: position.lat(), lng: position.lng() });
          setZoomReceiver(15);
        }
      }
    );
  };

  // handle click for submit button, mock up for now
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      taskName &&
      taskDscrpt &&
      senderName &&
      confirmCode &&
      addressRefSender.current.value &&
      addressRefReceiver.current.value
    ) {
      setValid(true);
      //pop up a window to show success
      alert("Task posted successfully!");
      window.location.reload();
    }
    setSubmitted(true);
    console.log("handleSubmit", e);
    var senderCoords = [];
    var receiverCoords = [];
    senderCoords.push(centerSender.lat);
    senderCoords.push(centerSender.lng);
    receiverCoords.push(centerReceiver.lat);
    receiverCoords.push(centerReceiver.lng);
    console.log("senderCoords", senderCoords);
    console.log("receiverCoords", receiverCoords);
    const task = {
      title: taskName,
      description: taskDscrpt,
      location: {
        type: "Point",
        coordinates: senderCoords,
      },
      isTaken: false,
      senderInfo: {
        name: senderName,
        telephone: senderTele,
        address: senderCoords,
      },
      receiverInfo: {
        name: receiverName,
        telephone: receiverTele,
        address: receiverCoords,
      },
      senderAddress: addressRefSender.current.value,
      receiverAddress: addressRefReceiver.current.value,
      posterId: localStorage.getItem("userId"),
      takerId: "no-taker",
      timeRemaining: "10min",
      status: "not-taken",
      confirmCode: confirmCode,
    };
    console.log("task", task);
    apis
      .PostTask(task)
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  useEffect(() => {
    if (valid) {
      setTimeout(() => {
        setSubmitted(false);
        setValid(false);
        reset();
      }, 1000);
    }
  }, [valid]);

  //   const taskSchema = {
  //     title: '',
  //     description: '',
  //     location: { type: 'Point', coordinates: [1, 1] },
  //     isTaken: false,
  //     senderInfo: {},
  //     receiverInfo: {},
  //     posterId: localStorage.getItem('userId'),
  //     takerId: '',
  //     timeRemaining: '',
  //     status: '',
  //     confirmCode: ''
  //   };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 5,
        }}
      >
        <h2>SENDER'S INFO</h2>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "lightgrey",
            p: 5,
            borderRadius: 2,
            alignItems: "center",
            "& .MuiTextField-root": { m: 1, width: "40ch" },
          }}
        >
          <Box
            sx={{
              width: 350,
              height: 200,
              marginBottom: 2,
            }}
          >
            <GoogleMap
              center={centerSender}
              options={{
                disableDefaultUI: true,
              }}
              zoom={zoomSender}
              mapContainerStyle={{ width: "100%", height: "100%" }}
            >
              <MarkerF position={centerSender} />
            </GoogleMap>
          </Box>
          {submitted && valid ? (
            <div className="success-message">Successfully Posted!</div>
          ) : null}
          <Autocomplete>
            <TextField
              label="Please enter sender's address"
              variant="outlined"
              inputRef={addressRefSender}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => {
                      handleSearchSender();
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
                    SHOW
                  </Button>
                ),
              }}
            />
          </Autocomplete>
          {submitted && !addressRefSender.current.value ? (
            <div className="failed-message">
              Error: sender's address can't be empty
            </div>
          ) : null}
          <TextField
            id="outlined-basic"
            label="Please enter sender's name."
            variant="outlined"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
          {submitted && !senderName ? (
            <div className="failed-message">
              Error: task name can't be empty
            </div>
          ) : null}
          <TextField
            id="outlined-basic"
            label="Please enter sender's telephone."
            variant="outlined"
            value={senderTele}
            onChange={(e) => setSenderTele(e.target.value)}
          />
          {submitted && !receiverTele ? (
            <div className="failed-message">
              Error: sender's telephone cant be empty
            </div>
          ) : null}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 5,
          mb: 5,
        }}
      >
        <h2>RECEIVER'S INFO</h2>
        <Box
          component="form"
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "lightgrey",
            p: 2,
            borderRadius: 2,
            alignItems: "center",
            "& .MuiTextField-root": { m: 1, width: "40ch" },
          }}
        >
          <Box
            sx={{
              width: 350,
              height: 200,
              marginBottom: 2,
            }}
          >
            <GoogleMap
              center={centerReceiver}
              zoom={zoomReceiver}
              options={{
                disableDefaultUI: true,
              }}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              // onLoad={(map) => {
              //   setMap(map);
              // }}
            >
              <MarkerF position={centerReceiver} />
            </GoogleMap>
          </Box>
          {submitted && valid ? (
            <div className="success-message">Successfully Posted!</div>
          ) : null}
          <Autocomplete>
            <TextField
              label="Please enter receiver's address"
              variant="outlined"
              inputRef={addressRefReceiver}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => {
                      handleSearchReceiver();
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
                    SHOW
                  </Button>
                ),
              }}
            />
          </Autocomplete>

          {submitted && !addressRefReceiver.current.value ? (
            <div className="failed-message">
              Error: receiver's address can't be empty
            </div>
          ) : null}
          <TextField
            id="outlined-basic"
            label="Please enter a task name."
            variant="outlined"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          {submitted && !taskName ? (
            <div className="failed-message">
              Error: task name can't be empty
            </div>
          ) : null}
          <TextField
            id="outlined-basic"
            label="Please enter a task description."
            variant="outlined"
            value={taskDscrpt}
            onChange={(e) => setTaskDscrpt(e.target.value)}
          />
          {submitted && !taskDscrpt ? (
            <div className="failed-message">
              Error: task description can't be empty
            </div>
          ) : null}
          <TextField
            id="outlined-basic"
            label="Please enter a receiver's name."
            variant="outlined"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
          />
          {submitted && !receiverName ? (
            <div className="failed-message">
              Error: receiver's name can't be empty
            </div>
          ) : null}

          <TextField
            id="outlined-basic"
            label="Please enter your confirmation code"
            variant="outlined"
            value={confirmCode}
            onChange={(e) => setConfirmCode(e.target.value)}
          />
          {submitted && !confirmCode ? (
            <div className="failed-message">
              Error: confirmation code can't be empty!
            </div>
          ) : null}
          <TextField
            id="outlined-basic"
            label="Please enter receiver's telephone."
            variant="outlined"
            value={receiverTele}
            onChange={(e) => setReceiverTele(e.target.value)}
          />
          {submitted && !receiverTele ? (
            <div className="failed-message">
              Error: receiver's telephone can't be empty
            </div>
          ) : null}
          <Button
            onClick={handleSubmit}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            style={{ background: "#656268" }}
          >
            Post Task
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ModifyDia;
