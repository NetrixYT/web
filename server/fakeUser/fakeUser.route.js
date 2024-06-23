//express
const express = require("express");
const route = express.Router();

const checkAccessWithSecretKey = require("../../util/checkAccess");

//controller
const UserController = require("./fakeUser.controller");

route.post("/create", checkAccessWithSecretKey(), UserController.fakeUser);

route.get("/", checkAccessWithSecretKey(), UserController.get);

module.exports = route;
