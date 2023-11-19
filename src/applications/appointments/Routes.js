const express = require("express");
const authenticateJWT = require("../../utils/middlewares");
const {
  createAppointment,
  getAppointmentsForAppointer,
  updateAppointment,
  deleteAppointment,
} = require("./Business");
const appointmentsRouter = express.Router();

appointmentsRouter.post("/", authenticateJWT, createAppointment);
appointmentsRouter.get("/", authenticateJWT, getAppointmentsForAppointer);
appointmentsRouter.put("/:id", authenticateJWT, updateAppointment);
appointmentsRouter.delete("/:id", authenticateJWT, deleteAppointment);

module.exports = appointmentsRouter;
