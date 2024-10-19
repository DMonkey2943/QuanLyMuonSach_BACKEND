const mongoose = require('mongoose');
const ApiError = require("../api-error");
const Sach = require('../models/Sach.model');
const NhaXuatBan = require('../models/NhaXuatBan.model');

exports.createSach = async (req, res, next) => {
    if (!req.body?.TenSach || !req.body?.TacGia || !req.body?.DonGia  || !req.body?.SoQuyen  || !req.body?.NamXuatBan || !req.body?.HinhAnh || !req.body?.NXBId) {
        return next(new ApiError(400, "Vui lòng điền đầy đủ thông tin"));
    }

    const { TenSach, TacGia, DonGia, SoQuyen, NamXuatBan, HinhAnh, NXBId } = req.body;

    const nxb = await NhaXuatBan.findById(NXBId);
    if (!nxb) {
        return next(new ApiError(404, "NXB không tồn tại"));
    }

    try {
        const sach = await Sach.create({
            TenSach, TacGia, DonGia, SoQuyen, NamXuatBan, HinhAnh,
            NhaXuatBan: NXBId
        });
        return res.send(sach);
    } catch (error) {
        return next(new ApiError(500, `Thêm mới Sách thất bại: ${error.message}`, ));
    }
};

exports.getAllSach = async (req, res, next) => {
    try {
        const sach = await Sach.find({}).populate('NhaXuatBan', 'TenNXB');
        return res.send(sach);
    } catch (error) {
        return next(new ApiError(500, `Lấy danh sách Sách thất bại: ${error.message}`));
    }
};

exports.getSachById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sach = await Sach.findById(id).populate('NhaXuatBan', 'TenNXB');

        if (!sach) {
            return next(new ApiError(404, "Không tìm thấy Sách"));
        }

        return res.send(sach);
    } catch (error) {
        return next(new ApiError(500, `Lấy thông tin Sách thất bại: ${error.message}`));
    }
};

exports.updateSach = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { TenSach, TacGia, DonGia, SoQuyen, NamXuatBan, HinhAnh, NXBId } = req.body;
        const sach = await Sach.findByIdAndUpdate(
            id,
            { TenSach, TacGia, DonGia, SoQuyen, NamXuatBan, HinhAnh, NhaXuatBan: NXBId },
            { new: true, runValidators: true }
        );

        if (!sach) {
            return next(new ApiError(404, "Không tìm thấy Sách"));
        }
        
        return res.send(sach);
    } catch (error) {
        return next(new ApiError(500, `Cập nhật Sách thất bại: ${error.message}`));
    }
};

exports.deleteSach = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sach = await Sach.findByIdAndDelete(id);

        if (!sach) {
            return next(new ApiError(404, "Không tìm thấy Sách"));
        }

        return res.send({ message: "Xóa Sách thành công" });
    } catch (error) {
        return next(new ApiError(500, `Xóa Sách thất bại: ${error.message}`));
    }
};
