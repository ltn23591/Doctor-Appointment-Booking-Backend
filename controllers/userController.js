require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');
const validator = require('validator');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
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
        res.json({
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
            return res.json({ success: false, message: 'Ivalid credentials' });
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
        const { userId } = req.body;
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
        const { userId, name, phone, address, dob, gender } = req.body;
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
        res.json({
            success: true,
            message: 'Profile updated',
        });
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
};
