import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { auth } from '../../apis/firebase';
import { InputAdornment } from '@mui/material';
import ResponsiveAppBar from '../TopBar/TopBar';
import { useState } from 'react';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendSignInLinkToEmail,
  updatePhoneNumber
} from 'firebase/auth';
import apis from '../../apis/user';
function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        PostMan
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();
export default function SignUp() {
  const navigate = useNavigate();
  const [NameError, setNameError] = useState(false);
  const [PhoneError, setPhoneError] = useState(false);
  const [PasswordError, setPasswordError] = useState(false);
  const [EmailError, setEmailError] = useState(false);
  const [EmailInUsed, setInUsed] = useState(false);
  const [IncorrectCode, setIncorrectCode] = useState(false);
  const [Phone, setPhone] = useState('+1');
  const handleClick = (event) => {
    const auth = getAuth();
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'reCap',
        {
          size: 'invisible',
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          }
        },
        auth
      );
    }
    let phone_number = '+1' + Phone;
    console.log(phone_number);
    signInWithPhoneNumber(auth, phone_number, window.recaptchaVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        alert('A Code Sent Successfully to Your Phone');
        setPhoneError(false);
        // ...
      })
      .catch((error) => {
        setPhoneError(true);
        console.log(error.message);
      });
  };

  const send_email = (email) => {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: 'http://localhost:3000/',
      // This must be true.
      handleCodeInApp: true
    };

    const auth = getAuth();
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
      phone_number: data.get('phone_number'),
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      validation_code: data.get('validation_code'),
      nickname: data.get('nickname')
    });

    let email = data.get('email');
    let password = data.get('password');
    let phone_number = data.get('phone_number');
    let firstName = data.get('firstName');
    let lastName = data.get('lastName');
    let validation_code = data.get('validation_code');
    let isnum = /^\d+$/.test(phone_number);
    let nickname = data.get('nickname');
    setNameError(false);
    setPhoneError(false);
    setPasswordError(false);
    setEmailError(false);
    setInUsed(false);
    setIncorrectCode(false);
    if (firstName.length === 0 || lastName.length === 0) {
      setNameError(true);
    }
    if (isnum === false) {
      setPhoneError(true);
    }
    if (password.length < 6) {
      setPasswordError(true);
    }
    if (email.length === 0) {
      setEmailError(true);
    }
    if (validation_code.length === 0) {
      setIncorrectCode(true);
    }
    window.confirmationResult
      .confirm(validation_code)
      .then((result) => {
        // User signed in successfully.

        setIncorrectCode(false);
        if (!NameError && !PhoneError && !PasswordError && !EmailInUsed && !IncorrectCode) {
          console.log(IncorrectCode);
          auth
            .createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              // user.linkWithPhoneNumber(phone_number);
              // ...
              send_email(email);
              const userInput = {
                firstname: firstName,
                lastName: lastName,
                nickname: nickname,
                email: email,
                phoneNumber: phone_number,
                password: password,
                is_admin: false
              };
              apis.insertNewuser(userInput);
              console.log(user.email);
              updatePhoneNumber(userCredential.use,phone_number).then(() => {
                // Email updated!
                // ...
              }).catch((error) => {
                // An error occurred
                // ...
              });
              navigate('/');
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              if (
                errorMessage ===
                'Firebase: The email address is already in use by another account. (auth/email-already-in-use).'
              ) {
                setInUsed(true);
              } else if (errorMessage.includes('email')) {
                setEmailError(true);
              }
              if (
                errorMessage ===
                'Firebase: Password should be at least 6 characters (auth/weak-password).'
              ) {
                setPasswordError(true);
              }
              // ..
            });
        }
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
        setIncorrectCode(true);
      });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <ResponsiveAppBar />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
            <img src={'/logo.svg'} alt="logo" style={{ width: 133, height: 123 }} />
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    error={NameError}
                    helperText={NameError ? "Name Can't be empty" : ''}
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    error={NameError}
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    error={NameError}
                    id="NickName"
                    label="Nick Name"
                    name="nickname"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    error={EmailError || EmailInUsed}
                    helperText={
                      EmailError
                        ? 'Invalid email input'
                        : EmailInUsed
                        ? 'Email Already In Used Try to Log in Instead'
                        : ''
                    }
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    error={PhoneError}
                    helperText={PhoneError ? 'Invalid Phone Number' : ''}
                    id="phone_number"
                    label="Phone number"
                    name="phone_number"
                    autoComplete="tel"
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    error={IncorrectCode}
                    helperText={IncorrectCode ? 'Invalid Verification Number' : ''}
                    id="validation_code"
                    label="validation code"
                    name="validation_code"
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
                              backgroundColor: 'grey',
                              whiteSpace: 'nowrap',
                              display: 'block',
                              color: 'black',
                              textTransform: 'none'
                            }}>
                            Send Code
                          </Button>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    error={PasswordError}
                    helperText={
                      PasswordError
                        ? 'Invalid Password:Password should be at least 6 character!'
                        : ''
                    }
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid id="reCap"></Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ background: '#656268' }}>
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </Box>
  );
}
