const express = require("express");
const userRouter = express.Router();

const { getUsers, fetchUserData } = require("./Business");
const authenticateJWT = require("../../utils/middlewares");

userRouter.get("/", authenticateJWT, getUsers);
userRouter.get("/:id", authenticateJWT, fetchUserData);

module.exports = userRouter;
