import * as React from "react";
import List from "@mui/material/List";
import { Box, Paper, Typography, TextField } from "@mui/material";
import { useState } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Rating from "@mui/material/Rating";
import TaskIcon from "@mui/icons-material/Task";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import apis from "../../apis/user";
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

const CollapsedTask = (props) => {
  // this is the mock up task data for the task feed
  const task = props.taskInfo;
  const [open, setOpen] = useState(false);
  const [inneropen, setInnerOpen] = useState(false);
  const [modopen, setModOpen] = useState(false);
  const [takerrating, setTakerRating] = useState(0);
  const [value, setValue] = useState(0);
  const [newTT, setNewTT] = useState(task.title);
  const [newTD, setNewTD] = useState(task.description);
  const [newCC, setNewCC] = useState(task.confirmCode);

  apis.FinduserByEmail({ email: task.takerId }).then((res) => {
    if (res.length > 0) {
      setTakerRating(res[0].rating);
    }
  });
  const handlerateopen = (props) => {
    setInnerOpen(true);
  };
  // controller for the expand button
  const handleopen = (props) => {
    console.log("clicked" + task.status);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handlerateClose = () => {
    setInnerOpen(false);
  };
  const handleRate = () => {
    console.log(task.takerId);
    apis.FinduserByEmail({ email: task.takerId }).then((res) => {
      const total = res[0].totalrating;
      const count = res[0].ratingcount;
      const newRating = (total + value) / (count + 1);
      const newTotal = total + value;
      const newCount = count + 1;
      const ratingpayload = {
        email: task.takerId,
        rating: newRating,
      };
      apis.UpdateRating(ratingpayload).then((res) => {
        const totalpayload = {
          email: task.takerId,
          totalrating: newTotal,
        };
        apis.UpdateTotalRating(totalpayload).then((res) => {
          const countpayload = {
            email: task.takerId,
            ratingcount: newCount,
          };
          apis.UpdateRatingCount(countpayload).then((res) => {});
        });
      });
    });
    setInnerOpen(false);
    setValue(0);
  };

  const handledelete = () => {
    apis.deleteTask({ id: task._id }).then((res) => {
      console.log(res);
    });
    setOpen(false);
    window.location.reload();
  };

  const handleModify = () => {
    setModOpen(true);
  };

  const handleModifyClose = () => {
    setModOpen(false);
  };

  const handleModifySubmit = () => {
    const payload = {
      id: task._id,
      title: newTT,
      description: newTD,
      category: newCC,
    };
    apis.updateTask(payload).then((res) => {
      console.log(res);
    });
    window.location.reload();
  };
      

  return (
    <div>
      <Box>
        <React.Fragment>
          <ListItemButton onClick={handleopen}>
            <ListItemIcon>
              <TaskIcon />
            </ListItemIcon>
            <ListItemText primary={task.title} />
          </ListItemButton>
        </React.Fragment>
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
          Posted Task details
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {task.status === "completed" ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography gutterBottom> Image Prove:</Typography>
              <img
                alt="Provence"
                src={task.ImageUrl}
                style={{
                  width: 200,
                  height: 200,
                }}
              ></img>
            </Box>
          ) : null}
          <Typography gutterBottom>Task Status: {task.status}</Typography>
          <Typography gutterBottom>Task Title: {task.title}</Typography>
          <Typography gutterBottom>
            Task Description: {task.description}
          </Typography>
          <Typography gutterBottom>Task Taken By: {task.takerId}</Typography>
          {task.status === "completed" ? (
            <Typography gutterBottom>
              Task Taker's rating: {Math.round(takerrating * 100) / 100}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions>
          {task.status !== "completed" ? (
            <Button autoFocus onClick={handleModify}>
              Modify
            </Button>
          ) : null}
          {task.status !== "completed" && (
            <Button autoFocus onClick={handledelete}>
              Delete
            </Button>
          )}
          {task.status === "completed" && (
            <Button autoFocus onClick={handlerateopen}>
              Rate Task taker
            </Button>
          )}
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
        <BootstrapDialog
          onClose={handlerateClose}
          aria-labelledby="customized-dialog-title"
          open={inneropen}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handlerateClose}
          >
            Rate the task taker
          </BootstrapDialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleRate}>
              Rate
            </Button>
          </DialogActions>
        </BootstrapDialog>

        <BootstrapDialog
          onClose={handleModifyClose}
          aria-labelledby="customized-dialog-title"
          open={modopen}
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleModifyClose}
          >
            Modify Task
          </BootstrapDialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  mb: 2,
                }}
              >
                <Typography gutterBottom>Task Title: </Typography>
                <TextField
                  id="standard-basic"
                  value={newTT}
                  sx={{ ml: 1 }}
                  onChange={(e) => {
                    setNewTT(e.target.value);
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  mb: 2,
                }}
              >
                <Typography gutterBottom>Task Description: </Typography>
                <TextField
                  id="standard-basic"
                  value={newTD}
                  sx={{ ml: 1 }}
                  onChange={(e) => {
                    setNewTD(e.target.value);
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Typography gutterBottom> Confirmation Code: </Typography>
                <TextField
                  id="standard-basic"
                  value={newCC}
                  sx={{ ml: 1 }}
                  onChange={(e) => {
                    setNewCC(e.target.value);
                  }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleModifySubmit}>
              Confirm
            </Button>
            <Button autoFocus onClick={handleModifyClose}>
              Cancel
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </BootstrapDialog>
    </div>
  );
};
export default CollapsedTask;
