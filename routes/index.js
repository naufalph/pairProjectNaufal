const express = require("express");
const route = express.Router();
const Controller = require("../controllers/index.js");

route.get("/", Controller.home);
route.get("/login", Controller.login);
route.post("/login", Controller.loginPost);
route.get("/register", Controller.register);
route.post("/register", Controller.registerPost);
route.post("/logout",Controller);
route.get("/post/add")
route.get("/post/:id", Controller.postDetail);
route.post("/post/:id/comment", Controller.isLogin, Controller.commentAdd);
route.get("/post/:id/comment/:userId/delete", Controller);

module.exports = route;