import React, { useEffect } from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";

import Box from "@mui/material/Box";
import ResponsiveAppBar from "../TopBar/TopBar";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Navigate } from "react-router-dom";
import apis from "../../apis/user";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  getAuth,
  sendPasswordResetEmail,
  deleteUser,
  updateEmail,
  updateProfile,
  updatePhoneNumber,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
} from "firebase/auth";
import { Avatar } from "@mui/material";
import { setImage } from "../../stores/chat";
import { useDispatch } from "react-redux";
import TaskPosted from "./taskPosted";
export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const email = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [tempname, setTempName] = useState(name);
  const [update, setUpdate] = useState(false);
  const [bio, setBio] = useState("");
  const [tempbio, setTempBio] = useState(bio);
  const [updateBio, setUpdateBio] = useState(false);
  const [alignment, setAlignment] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [open2, setDelete] = React.useState(false);
  const [emailChange, setEmailChange] = React.useState(false);
  const [Phoneopen, setPhoneopen] = React.useState(false);
  const [newPhone, setNewPhone] = React.useState("");
  const [newemail, setEmail] = React.useState("");
  const [rating, setRating] = useState(5);
  const [taskList, setTaskList] = useState([]);
  const [fetchTask, setFetchTask] = useState(false);
  useEffect(() => {
    if (email !== "") {
      apis.FinduserByEmail({ email }).then((res) => {
        setTimeout(() => {}, 1000);
        setName(res[0].nickname);
        setBio(res[0].bio);
        setAlignment(res[0].visibility);
        setImageURL(res[0].ImageUrl);
        setRating(res[0].rating);
        setEmailAlignment(res[0].emailVisibility);
      });
    }
  }, [email]);
  const updateProfilePhoneNumber = () => {
    const auth = getAuth();
    //country code plus your phone number excluding leading 0 if exists.
    //you could provide a prompt/modal or other field in your UX to replace this phone number.

    // let phoneNumber = "+441234567890"; //testing number, ideally you should set this in your firebase auth settings
    // var verificationCode = "123456";

    // Turn off phone auth app verification.
    // firebase.auth().settings.appVerificationDisabledForTesting = true;

    // This will render a fake reCAPTCHA as appVerificationDisabledForTesting is true.
    // This will resolve after rendering without app verification.
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "reCap",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
        },
        auth
      );
    }
    let phone_number = "+1" + newPhone;
    signInWithPhoneNumber(auth, phone_number, window.recaptchaVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        console.log(error.message);
      })
      .then(() => {
        let verificationCode = window.prompt(
          "Please enter the verification " +
            "code that was sent to your mobile device."
        );
        if (verificationCode) {
          window.confirmationResult
            .confirm(verificationCode)
            .then((result) => {
              // User signed in successfully.
              // ...
            })
            .catch((error) => {
              // User couldn't sign in (bad verification code?)
              // ...
            });
          const payload = {
            email: localStorage.getItem("userId"),
            phoneNumber: newPhone,
          };
          apis.UpdatephoneNumber(payload).then((res) => {
            alert("Your Phone Number has been Changed");
            handlephoneClose();
          });
          localStorage.clear();
          navigate("/");
          window.location.reload();
        }
      });
  };
  const handleEmailChange = () => {
    setEmailChange(true);
  };
  if (!fetchTask) {
    setFetchTask(true);
    apis.GetTaskList().then((list) => {
      setTaskList(list);
    });
  }
  const handleEmailClose = () => {
    setEmailChange(false);
  };
  const handlePhoneopen = () => {
    setPhoneopen(true);
  };
  const [emailAlignment, setEmailAlignment] = React.useState(true);

  const handlephoneClose = () => {
    setPhoneopen(false);
  };
  const handlePhoneChange = () => {
    console.log(newPhone);
    updateProfilePhoneNumber();
  };
  const handleAlignment = async (event, newAlignment) => {
    if (newAlignment === null) {
      return;
    }
    const payload = {
      email: email,
      visibility: newAlignment,
    };
    console.log(newAlignment);
    apis.UpdateUserVisibility(payload).then((res) => {
      setAlignment(newAlignment);
      console.log(res);
    });
  };
  const handleEmailAlignment = async (event, newAlignment) => {
    setEmailAlignment(newAlignment);
    const payload = {
      email: localStorage.getItem("userId"),
      emailVisibility: newAlignment,
    };
    apis.UpdateUserEmailVisibility(payload);
  };

  if (!localStorage.getItem("authenticated")) {
    return <Navigate to="/" replace={true} />;
  } else {
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClickDelete = () => {
      setDelete(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    const handleCloseDelete = () => {
      setDelete(false);
    };
    const handlechangeEmail = () => {
      const auth = getAuth();
      const payload = {
        email: localStorage.getItem("userId"),
        Newemail: newemail,
      };
      apis.UpdateEmail(payload).then((res) => {
        setEmail(newemail);
      });
      updateEmail(auth.currentUser, newemail)
        .then(() => {
          // Email updated!
          // ...
          alert("Your Email has been Changed");
          setEmailChange(false);
          localStorage.clear();
          navigate("/");
        })
        .catch((error) => {
          // An error occurred
          // ...
          console.log(error.message);
        });
    };
    const handlereset = (event) => {
      const auth = getAuth();
      sendPasswordResetEmail(auth, email)
        .then(() => {
          // Password reset email sent!
          // ..
          alert("A reset email have been sent to your email");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    };
    const handledelete = (event) => {
      const auth = getAuth();
      const user = auth.currentUser;
      const payload = {
        email: localStorage.getItem("userId"),
      };
      apis.deleteUserByEmail(payload).then((res) => {
        console.log(res);
      });

      deleteUser(user)
        .then(() => {
          // User deleted.
        })
        .catch((error) => {
          // An error ocurred
          // ...
        });
      alert("Your account has been deleted");
      setDelete(false);
      localStorage.clear();
      navigate("/");
    };
    const handleChange = () => {
      handlereset();
      setOpen(false);
      localStorage.clear();
      navigate("/");
    };
    const updateUsername = () => {
      if (!update) {
        setUpdate(true);
        setTempName(name);
      } else {
        setUpdate(false);

        const payload = {
          email: localStorage.getItem("userId"),
          nickname: tempname,
        };
        console.log(payload);
        apis.UpdateUserNickname(payload).then((res) => {
          setName(tempname);
        });
      }
    };
    const updateUserbio = () => {
      if (!updateBio) {
        setUpdateBio(true);
        setTempBio(bio);
      } else {
        setUpdateBio(false);
        setBio(tempbio);
        const payload = {
          email: localStorage.getItem("userId"),
          bio: tempbio,
        };
        console.log(payload);
        apis.UpdateUserBio(payload);
      }
    };
    const fileselectedHandler = (event) => {
      const file = event.target.files[0];
      let overSize = false;
      if (file.size > 1024 * 512) {
        overSize = true;
      }
      if (overSize) {
        alert("Image size should not exceed 512KB");
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const payload = {
            email: localStorage.getItem("userId"),
            ImageUrl: reader.result.toString(),
          };
          apis
            .UpdateUserImageUrl(payload)
            .then((res) => {
              setImageURL(reader.result.toString());
              return res;
            })
            .then((res) => {
              apis.FinduserByEmail({ email }).then((res) => {
                dispatch(setImage(res[0].ImageUrl));
              });
            });
        };
        reader.readAsDataURL(file);
      }
    };
    return (
      <div>
        <ResponsiveAppBar />
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "30%",
              height: "100vh",
            }}
          >
            <Avatar
              sx={{
                mt: 10,
                height: 250,
                width: 250,
              }}
              alt="Profile Photo."
              src={imageURL}
            ></Avatar>

            <Button
              variant="contained"
              component="label"
              sx={{
                mt: 5,
                height: 50,
                width: 350,
              }}
              style={{ background: "#656268" }}
            >
              Update Your Profile Image
              <input type="file" hidden onChange={fileselectedHandler} />
            </Button>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h5" sx={{ mt: 5 }}>
                Email: {email}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h5" sx={{ mt: 5 }}>
                Nickname:
              </Typography>

              {update === false ? (
                <Typography variant="h5" sx={{ mt: 5 }}>
                  {name}
                </Typography>
              ) : (
                <TextField
                  required
                  sx={{ ml: 1, mt: 5, width: 200, height: 5 }}
                  value={tempname}
                  InputLabelProps={{
                    style: {
                      fontSize: 14,
                      backgroundColor: "#FFF",
                      paddingLeft: 4,
                      paddingRight: 4,
                      color: "#383838",
                    },
                  }}
                  inputProps={{
                    style: {
                      fontSize: 14,
                      height: 35,
                      width: 272,
                      padding: "0 14px",
                      fontWeight: "bold",
                    },
                  }}
                  onChange={(e) => {
                    setTempName(e.target.value);
                  }}
                />
              )}

              <Button
                onClick={updateUsername}
                variant="contained"
                sx={{
                  ml: 2,
                  mt: 5,
                  width: 10,
                  height: 30,
                  backgroundColor: "#656268",
                }}
              >
                update
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h5" sx={{ mt: 5 }}>
                Bio:
              </Typography>

              {updateBio === false ? (
                <Typography variant="h5" sx={{ mt: 5 }}>
                  {bio}
                </Typography>
              ) : (
                <TextField
                  required
                  sx={{ ml: 1, mt: 5, width: 200, height: 5 }}
                  value={tempbio}
                  InputLabelProps={{
                    style: {
                      fontSize: 14,
                      backgroundColor: "#FFF",
                      paddingLeft: 4,
                      paddingRight: 4,
                      color: "#383838",
                    },
                  }}
                  inputProps={{
                    style: {
                      fontSize: 14,
                      height: 35,
                      width: 272,
                      padding: "0 14px",
                      fontWeight: "bold",
                    },
                  }}
                  onChange={(e) => {
                    setTempBio(e.target.value);
                  }}
                />
              )}

              <Button
                onClick={updateUserbio}
                variant="contained"
                sx={{
                  ml: 2,
                  mt: 5,
                  width: 10,
                  height: 30,
                  backgroundColor: "#656268",
                }}
              >
                update
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h5" sx={{ mt: 5 }}>
                Rating: {Math.round(rating * 100) / 100}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h5" sx={{ mt: 5 }}>
                Profile Visibility:
              </Typography>
              <ToggleButtonGroup
                value={alignment}
                exclusive
                onChange={handleAlignment}
                aria-label="text alignment"
              >
                <ToggleButton
                  sx={{ mt: 5, ml: 2, height: 30 }}
                  value={true}
                  aria-label="Visible"
                >
                  visible
                </ToggleButton>
                <ToggleButton
                  sx={{ mt: 5, height: 30 }}
                  value={false}
                  aria-label="Not Visible"
                >
                  Not visible
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Typography variant="h5" sx={{ mt: 5 }}>
                email notifications:
              </Typography>
              <ToggleButtonGroup
                value={emailAlignment}
                exclusive
                onChange={handleEmailAlignment}
                aria-label="text alignment"
              >
                <ToggleButton
                  sx={{ mt: 5, ml: 2, height: 30 }}
                  value={true}
                  aria-label="Receive"
                >
                  receive
                </ToggleButton>
                <ToggleButton
                  sx={{ mt: 5, height: 30 }}
                  value={false}
                  aria-label="Not receive"
                >
                  Not receive
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Button
              variant="contained"
              sx={{ mt: 5, height: 50, width: 350 }}
              style={{ background: "#656268" }}
              onClick={() => {
                handleClickOpen();
              }}
            >
              Change Your Password
            </Button>
            <Dialog
              open={open}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Change Password?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  You sure you want to change your password?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleChange}>Confirm</Button>
                <Button onClick={handleClose}>Back</Button>
              </DialogActions>
            </Dialog>

            <Button
              variant="contained"
              sx={{ mt: 5, height: 50, width: 350 }}
              style={{ background: "#656268" }}
              onClick={() => {
                setPhoneopen(true);
              }}
            >
              Change Your Phone Number
            </Button>
            <Dialog
              open={Phoneopen}
              keepMounted
              onClose={handlephoneClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Change Phone Number?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  You sure you want to change your Phone number?
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="phonenumber"
                  label="Phone Number"
                  type="phonenumber"
                  fullWidth
                  variant="standard"
                  onChange={(e) => {
                    setNewPhone(e.target.value);
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handlePhoneChange}>Confirm</Button>
                <Button onClick={handlephoneClose}>Back</Button>
              </DialogActions>
            </Dialog>
            <Grid id="reCap"></Grid>
            <Button
              variant="contained"
              sx={{ mt: 5, height: 50, width: 350 }}
              style={{ background: "#656268" }}
              onClick={() => {
                handleEmailChange();
              }}
            >
              Change Your Email
            </Button>
            <Dialog open={emailChange} onClose={handleEmailClose}>
              <DialogTitle>Change Email</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter your new email address
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="standard"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handlechangeEmail}>Confirm</Button>
                <Button onClick={handleEmailClose}>Cancel</Button>
              </DialogActions>
            </Dialog>

            <Button
              variant="contained"
              sx={{
                mt: 5,
                height: 50,
                width: 350,
              }}
              style={{ background: "#656268" }}
              onClick={() => {
                handleClickDelete();
              }}
            >
              Delete Your Account
            </Button>
            <Dialog
              open={open2}
              keepMounted
              onClose={handleCloseDelete}
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle>{"Delete Your Account?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  You sure you want to delete your account from Postman?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handledelete}>Confirm</Button>
                <Button onClick={handleCloseDelete}>Back</Button>
              </DialogActions>
            </Dialog>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "70%",
              height: "100vh",

            }}
          >
            <Typography
              variant="h6"
              sx={{
                mt: 10,
                width: "100%",
                textAlign: "center",
                color: "#656268",
                fontFamily: "sans-serif",
                fontWeight: "bold",
              }}
            >
              Your Posted Tasks
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                width: "100%",
                textAlign: "center",
                color: "#656268",
                fontFamily: "sans-serif",
                fontWeight: "bold",
              }}
            >
              ________________________________
            </Typography>

            <TaskPosted taskList={taskList} />
          </Box>
        </Box>
      </div>
    );
  }
}
