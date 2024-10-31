const mongoose = require('mongoose');
const ApiError = require("../api-error");
const Sach = require('../models/Sach.model');
const NhaXuatBan = require('../models/NhaXuatBan.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình lưu trữ cho multer
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage });

exports.createSach = [
    upload.single('HinhAnh'),
    async (req, res, next) => {
        if (!req.body?.TenSach || !req.body?.TacGia || !req.body?.DonGia  || !req.body?.SoQuyen  || !req.body?.NamXuatBan || !req.body?.NXBId) {
            return next(new ApiError(400, "Vui lòng điền đầy đủ thông tin"));
        }

        let { TenSach, TacGia, DonGia, SoQuyen, NamXuatBan, NXBId } = req.body;
        let HinhAnh = req.file ? req.file.path : null;

        try {
            let nxb = await NhaXuatBan.findById(NXBId);
            if (!nxb) {
                return next(new ApiError(404, "NXB không tồn tại"));
            }

            HinhAnh = HinhAnh.replace(/\\/g, '/')

            let sach = await Sach.create({
                TenSach, TacGia, DonGia, SoQuyen, NamXuatBan, HinhAnh,
                NhaXuatBan: NXBId
            });
            return res.send(sach);
        } catch (error) {
            return next(new ApiError(500, `Thêm mới Sách thất bại: ${error.message}`, ));
        }
    }
];

exports.getAllSach = async (req, res, next) => {
    try {
        const sach = await Sach.find({}).populate('NhaXuatBan', 'TenNXB');

        // Thêm URL đầy đủ cho ảnh
        const sachWithImageUrl = sach.map(item => ({
            ...item.toObject(),
            HinhAnh: item.HinhAnh ? `${req.protocol}://${req.get('host')}/${item.HinhAnh}` : null
        }));

        return res.send(sachWithImageUrl);
    } catch (error) {
        return next(new ApiError(500, `Lấy danh sách Sách thất bại: ${error.message}`));
    }
};

exports.getSachById = async (req, res, next) => {
    try {
        const { id } = req.params;
        let sach = await Sach.findById(id).populate('NhaXuatBan', 'TenNXB');

        if (!sach) {
            return next(new ApiError(404, "Không tìm thấy Sách"));
        }

        let sachWithImageUrl = {
            ...sach.toObject(),
            HinhAnh: sach.HinhAnh ? `${req.protocol}://${req.get('host')}/${sach.HinhAnh}` : null
        }

        return res.send(sachWithImageUrl);
    } catch (error) {
        return next(new ApiError(500, `Lấy thông tin Sách thất bại: ${error.message}`));
    }
};

exports.updateSach = [
    upload.single('HinhAnh'),
    async (req, res, next) => {
    try {
        const { id } = req.params;
        const { TenSach, TacGia, DonGia, SoQuyen, NamXuatBan, NXBId } = req.body;

         // Tìm sách để lấy thông tin ảnh cũ
        const sach = await Sach.findById(id);
        if (!sach) {
            return next(new ApiError(404, "Không tìm thấy Sách"));
        }

        // Kiểm tra xem có tệp ảnh mới được upload hay không
        const newImagePath = req.file ? req.file.path : sach.HinhAnh;

        // Nếu có ảnh mới và ảnh cũ tồn tại, xóa ảnh cũ
        if (req.file && sach.HinhAnh) {
            const oldImagePath = path.join(__dirname, '..', '..', sach.HinhAnh);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error(`Lỗi khi xóa ảnh cũ: ${err}`);
            });
        }

        // Cập nhật sách với thông tin mới
        sach.TenSach = TenSach;
        sach.TacGia = TacGia;
        sach.DonGia = DonGia;
        sach.SoQuyen = SoQuyen;
        sach.NamXuatBan = NamXuatBan;
        sach.HinhAnh = newImagePath.replace(/\\/g, '/');
        sach.NhaXuatBan = NXBId;

        await sach.save();
        
        return res.send(sach);
    } catch (error) {
        console.log(req.body);
        return next(new ApiError(500, `Cập nhật Sách thất bại: ${error.message}`));
    }
    }
];

exports.deleteSach = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sach = await Sach.findByIdAndDelete(id);

        if (!sach) {
            return next(new ApiError(404, "Không tìm thấy Sách"));
        }

        // Kiểm tra nếu sách có ảnh, xóa ảnh đó
        if (sach.HinhAnh) {
            const imagePath = path.join(__dirname, '..', '..', sach.HinhAnh);
            fs.unlink(imagePath, (err) => {
                if (err) console.error(`Lỗi khi xóa ảnh: ${err}`);
            });
        }

        return res.send({ message: "Xóa Sách thành công" });
    } catch (error) {
        return next(new ApiError(500, `Xóa Sách thất bại: ${error.message}`));
    }
};
