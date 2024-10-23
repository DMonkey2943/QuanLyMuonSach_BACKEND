const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ApiError = require("../api-error");
const NhanVien = require('../models/NhanVien.model');

exports.createNhanVien = async (req, res, next) => {
    if (!req.body?.HoTen || !req.body?.Email || !req.body?.MatKhau ||
        !req.body?.DiaChi || !req.body?.DienThoai) {
        return next(new ApiError(400, "Vui lòng điền đầy đủ thông tin"));
    }

    const { HoTen, Email, MatKhau, DiaChi, DienThoai } = req.body;
    const hashedMatKhau = await bcrypt.hash(MatKhau, 10);

    try {
        const nhanvien = await NhanVien.create({ HoTen, Email, MatKhau: hashedMatKhau, DiaChi, DienThoai });
        return res.send(nhanvien);
    } catch (error) {
        return next(new ApiError(500, `Thêm mới Nhân viên thất bại: ${error.message}`));
    }
};

exports.getAllNhanVien = async (req, res, next) => {
    try {
        const nhanvien = await NhanVien.find({}).select('-MatKhau');
        return res.send(nhanvien);
    } catch (error) {
        return next(new ApiError(500, "Lấy danh sách Nhân viên thất bại!"));
    }
};

exports.getNhanVienById = async (req, res, next) => {
    try {
        const nhanvien = await NhanVien.findById(req.params.id).select('-MatKhau');

        if (!nhanvien) {
            return next(new ApiError(404, "Không tìm thấy Nhân viên"));
        }

        return res.send(nhanvien);
    } catch (error) {
        return next(new ApiError(500, "Lấy thông tin Nhân viên thất bại!"));
    }
};

exports.updateNhanVien = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { HoTen, Email, DiaChi, DienThoai } = req.body;

        const nhanvien = await NhanVien.findByIdAndUpdate(
            id,
            { HoTen, Email, DiaChi, DienThoai },
            { new: true, runValidators: true }
        ).select('-MatKhau');

        if (!nhanvien) {
            return next(new ApiError(404, "Không tìm thấy Nhân viên"));
        }
        
        return res.send(nhanvien);
    } catch (error) {
        return next(new ApiError(500, "Cập nhật Nhân viên thất bại"));
    }
};

exports.deleteNhanVien = async (req, res, next) => {
    try {
        const { id } = req.params;
        const nhanvien = await NhanVien.findByIdAndDelete(id);

        if (!nhanvien) {
            return next(new ApiError(404, "Không tìm thấy Nhân viên"));
        }

        return res.send({ message: "Xóa Nhân viên thành công" });
    } catch (error) {
        return next(new ApiError(500, "Xóa Nhân viên thất bại"));
    }
};
