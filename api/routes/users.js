const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const userscontroller = require("../controllers/user");

router.post("/signup", userscontroller.users_signup);

router.post("/login", userscontroller.users_login);

router.delete("/:userId", userscontroller.users_delete);

module.exports = router;
