import { Box } from "@mui/system";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import * as React from "react";
import apis from "../../apis/user";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
function RightMessage({ message, image, email }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [imageURL, setImageURL] = React.useState(null);
  const [bio, setBio] = React.useState("");
  const [rating, setRating] = React.useState(5);
  const handleClickOpen = () => {
    apis.FinduserByEmail({ email }).then((res) => {
      if (res[0].visibility) {
        console.log("asdf");
        setName(res[0].nickname);
        setBio(res[0].bio);
        setImageURL(res[0].ImageUrl);
        setRating(res[0].rating);
        setOpen(true);
      } else {
        alert("You do not have the permission to view this user's profile");
      }
    });
  };
  const handleClose = () => {
    setOpen(false);
  };
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }

  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };

  return (
    <List
      sx={{
        alignSelf: "flex-start",
        bgcolor: "background.paper",
      }}
    >
      <ListItem alignItems="flex-start">
        <ListItemAvatar sx={{ alignItems: "flex-start", my: 0.5 }}>
          <Avatar
            alt="Remy Sharp"
            src={image ? image : "/static/images/avatar/2.jpg"}
            onClick={handleClickOpen}
          />
        </ListItemAvatar>
        <Box
          sx={{
            padding: 2,
            display: "flex",
            justifyContent: "center",
            backgroundColor: "grey",
            borderRadius: 2,
          }}
        >
          {message}
        </Box>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
          >
            Profile
          </BootstrapDialogTitle>
          <DialogContent>
            <Avatar
              sx={{
                ml: 8,
                height: 150,
                width: 150,
                alignItems: "center",
              }}
              alt="Profile Photo."
              src={imageURL}
            ></Avatar>
            <Typography variant="h5" sx={{ mt: 5 }}>
              NickName: {name}
            </Typography>
            <Typography variant="h5" sx={{ mt: 5 }}>
              Email: {email}
            </Typography>
            <Typography variant="h5" sx={{ mt: 5 }}>
              Bio: {bio}
            </Typography>
            <Typography variant="h5" sx={{ mt: 5 }}>
              Rating: {Math.round(rating * 100) / 100}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </ListItem>
    </List>
  );
}

export default RightMessage;
