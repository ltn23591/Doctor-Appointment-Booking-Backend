const express = require('express');
const { doctorsList } = require('../controllers/doctorController');
const doctorRouter = express.Router();

doctorRouter.post('/list', doctorsList);

module.exports = doctorRouter;