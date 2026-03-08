require('dotenv').config();
const cloudinary = require('cloudinary').v2;

const connectCloudinary = async () => {
    try {
        if (
            !process.env.CLOUDINARY_NAME ||
            !process.env.CLOUDINARY_API_KEY ||
            !process.env.CLOUDINARY_SECRET_KEY
        ) {
            throw new Error(
                'Thiếu thông tin cấu hình Cloudinary trong file .env!',
            );
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY,
            secure: true,
        });

        console.log('Đã cấu hình Cloudinary thành công!');
    } catch (error) {
        console.error('Lỗi khởi tạo Cloudinary:', error.message);
    }
};
module.exports = connectCloudinary;
