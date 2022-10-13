const { Op } = require("sequelize");
const { User, Post, Tag, Comment } = require("../models");
const bcrypt = require("bcryptjs");
const { dateDescription, errorParser } = require("../helpers/formatter.js");

class Controller {
  static home(req, res) {
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
    delete req.session.userId;
    delete req.session.role;
    delete req.session.username;
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
        if (err.name === "SequelizeValidationError") {
          let errMsg = errorParser(err);
          return res.send(errMsg);
        } else {
          return res.send(err);
        }
      });
  }
  static postAdd(req, res) {
    // console.log(req.session);
    const error = req.query.error;
    Tag.findAll()
      .then((data) => {
        res.render("post-add", { data, error });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static postPost(req, res) {
    const userId = req.session.userId;
    const postInfo = req.body;
    postInfo.UserId = userId;
    Post.create(postInfo)
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static postEdit(req, res) {
    const postId = +req.params.id;
    const error = req.query.error;

    Promise.all([Post.findOne({ where: { id: postId } }), Tag.findAll()])
      .then((data) => {
        const postData = data[0];
        const tagData = data[1];
        res.render("post-edit", { postData, tagData, error });
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static postDel(req, res) {
    const postId = +req.params.id;
    Post.destroy({
      where: { id: postId },
    })
      .then(() => {
        res.redirect(`/`);
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static postEditPost(req, res) {
    const newPost = req.body;
    const postId = req.params.id;
    Post.update(newPost, { where: { id: postId } })
      .then(() => {
        res.redirect(`/post/${postId}`);
      })
      .catch((err) => {
        res.send(err);
      });
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
  static commentDel(req, res) {
    const commentId = req.params.commentId;
    const postId = req.params.id;
    Comment.destroy({
      where: { id: commentId },
    })
      .then(() => {
        res.redirect(`/post/${postId}`);
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static isLoginDel(req, res, next) {
    const requiredId = +req.params.userId;

    if (!req.session.userId) {
      return res.redirect("/login?error=login;is;required");
    } else if (
      req.session.userId === requiredId ||
      req.session.role === "admin"
    ) {
      next();
    } else {
      return res.redirect("/login?error=access;violation");
    }
  }
  static isLogin(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("/login?error=login;is;required");
    } else {
      next();
    }
  }
}

module.exports = Controller;
