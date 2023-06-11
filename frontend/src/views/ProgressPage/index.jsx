import React from "react";
import { useEffect, useState } from "react";
import { Box } from "@mui/system";
import ResponsiveAppBar from "../TopBar/TopBar";
import { useNavigate, useLocation } from "react-router-dom";
import apis from "../../apis/user";
import emailjs from "@emailjs/browser";
import "./ProgressPage.css";
import Map from "./Map";

const ProgressPage = () => {
  const navigate = useNavigate();
  const route = useLocation();
  const taskId = route.search.split("=")[1];
  const [taskInfo, setTaskInfo] = useState({});
  const [taskStart, setTaskStart] = useState(false);
  useEffect(() => {
    if (taskId) {
      // TODO: get task info from backend
      apis.GetTask(taskId).then((res) => {
        console.log(res[0]);
        setTaskInfo(res[0]);
        setTaskStart(res[0].status === "started");
      });
    }
  }, [taskId]);
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
              "template_kxpcred",
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
  const sendEmailFinish = (input) => {
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
              "service_0yvi8aq",
              "template_0xqba73",
              templateParams,
              "YxEfzeRQVGqD1fr4H"
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

  const handleFinishTask = () => {
    // check the confirm code match
    if (taskInfo) {
      let confirmationCode = document.getElementById("confirmation_code").value;
      if (confirmationCode === taskInfo.confirmCode) {
        taskInfo.status = "completed";
        apis.UpdateTask(taskInfo._id, taskInfo).then((res) => {
          console.log("res", res);
        });
        sendEmailFinish(taskInfo);
        navigate({
          pathname: "/rate-task",
          search: `?taskId=${taskInfo._id}&taskPoster=${taskInfo.posterId}`,
        });
      } else {
        alert("Confirmation code does not match");
      }
    }
  };
  const handleStart = () => {
    console.log("start task");
    if (!taskStart) {
      setTaskStart(true);
      sendemail(taskInfo);
    }
    taskInfo.status = "started";
    apis.UpdateTask(taskInfo._id, taskInfo).then((res) => {
      console.log("res", res);
    });
  };
  const handleCancel = () => {
    console.log("cancel task");
    setTaskStart(false);
    // set the task taken
    taskInfo.isTaken = false;
    taskInfo.takerId = "no-taker";
    taskInfo.status = "not-taken";
    // update the status in the database
    apis.UpdateTask(taskInfo._id, taskInfo).then((res) => {
      console.log("res", res);
    });
    navigate("/homepage");
    window.location.reload();
  };
  return (
    <div>
      <ResponsiveAppBar />
      <div className="progress-page">
        <div className="progress-page-title">Task Progress</div>
        <div className="progress-page-content">
          <div className="progress-page-left-content">
            <Box
              sx={{
                width: 600,
                height: 400,
                backgroundColor: "white",
              }}
            >
              {taskInfo &&
                taskInfo.location &&
                taskInfo.senderInfo &&
                taskInfo.receiverInfo && (
                  <Map
                    start={taskInfo.senderInfo.address}
                    end={taskInfo.receiverInfo.address}
                  />
                )}
            </Box>
          </div>
          <div className="progress-page-right-content">
            {taskInfo &&
              taskInfo.location &&
              taskInfo.senderInfo &&
              taskInfo.receiverInfo && (
                <div>
                  <div className="progress-page-data">
                    Task Status: {taskInfo.status}
                  </div>
                  <div className="progress-page-data">
                    Task Poster: {taskInfo.posterId}
                  </div>
                  <div className="progress-page-data">
                    Task Taker: {taskInfo.takerId}
                  </div>
                  <div className="progress-page-data">
                    Task Description: {taskInfo.description}
                  </div>
                  <div className="progress-page-data">
                    Task Location: {taskInfo.senderAddress}
                  </div>
                  <div className="progress-page-data">
                    Task Sender Name: {taskInfo.senderInfo.name}
                  </div>
                  <div className="progress-page-data">
                    Task Sender Phone: {taskInfo.senderInfo.telephone}
                  </div>
                  <div className="progress-page-data">
                    Task Sender Address: {taskInfo.senderAddress}
                  </div>
                  <div className="progress-page-data">
                    Task Receiver Name: {taskInfo.receiverInfo.name}
                  </div>
                  <div className="progress-page-data">
                    Task Receiver Phone: {taskInfo.receiverInfo.telephone}
                  </div>
                  <div className="progress-page-data">
                    Task Receiver Address: {taskInfo.receiverAddress}
                  </div>
                  <div className="progress-page-data">
                    <button onClick={handleStart}>Start Your Task</button>
                    <button onClick={handleCancel}>Cancel Your Task</button>
                  </div>
                  {taskStart ? (
                    <div className="progress-page-data">
                      <label>Confirmation code (receiver gave you):</label>
                      <input
                        type="text"
                        id="confirmation_code"
                        name="confirmation_code"
                        required
                      />
                      <button onClick={handleFinishTask}>Finish Task</button>
                    </div>
                  ) : null}
                </div>
              )}
          </div>
        </div>
      </div>
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: "none", md: "flex", marginLeft: 220, marginTop: 20 },
        }}
      >
        Have an issue about the tasks? Report it here!
        <a href="mailto:jiangnanyi111@gmail.com?subject = Feedback&body = Message">
          Send Feedback
        </a>
      </Box>
    </div>
  );
};

export default ProgressPage;
