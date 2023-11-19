const express = require("express");
const router = express.Router();

const authRouter = require("./applications/auth/Routes");
const userRouter = require("./applications/user/Routes");
const appointmentsRouter = require("./applications/appointments/Routes");

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/appointments", appointmentsRouter);

module.exports = router;
