const doctorModel = require('../models/doctorModel');

const changeAvailabliity = async (req, res) => {
    try {
        const { docId } = req.body;

        const docData = await doctorModel.findById(docId);

        await doctorModel.findByIdAndUpdate(docId, {
            available: !docData.available,
        });

        res.json({
            success: true,
            message: 'Available Changed',
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

const doctorsList = async (req, res) => {
    try {
        const doctors = await doctorModel
            .find({})
            .select(['-password', '-email']);
        res.json({
            success: true,
            doctors,
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
        console.log(error);
    }
};

module.exports = {
    changeAvailabliity,
    doctorsList,
};
