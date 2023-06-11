import { Paper, MenuList, MenuItem, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useEffect } from "react";
import apis from "../../apis/user";
import { useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import { setOtherUserName } from "../../stores/chat";
import { setOtherUser } from "../../stores/chat";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
const Sidebar = () => {
  const dispatch = useDispatch();
  const route = useLocation();
  const [color, setColor] = useState("white");
  const otherUserName = useSelector((state) => state.chat.otherUserName);
  const allUsers = useSelector((state) => state.chat.users);
  const searchParams = new URLSearchParams(route.search);
  const email = searchParams.get("taskPoster");
  console.log(email);
  useEffect(() => {
    apis.FinduserByEmail({ email: email }).then((res) => {
      dispatch(setOtherUserName(res[0].email));
      dispatch(setOtherUser(res[0].ImageUrl));
    });
  }, [email]);
  // dispatch(setOtherUserName(user.id));
  // dispatch(setOtherUser(user.image));
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <Paper sx={{ width: "90%", height: "90%" }}>
        <Box
          sx={{
            width: "70%",
            height: "5%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            p: 2,
            ml: 2,
            borderBottom: 2,
          }}
        >
          <Typography variant="h5" sx={{ textAlign: "center" }}>
            Chat
          </Typography>
        </Box>
        <MenuList sx={{ padding: 2 }}>
          {allUsers.map((user, index) => (
            <MenuItem
              key={index}
              sx={{
                border: 1,
                borderRadius: 5,
                mt: 2,
                backgroundColor:
                  otherUserName === user.id ? "lightgrey" : "white",
              }}
              onClick={() => {
                dispatch(setOtherUserName(user.id));
                dispatch(setOtherUser(user.image));
              }}
            >
              <Avatar alt="Remy Sharp" src={user.image} sx={{ mr: 5 }} />
              <Typography variant="h6">{user.name}</Typography>
            </MenuItem>
          ))}
        </MenuList>
      </Paper>
    </Box>
  );
};

export default Sidebar;
