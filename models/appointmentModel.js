const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    doctorId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: String, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
});

const apointmentModel =
    mongoose.models.apointments ||
    mongoose.model('appointment', appointmentSchema);
module.exports = apointmentModel;
