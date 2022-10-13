const { Op } = require("sequelize");
const { User, Post, Tag, Comment } = require("../models");
const bcrypt = require("bcryptjs");
const {dateDescription} = require("../helpers/formatter.js");

class Controller {
  static home(req, res) {
    console.log(req.session);
    let options = {
      include: [
        {
          model: User,
          attributes: ["username"],
        },
        {
          model: Tag,
          attributes: ["name"],
        },
      ],
    };
    let search = req.query.search;
    if (search) {
      options.where = {
        title: {
          [Op.or]: [
            { [Op.iLike]: `%${search}%` },
            { [Op.iLike]: `${search}%` },
            { [Op.iLike]: `%${search}` },
          ],
        },
      };
    }
    Post.findAll(options)
      .then((data) => {
        // res.send(data);
        res.render("home", { data, dateDescription });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static login(req, res) {
    const { error } = req.query;
    res.render("login", { error });
  }
  static loginPost(req, res) {
    const { username, password } = req.body;
    User.findOne({ where: { username } })
      .then((user) => {
        if (user) {
          const isValidPass = bcrypt.compareSync(password, user.password);
          if (isValidPass) {
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;

            return res.redirect("/");
          } else {
            return res.redirect("/login?error=incorrect;username/password");
          }
        } else {
          return res.redirect("/login?error=incorrect;username/password");
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static logout(req, res) {
    delete req.session.user;
    res.redirect("/");
  }
  static register(req, res) {
    res.render("register");
  }
  static registerPost(req, res) {
    const userInfo = req.body;
    User.create(userInfo)
      .then((data) => {
        req.session.user = {
          userId: data.id,
          username: data.username,
          role: data.role,
        };
        res.redirect("/");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static postAdd(req, res) {
    // console.log(req.session);
    res.render("post-add");
  }
  static postDetail(req, res) {
    const postId = +req.params.id;
    const options = {
      include: [
        {
          model: User,
        },
        {
          model: Tag,
        },
        {
          model: Comment,
          include: {
            model: User,
          },
        },
      ],
      where: { id: postId },
    };
    Post.findOne(options)
      .then((data) => {
        // res.send(data)
        res.render("post-detail", { data, dateDescription });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static commentAdd(req, res) {
    const postId = +req.params.id;
    const userId = req.session.userId;
    const commentInfo = req.body;
    commentInfo.PostId = postId;
    commentInfo.UserId = userId;
    Comment.create(commentInfo)
      .then(() => {
        res.redirect(`/post/${postId}`);
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static isLoginDel(req, res, next) {
    const requiredId = +req.params.id;
    if (!req.session.userId) {
      return res.redirect("/login?error=login;is;required");
    } else if (req.session.userId === requiredId) {
      next();
    } else {
      return res.redirect("/login?error=access;violation");
    }
  }
  static isLogin(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/login?error=login;is;required");
    } 
    else {
      next();
    }
  }
}

module.exports = Controller;
