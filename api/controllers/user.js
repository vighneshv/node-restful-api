const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.users_signup = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email already exist"
        });
      } else {
        bcrypt.hash(req.body.password, 10, function(err, hash) {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                  createUser: {
                    email: result.email,
                    _id: result._id,
                    request: {
                      type: "GET",
                      url: "http://localhost:3000/users/" + result._id
                    }
                  }
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};

exports.users_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return req.status(401).json({
          message: "Email or Passwod doesn't match"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, function(
        err,
        result
      ) {
        if (err) {
          return res.status(401).json({
            error: err,
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              id: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1hr"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          error: err,
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};

exports.users_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
};
