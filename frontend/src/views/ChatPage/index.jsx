import ResponsiveAppBar from "../TopBar/TopBar";
import { Box, Button } from "@mui/material";
import Sidebar from "./sideBar";
import Chat from "./chat";
import apis from "../../apis/user";
import { useState, useEffect } from "react";
import { setUsers } from "../../stores/chat";
import { useDispatch } from "react-redux";


const ChatPage = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  useEffect(() => {
  apis.GetallUser().then((res) => {
    const n = res.length;
    let temp = [];
    for (let i = 0; i < n; i++) {
      if (res[i].email !== localStorage.getItem("userId")) {
        temp.push({
          name: res[i].nickname,
          id: res[i].email,
          image: res[i].ImageUrl,
        });
      };
    }
    setUser(temp);
    console.log(temp);
    dispatch(setUsers(temp));
  });
}, []);


  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          boxSizing: "border-box",
        }}
      >
        <ResponsiveAppBar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          {/*Side Bar*/}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "30%",
              height: "100%",
              backgroundColor: "#ADADAD",
              boxSizing: "border-box",
            }}
          >
            <Sidebar user={user}/>
          </Box>

          {/*ChatRoom*/}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "70%",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <Chat />
          </Box>
        </Box>
      </Box>
    </div>
  );
};
export default ChatPage;
