const { ObjectId } = require("mongodb");

const { checkForRequiredFields } = require("../../utils/Utils");
const Appointment = require("./Model");

exports.getAppointmentsForAppointer = async (req, res) => {
  try {
    const appointerId = ObjectId(req.user._id);
    const { from_date, to_date } = req.query;
    const fromDate = from_date && new Date(from_date);
    const toDate = to_date && new Date(to_date);

    const query = { appointer_id: appointerId };

    if (fromDate) {
      query.start_time = { $lte: fromDate };
    }
    if (toDate) {
      query.end_time = { $gte: toDate };
    }
    const appointments = await Appointment.find(query).lean();
    const modifiedAppointments = appointments.map((app) => ({
      ...app,
      id: app._id,
    }));
    res.json(modifiedAppointments);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.createAppointment = async (req, res) => {
  const appointerId = ObjectId(req.user._id);
  const { start_time: startTime, end_time: endTime } = req.body;

  const [hasError, errorObject] = checkForRequiredFields(req.body, [
    "patient_name",
    "patient_age",
    "agenda",
    "start_time",
    "end_time",
  ]);

  if (hasError) {
    return res.status(400).json({ errorObject, code: "invalid" });
  }

  try {
    const start_time = new Date(startTime);
    const end_time = new Date(endTime);
    await Appointment.createWithCheck({
      ...req.body,
      appointer_id: appointerId,
      start_time,
      end_time,
    });
    res.json({ message: "Appointment created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// localhost/appointments/{id}/ UPDATE
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = ObjectId(id);
    const appointerId = ObjectId(req.user._id);

    const { start_time: startTime, end_time: endTime } = req.body;
    const updateFields = { ...req.body };

    if (startTime) {
      updateFields.start_time = new Date(startTime);
    }
    if (endTime) {
      updateFields.end_time = new Date(endTime);
    }
    const existingApointment = await Appointment.findOne({
      _id: objectId,
      appointer_id: appointerId,
    });

    if (!existingApointment) {
      throw new Error("Appointment with given ID does not exist");
    }

    const updatedAppointment = await existingApointment.updateWithCheck(
      updateFields
    );
    res.json(updatedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// localhost/appointments/{id}/  DELETE
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = ObjectId(id);
    const appointerId = ObjectId(req.user._id);

    const existingApointment = await Appointment.findOne({
      _id: objectId,
      appointer_id: appointerId,
    });
    if (!existingApointment) {
      throw new Error("Appointment with given ID does not exist");
    }

    await existingApointment.deleteWithCheck();

    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//tbd
// exports.updateAppointment()
