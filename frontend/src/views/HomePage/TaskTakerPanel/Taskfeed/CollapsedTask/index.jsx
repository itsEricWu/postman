import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import TaskIcon from "@mui/icons-material/Task";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import ChatIcon from "@mui/icons-material/Chat";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DescriptionIcon from "@mui/icons-material/Description";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
import { ListItem, ListItemSecondaryAction } from "@mui/material";
import apis from "../../../../../apis/user";
import emailjs from "@emailjs/browser";

const CollapsedTask = (props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const taskInfo = props.taskInfo;

  // controller for the expand button
  const handleCollapseClick = () => {
    setOpen(!open);
  };
  const sendemail = (input) => {
    let email = localStorage.getItem("userId");
    apis.FinduserByEmail({ email }).then((res) => {
      let nickname = res[0].nickname;
      let bio = res[0].bio;
      let phone = res[0].phoneNumber;
      apis.FinduserByEmail({ email: input.posterId }).then((res) => {
        let emailVisibility = res[0].emailVisibility;
        if (emailVisibility === true) {
          const templateParams = {
            to_name: input.senderInfo.name,
            id: input.title,
            nickname: nickname,
            bio: bio,
            phone: phone,
            User_email: input.posterId,
          };
          emailjs
            .send(
              "service_wvvskxm",
              "template_gvukolw",
              templateParams,
              "6TQG4qyO0kxVbL4GQ"
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
    });
  };
  // controller for the task button
  const handleTaskTakeClick = (e) => {
    // check if the task is taken
    if (taskInfo.isTaken === true) {
      console.log("task is taken");
      return;
    }
    // set the task taken
    taskInfo.isTaken = true;
    taskInfo.takerId = localStorage.getItem("userId");
    taskInfo.status = "taken";
    // update the status in the database
    apis.UpdateTask(taskInfo._id, taskInfo).then((res) => {
      console.log("res", res);
      sendemail(res);
    });

    props.setTaskTaken((taskTaken) => [...taskTaken, taskInfo]);
    // redirect to task progress page
    console.log(taskInfo);
    navigate({
      pathname: "/task-progress",
      search: `?taskId=${taskInfo._id}`,
    });
  };

  // controller for the task chatting button
  const handleTaskChatClick = (e) => {
    // check if the task is taken
    if (taskInfo.isTaken === true) {
      console.log("task is taken");
      return;
    }
    navigate({
      pathname: "/chatpage",
      search: `?taskId=${taskInfo._id}&taskPoster=${taskInfo.posterId}`,
    });
    window.location.reload();
  };

  // controller for the task progress button
  const handleTaskProgressClick = (e) => {
    // check if the task is not taken
    if (taskInfo.isTaken === false) {
      console.log("task is not taken");
      return;
    }
    navigate({
      pathname: "/task-progress",
      search: `?taskId=${taskInfo._id}`,
    });
  };

  return (
    <React.Fragment>
      <ListItemButton onClick={handleCollapseClick}>
        <ListItemIcon>
          <TaskIcon />
        </ListItemIcon>
        <ListItemText primary={taskInfo.title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary={taskInfo.description} />
          </ListItemButton>
          <ListItemSecondaryAction>
            <IconButton aria-label="chat" onClick={handleTaskChatClick}>
              {taskInfo.isTaken ? <SpeakerNotesOffIcon /> : <ChatIcon />}
            </IconButton>
            <IconButton
              edge="end"
              aria-label="take"
              onClick={handleTaskTakeClick}
            >
              {taskInfo.isTaken ? <UnpublishedIcon /> : <CheckCircleIcon />}
            </IconButton>
            <IconButton aria-label="progress" onClick={handleTaskProgressClick}>
              {taskInfo.isTaken ? (
                <HourglassBottomIcon />
              ) : (
                <HourglassDisabledIcon />
              )}
            </IconButton>
          </ListItemSecondaryAction>
        </List>
      </Collapse>
    </React.Fragment>
  );
};

export default CollapsedTask;
