const mongoose = require('mongoose');
const ApiError = require("../api-error");
const NhaXuatBan = require('../models/NhaXuatBan.model');

exports.createNhaXuatBan = async (req, res, next) => {
    if (!req.body?.TenNXB || !req.body?.DiaChi) {
        return next(new ApiError(400, "Vui lòng điền đầy đủ thông tin"));
    }

    const { TenNXB, DiaChi } = req.body;

    try {
        const nxb = await NhaXuatBan.create({ TenNXB, DiaChi });
        return res.send(nxb);
    } catch (error) {
        return next(new ApiError(500, "Thêm mới NXB thất bại!"));
    }
};

exports.getAllNhaXuatBan = async (req, res, next) => {
    try {
        const nxb = await NhaXuatBan.find({});
        return res.send(nxb);
    } catch (error) {
        return next(new ApiError(500, "Lấy danh sách NXB thất bại!"));
    }
};

exports.getNhaXuatBanById = async (req, res, next) => {
    try {
        const nxb = await NhaXuatBan.findById(req.params.id);

        if (!nxb) {
            return next(new ApiError(404, "Không tìm thấy NXB"));
        }

        return res.send(nxb);
    } catch (error) {
        return next(new ApiError(500, "Lấy thông tin NXB thất bại!"));
    }
};

exports.updateNhaXuatBan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { TenNXB, DiaChi } = req.body;

        const nxb = await NhaXuatBan.findByIdAndUpdate(
            id,
            { TenNXB, DiaChi },
            { new: true, runValidators: true }
        );

        if (!nxb) {
            return next(new ApiError(404, "Không tìm thấy NXB"));
        }
        
        return res.send(nxb);
    } catch (error) {
        return next(new ApiError(500, "Cập nhật NXB thất bại"));
    }
};

exports.deleteNhaXuatBan = async (req, res, next) => {
    try {
        const { id } = req.params;
        const nxb = await NhaXuatBan.findByIdAndDelete(id);

        if (!nxb) {
            return next(new ApiError(404, "Không tìm thấy NXB"));
        }

        return res.send({ message: "Xóa NXB thành công" });
    } catch (error) {
        return next(new ApiError(500, "Xóa NXB thất bại"));
    }
};
