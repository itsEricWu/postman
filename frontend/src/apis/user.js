import { deleteFrom, get, post, put } from "./axios";

// user requests
const insertNewuser = async (payload) => {
  return post("/user", { payload });
};
const GetallUser = async (payload) => {
  return get("/user/allUser", { payload });
};
const FinduserByEmail = async (payload) => {
  return get("/user/:id", { payload });
};
const FinduserByPhone = async (payload) => {
  return get("/user/phoneNumber/:id", { payload });
};

const UpdateUserNickname = async (payload) => {
  return put("/user/nickname/:id", { payload });
};
const UpdateUserBio = async (payload) => {
  return put("/user/bio/:id", { payload });
};
const UpdateEmail = async (payload) => {
  return put("/user/email/:id", { payload });
};
const UpdatephoneNumber = async (payload) => {
  return put("/user/phoneNumber/:id", { payload });
};
const UpdateRating = async (payload) => {
  return put("/user/rating/:id", { payload });
};
const UpdateTotalRating = async (payload) => {
  return put("/user/totalrating/:id", { payload });
};
const UpdateRatingCount = async (payload) => {
  return put("/user/ratingcount/:id", { payload });
};
const deleteUserByEmail = async (payload) => {
  return deleteFrom("/user/:id", { payload });
};
const UpdateUserVisibility = async (payload) => {
  return put("/user/visibility/:id", { payload });
};
const UpdateUserEmailVisibility = async (payload) => {
  return put("/user/emailVisibility/:id", { payload });
};
const UpdateUserImageUrl = async (payload) => {
  return put("/user/ImageUrl/:id", { payload });
};
// message requests
const SendMessage = async (payload) => {
  return post("/message", { payload });
};

// task requests
const GetTask = async (id) => {
  console.log(id);
  return get("/task/" + id);
};
const GetTaskList = async () => {
  return get("/task-list");
};

const PostTask = async (payload) => {
  return post("/task", { payload });
};
const deleteTask = async (payload) => {
  return deleteFrom("/task/delete", { payload });
};
const UpdateTask = async (id, payload) => {
  return put("/task/" + id, { payload });
};

const updateTask = async (payload) => {
  console.log("/task/update"+payload.id)
  return put("/task/update/"+payload.id, { payload });
};

const apis = {
  GetallUser,
  insertNewuser,
  FinduserByEmail,
  UpdateUserNickname,
  UpdateUserBio,
  SendMessage,
  UpdateRating,
  UpdateTotalRating,
  UpdateRatingCount,
  GetTask,
  GetTaskList,
  PostTask,
  deleteTask,
  UpdateUserImageUrl,
  updateTask,
  UpdateTask,
  deleteUserByEmail,
  UpdateUserVisibility,
  UpdateEmail,
  FinduserByPhone,
  UpdateUserEmailVisibility,
  UpdatephoneNumber,
};

export default apis;
