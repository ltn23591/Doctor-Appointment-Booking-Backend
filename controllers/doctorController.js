const doctorModel = require('../models/doctorModel');

const changeAvailabliity = async (req, res) => {
    try {
        const { docId } = req.body;

        const docData = await doctorModel.findById(docId);

        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available});

        res.json({
            success:true,
            message: 'Available Changed'
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
    changeAvailabliity,
};
