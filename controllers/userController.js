require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const validator = require('validator');
const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');
const jwt = require('jsonwebtoken');
const apointmentModel = require('../models/appointmentModel');
// API to register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: 'Missing Detail',
            });
        }
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'enter a valid email',
            });
        }
        if (password.length < 8) {
            return res.json({
                success: false,
                message: 'enter a strong password',
            });
        }
        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashPassword,
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.json({
            success: true,
            token,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
        console.log(error);
    }
};

// Login to user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: 'User does not exists',
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            return res.json({
                success: true,
                token,
            });
        } else {
            return res.json({
                success: false,
                message: 'Ivalid credentials',
            });
        }
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// get data user
const getDataUser = async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await userModel.findById(userId).select('-password');
        return res.json({
            success: true,
            userData,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

const updateDataUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.json({
                success: false,
                message: 'Data Missing',
            });
        }

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender,
        });
        if (imageFile) {
            // upload file cloudinary
            const imageUpload = await cloudinary.uploader.upload(
                imageFile.path,
                {
                    resource_type: 'image',
                },
            );
            const imageURL = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, { image: imageURL });
        }
        return res.json({
            success: true,
            message: 'Profile updated',
        });
    } catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

// API to book appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;
        const docData = await doctorModel.findById(docId).select('-password');
        if (!docData.available) {
            return res.json({
                success: false,
                message: 'Doctor not available',
            });
        }

        let slots_booked = docData.slots_booked;

        // Check for available
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({
                    success: false,
                    message: 'Slot not available',
                });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userId).select('-password');

        delete docData.slots_booked;

        const appointmentData = {
            userId,
            doctorId,
            slotDate,
            slotTime,
            userData,
            amount: docData.fees,
            date: Date.now(),
        };

        const newAppointment = new apointmentModel(appointmentData);

        await newAppointment.save();

        // save new slot
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        return res.json({
            success:true, message: 'Appointment Booked'
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};
module.exports = {
    registerUser,
    loginUser,
    getDataUser,
    updateDataUser,
    bookAppointment,
};
