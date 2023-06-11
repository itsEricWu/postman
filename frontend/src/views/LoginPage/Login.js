import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { auth } from "../../apis/firebase";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import { imageListItemClasses, InputAdornment } from "@mui/material";
import { setImage } from "../../stores/chat";
import { useDispatch, useSelector } from "react-redux";
import apis from "../../apis/user";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  OAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
} from "firebase/auth";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"} variant={"body2"}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function Login() {
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState(false);
  const [EmailError, setEmailError] = useState(false);
  const [authenticated, setauthenticated] = useState(
    localStorage.getItem(localStorage.getItem("authenticated") || false)
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const msftProvider = new OAuthProvider("microsoft.com");
  const fbProvider = new FacebookAuthProvider();
  const ghProvider = new GithubAuthProvider();
  const ggProvider = new GoogleAuthProvider();
  const [value, setValue] = useState(0);
  const [IncorrectCode, setIncorrectCode] = useState(false);
  const [PhoneError, setPhoneError] = useState(false);
  const [Phone, setPhone] = useState("+1");
  const [validation_code, setValidationcode] = useState("");

  const handleRedirect = () => {
    navigate("./homepage");
    window.location.reload();
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handelreset = (event) => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        setEmailError(false);
        alert("A reset email have been sent to your email");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setEmailError(true);
      });
  };
  const handlePhoneLoginSubmit = (event) => {
    window.confirmationResult
      .confirm(validation_code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        setIncorrectCode(false);
        localStorage.setItem("authenticated", true);
        const payload = {
          phone: Phone,
        };
        apis.FinduserByPhone(payload).then((res) => {
          localStorage.setItem("userId", res[0].email);
          console.log(localStorage.getItem("userId"));
        }).then(()=>{
          handleRedirect();
        });
        //...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        setIncorrectCode(true);
        console.log(error);
      });
  };
  const handleClick = (event) => {
    const auth = getAuth();
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
    let phone_number = "+1" + Phone;
    console.log(phone_number);
    signInWithPhoneNumber(auth, phone_number, window.recaptchaVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        alert("A Code Sent Successfully to Your Phone");
        setPhoneError(false);
        // ...
      })
      .catch((error) => {
        setPhoneError(true);
      });
  };
  const pic = useSelector((state) => state.chat.image);
  const handleLoginSubmit = async (e) => {
    const auth = getAuth();
    let errorMessage = "";
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setauthenticated(true);
        localStorage.setItem("authenticated", true);
        localStorage.setItem("userId", user.email);

        apis
          .FinduserByEmail({ email })
          .then((res) => {
            dispatch(setImage(res[0].ImageUrl));
          })
          .then(() => {
            handleRedirect();
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        errorMessage = error.message;
      });
    if (errorMessage !== "") {
      setLoginError(true);
    }
  };

  const handleMicrosoftLogin = async (e) => {
    const auth = getAuth();
    signInWithPopup(auth, msftProvider)
      .then((result) => {
        // User is signed in.
        // IdP data available in result.additionalUserInfo.profile.

        // Get the OAuth access token and ID Token
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
        const user = result.user;
        localStorage.setItem("authenticated", true);
        localStorage.setItem("userId", user.email);
        handleRedirect();
      })
      .catch((error) => {
        // Handle error.
        console.log(error);
      });
  };

  //
  const handleFacebookLogin = async (e) => {
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        localStorage.setItem("authenticated", true);
        localStorage.setItem("userId", user.email);
        // navigate to homepage
        handleRedirect();
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = FacebookAuthProvider.credentialFromError(error);

        // ...
        console.log(errorMessage);
      });
  };

  const handleGoogleLogin = async (e) => {
    const auth = getAuth();
    signInWithPopup(auth, ggProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        localStorage.setItem("authenticated", true);
        localStorage.setItem("userId", user.email);
        handleRedirect();
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
        console.log(errorMessage);
      });
  };

  const handleGithubLogin = async (e) => {
    const auth = getAuth();
    signInWithPopup(auth, ghProvider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        // ...
        localStorage.setItem("authenticated", true);
        localStorage.setItem("userId", user.email);
        handleRedirect();
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
        console.log(error);
      });
  };

  return (
    <div>
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
          borderRadius: 2,
          border: "1px solid #eaeaea",
          width: "100%",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Email" {...a11yProps(0)} />
          <Tab label="Phone number" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <TextField
            value={email}
            required
            fullWidth
            error={loginError || EmailError}
            helperText={EmailError ? "Please Enter a valid email" : ""}
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(e) => {
              setEmail(e.target.value);
              setLoginError(false);
            }}
            sx={{ mt: 1, mb: 1 }}
          />
          <TextField
            value={password}
            required
            error={loginError}
            helperText={loginError ? "Incorrect email or password" : ""}
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginError(false);
            }}
            sx={{ mt: 1, mb: 1 }}
          />
          {/* make button in middle */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button onClick={handelreset} variant="contained">
              Reset Password
            </Button>
          </Box>
          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                mr: 2,
                width: 100,
                backgroundColor: "#656268",
              }}
              onClick={() => {
                handleLoginSubmit();
              }}
            >
              Login
            </Button>
            <Link href="./signup" sx={{ textDecoration: "none" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  width: 100,
                  color: "#656268",
                  backgroundColor: "#FFFFFF",
                }}
              >
                Sign Up
              </Button>
            </Link>
          </Box>

          {/* Third party */}
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Button
              type="submit"
              size="small"
              onClick={() => {
                handleMicrosoftLogin();
              }}
              startIcon={<img src={"./Microsoft.svg"} alt="microsoft" />}
              sx={{ mx: 1, my: 1 }}
            />
            <Button
              type="submit"
              size="small"
              onClick={() => {
                handleGoogleLogin();
              }}
              startIcon={<img src={"./Google.svg"} alt="google" />}
              sx={{ mx: 1, my: 1 }}
            />
            <Button
              type="submit"
              size="small"
              onClick={() => {
                handleFacebookLogin();
              }}
              startIcon={<img src={"./Meta.svg"} alt="facebook" />}
              sx={{ mx: 1, my: 1 }}
            />

            <Button
              type="submit"
              size="small"
              onClick={() => {
                handleGithubLogin();
              }}
              startIcon={<img src={"./Github.svg"} alt="facebook" />}
              sx={{ mx: 1, my: 1 }}
            />
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <TextField
            required
            fullWidth
            error={PhoneError}
            helperText={PhoneError ? "Invalid Phone Number" : ""}
            id="phone_number"
            label="Phone number"
            name="phone_number"
            autoComplete="tel"
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            sx={{ mt: 1, mb: 1 }}
          />

          <TextField
            required
            fullWidth
            error={IncorrectCode}
            helperText={IncorrectCode ? "Invalid Verification Number" : ""}
            id="validation_code"
            label="code"
            name="validation_code"
            onChange={(e) => {
              setValidationcode(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Button
                    onClick={() => {
                      handleClick();
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
                    Send Code
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{ mt: 1, mb: 1 }}
          />

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                mr: 2,
                width: 100,
                backgroundColor: "#656268",
              }}
              onClick={() => {
                handlePhoneLoginSubmit();
              }}
            >
              Login
            </Button>
            <Link href="./signup" sx={{ textDecoration: "none" }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  width: 100,
                  color: "#656268",
                  backgroundColor: "#FFFFFF",
                }}
              >
                Sign Up
              </Button>
            </Link>
          </Box>
          <Grid id="reCap"></Grid>
          {/* Third party */}
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Button
              type="submit"
              size="small"
              onClick={() => {
                handleMicrosoftLogin();
              }}
              startIcon={<img src={"./Microsoft.svg"} alt="microsoft" />}
              sx={{ mx: 1, my: 1 }}
            />
            <Button
              type="submit"
              size="small"
              onClick={() => {
                handleGoogleLogin();
              }}
              startIcon={<img src={"./Google.svg"} alt="google" />}
              sx={{ mx: 1, my: 1 }}
            />
            <Button
              type="submit"
              size="small"
              onClick={() => {
                handleFacebookLogin();
              }}
              startIcon={<img src={"./Meta.svg"} alt="facebook" />}
              sx={{ mx: 1, my: 1 }}
            />

            {/* Added GitHub OAuth */}
            <Button
              type="submit"
              size="small"
              onClick={() => {
                handleGithubLogin();
              }}
              startIcon={<img src={"./Github.svg"} alt="facebook" />}
              sx={{ mx: 1, my: 1 }}
            />
          </Box>
        </TabPanel>
      </Box>
    </div>
  );
}
