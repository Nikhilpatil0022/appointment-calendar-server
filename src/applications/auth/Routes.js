const express = require("express");
const authRouter = express.Router();

const { register, login, user } = require("./Business");
const authenticateJWT = require("../../utils/middlewares");

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/user", authenticateJWT, user);

module.exports = authRouter;
