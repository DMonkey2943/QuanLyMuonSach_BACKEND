const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require("../api-error");
const DocGia = require('../models/DocGia.model');
const NhanVien = require('../models/NhanVien.model');

exports.registerDocGia = async (req, res, next) => {
    const { HoTen, Email, MatKhau, Phai, DiaChi, DienThoai } = req.body;

    if (!req.body?.HoTen || !req.body?.Email || !req.body?.MatKhau ||
        Phai==null || !req.body?.DiaChi || !req.body?.DienThoai) {
        
        return next(new ApiError(400, "Vui lòng điền đầy đủ thông tin"));
    }
    
    try {
        const ExistDocgia = await DocGia.find({ Email });
        if (ExistDocgia.length != 0) {
            console.log(ExistDocgia);
            return next(new ApiError(400, "Email đã được người khác đăng ký"));
        }

        const hashedMatKhau = await bcrypt.hash(MatKhau, 10);

        const docgia = await DocGia.create({ HoTen, Email, MatKhau: hashedMatKhau, Phai, DiaChi, DienThoai });
        return res.send(docgia);
    } catch (error) {
        return next(new ApiError(500, `Đăng ký tài khoản thất bại: ${error.message}`));
    }
};

exports.login = async (req, res, next) => {
    if (!req.body?.Email || !req.body?.MatKhau) {
        return next(new ApiError(400, "Vui lòng điền đầy đủ thông tin"));
    }

    const { Email, MatKhau, VaiTro } = req.body;
    try {
        let user;
        if (VaiTro === 'nhanvien') {
            user = await NhanVien.findOne({ Email });
        } else if (VaiTro === 'docgia') {
            user = await DocGia.findOne({ Email });
        }
    
        if (!user) {
            return next(new ApiError(400, "Email không tồn tại"));
        }
    
        const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
        if (!isMatch) {
            return next(new ApiError(400, "Mật khẩu không đúng"));
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.ChucVu || 'docgia'
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" },
        );

        return res.json({ token });
    } catch (error) {
        return next(new ApiError(500, `Đăng nhập thất bại: ${error.message}`));
    }
};

exports.logout = async (req, res, next) => {

}