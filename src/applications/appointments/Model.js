const Mongoose = require("mongoose");

const AppointmentSchema = new Mongoose.Schema({
  patient_name: {
    type: String,
    required: true,
  },
  patient_age: {
    type: Number,
    required: true,
  },
  agenda: {
    type: String,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        // Custom validation logic
        return value < this.end_time; // Ensure fromDate is less than or equal to toDate
      },
      message: "Start time must be less than End time",
    },
  },
  end_time: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        // Custom validation logic
        return value > this.start_time; // Ensure fromDate is less than or equal to toDate
      },
      message: "End time must be greater than Start time",
    },
  },
  summary: {
    type: String,
    required: false,
  },
  appointer_id: {
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

// Custom function to create an appointment with overlapping check
AppointmentSchema.statics.createWithCheck = async function (appointmentData) {
  const overlappingAppointments = await this.find({
    start_time: { $lt: appointmentData.end_time },
    end_time: { $gt: appointmentData.start_time },
  });

  if (overlappingAppointments.length > 0) {
    throw new Error("Appointment overlaps with an existing appointment.");
  }

  return this.create(appointmentData);
};

// Custom function to update an appointment with overlapping check
AppointmentSchema.methods.updateWithCheck = async function (updateData) {
  const overlappingAppointments = await this.model("Appointment").find({
    _id: { $ne: this._id }, // Exclude the current appointment from the check
    start_time: { $lt: updateData.end_time },
    end_time: { $gt: updateData.start_time },
  });

  if (overlappingAppointments.length > 0) {
    throw new Error("Appointment overlaps with an existing appointment.");
  }

  // Check for ongoing appointments before updating
  const ongoingAppointments = await this.model("Appointment").find({
    _id: { $ne: this._id },
    start_time: { $lt: new Date() },
    end_time: { $gt: new Date() },
  });

  if (ongoingAppointments.length > 0) {
    throw new Error(
      "Cannot update/delete appointment. Ongoing appointments exist."
    );
  }

  Object.assign(this, updateData); // Update the appointment data
  return this.save();
};

// Custom function to delete an appointment with ongoing check
AppointmentSchema.methods.deleteWithCheck = async function () {
  // Check for ongoing appointments before deletion
  const ongoingAppointments = await this.model("Appointment").find({
    _id: { $ne: this._id },
    start_time: { $lt: new Date() },
    end_time: { $gt: new Date() },
  });

  if (ongoingAppointments.length > 0) {
    throw new Error("Cannot delete appointment. Ongoing appointments exist.");
  }

  return this.remove();
};

const Appointment = Mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
