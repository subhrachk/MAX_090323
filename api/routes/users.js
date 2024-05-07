const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_KEY = "secret" ;

const User = require("../models/user");
const users = express.Router();

const userController = require('../controllers/userController');


users.post("/signup", (req, res, next) => {
    userController.userSignUp(req, res, next);
});

users.delete("/:userId", (req, res, next) => {
    userController.userDelete(req, res, next,req.params.userId);
});

users.post("/login", (req, res, next) => {
    userController.userSignin(req, res, next);
});

users.get("/getusers", (req, res, next) => {
    userController.getUsers(req, res, next);
});


module.exports = users;