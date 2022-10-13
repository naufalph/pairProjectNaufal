const express = require("express");
const route = express.Router();
const Controller = require("../controllers/index.js");

route.get("/", Controller.home);
route.get("/login", Controller.login);
route.post("/login", Controller.loginPost);
route.get("/register", Controller.register);
route.post("/register", Controller.registerPost);
route.get("/logout", Controller.logout);
route.get("/post/add", Controller.isLogin, Controller.postAdd);
route.post("/post/add", Controller.postPost);
route.get("/post/:id", Controller.postDetail);
route.get("/post/:id/delete", Controller);
route.get("/post/:id/:userId/edit", Controller.isLoginDel, Controller.postEdit);
route.get(
  "/post/:id/:userId/delete",
  Controller.isLoginDel,
  Controller.postDel
);
route.post("/post/:id/edit", Controller.postEditPost);
route.post("/post/:id/comment", Controller.isLogin, Controller.commentAdd);
route.get(
  "/post/:id/comment/:userId/:commentId/delete",
  Controller.isLoginDel,
  Controller.commentDel
);

module.exports = route;