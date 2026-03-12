const express = require('express');
const {
    addDoctor,
    loginAdmin,
    allDoctors,
} = require('../controllers/adminController');
const authAdmin = require('../middlewares/authAdmin');
const upload = require('../middlewares/multer');
const { changeAvailabliity } = require('../controllers/doctorController');
const adminRouter = express.Router();

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-doctors', authAdmin, allDoctors);
adminRouter.post('/change-availabliity', authAdmin, changeAvailabliity);

module.exports = adminRouter;
