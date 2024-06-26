//express
const express = require("express");
const route = express.Router();

const checkAccessWithSecretKey = require("../../util/checkAccess");

//controller
const settingController = require("./setting.controller");

//create Setting
route.post("/create", checkAccessWithSecretKey(), settingController.store);

//update Setting
route.patch("/update", checkAccessWithSecretKey(), settingController.update);

//get setting data
route.get("/", checkAccessWithSecretKey(), settingController.index);

//handle setting switch
route.patch("/handleSwitch", checkAccessWithSecretKey(), settingController.handleSwitch);

module.exports = route;
