require('dotenv').config();
const jwt = require('jsonwebtoken');
const validator = require('validator');
const doctorModel = require('../models/doctorModel');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const addDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
        } = req.body;
        const imageFile = req.file;
        if (
            !name ||
            !email ||
            !password ||
            !speciality ||
            !degree ||
            !experience ||
            !about ||
            !fees ||
            !address
        ) {
            return res.json({
                success: false,
                message: 'Missing detail',
            });
        }
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'Please enter a valid email',
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: 'Please enter a strong password',
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash('password', salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image',
        });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({
            success: true,
            message: 'Doctor Added',
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// Admin login
const loginAdmin = (req, res) => {
    try {
        const { email, password } = req.body;
        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({
                success: true,
                token,
            });
        } else {
            res.json({
                success: false,
                message: 'Invalid credentials',
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = { addDoctor, loginAdmin };
