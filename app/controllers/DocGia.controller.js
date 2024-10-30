const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ApiError = require("../api-error");
const DocGia = require('../models/DocGia.model');

exports.createDocGia = async (req, res, next) => {
    if (!req.body?.HoTen || !req.body?.Email || !req.body?.MatKhau ||
        !req.body?.Phai || !req.body?.DiaChi || !req.body?.DienThoai) {
        return next(new ApiError(400, "Vui lòng điền đầy đủ thông tin"));
    }

    const { HoTen, Email, MatKhau, Phai, DiaChi, DienThoai } = req.body;
    const hashedMatKhau = await bcrypt.hash(MatKhau, 10);

    try {
        const docgia = await DocGia.create({ HoTen, Email, MatKhau: hashedMatKhau, Phai, DiaChi, DienThoai });
        return res.send(docgia);
    } catch (error) {
        return next(new ApiError(500, `Thêm mới Độc giả thất bại: ${error.message}`));
    }
};

exports.getAllDocGia = async (req, res, next) => {
    try {
        // const docgia = await DocGia.find({}).select('-MatKhau');
        const docgia = await DocGia.find({});
        return res.send(docgia);
    } catch (error) {
        return next(new ApiError(500, "Lấy danh sách Độc giả thất bại!"));
    }
};

exports.getDocGiaById = async (req, res, next) => {
    try {
        const docgia = await DocGia.findById(req.params.id);

        if (!docgia) {
            return next(new ApiError(404, "Không tìm thấy Độc giả"));
        }

        return res.send(docgia);
    } catch (error) {
        return next(new ApiError(500, "Lấy thông tin Độc giả thất bại!"));
    }
};

exports.updateDocGia = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { HoTen, Email, Phai, DiaChi, DienThoai } = req.body;

        const docgia = await DocGia.findByIdAndUpdate(
            id,
            { HoTen, Email, Phai, DiaChi, DienThoai },
            { new: true, runValidators: true }
        ).select('-MatKhau');

        if (!docgia) {
            return next(new ApiError(404, "Không tìm thấy Độc giả"));
        }
        
        return res.send(docgia);
    } catch (error) {
        return next(new ApiError(500, "Cập nhật Độc giả thất bại"));
    }
};

exports.deleteDocGia = async (req, res, next) => {
    try {
        const { id } = req.params;
        const docgia = await DocGia.findByIdAndDelete(id);

        if (!docgia) {
            return next(new ApiError(404, "Không tìm thấy Độc giả"));
        }

        return res.send({ message: "Xóa Độc giả thành công" });
    } catch (error) {
        return next(new ApiError(500, "Xóa Độc giả thất bại"));
    }
};
