const mongoose = require('mongoose');

const nhanVienSchema = new mongoose.Schema({
    HoTen: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    MatKhau: {
        type: String,
        required: true
    },
    ChucVu: {
        type: String,
        default: 'nhanvien',
        required: true
    },
    DiaChi: {
        type: String,
        required: true
    },
    DienThoai: {
        type: String,
        required: true
    },
});

const NhanVien = mongoose.model('NHANVIEN', nhanVienSchema);

module.exports = NhanVien;