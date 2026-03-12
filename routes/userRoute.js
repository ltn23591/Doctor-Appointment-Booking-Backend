const express = require('express');
const {
    registerUser,
    loginUser,
    getDataUser,
    updateDataUser,
} = require('../controllers/userController');
const authUser = require('../middlewares/authUser');
const multer = require('../middlewares/multer');
const upload = require('../middlewares/multer');
const userRoute = express.Router();

userRoute.post('/register', registerUser);
userRoute.post('/login', loginUser);
userRoute.get('/get-profile', authUser, getDataUser);
userRoute.post(
    '/update-profile',
    upload.single('image'),
    authUser,
    updateDataUser,
);

module.exports = userRoute;
