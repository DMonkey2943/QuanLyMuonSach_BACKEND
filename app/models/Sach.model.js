const mongoose = require('mongoose');

const sachSchema = new mongoose.Schema({
    TenSach: {
        type: String,
        required: true
    },
    TacGia: {
        type: String,
        required: true
    },
    DonGia: {
        type: Number,
        required: true
    },
    SoQuyen: {
        type: Number,
        required: true
    },
    NamXuatBan: {
        type: Number,
        required: true
    },
    HinhAnh: {
        type: String,
        required: true
    },
    // Khóa ngoại MANXB liên kết với nhà xuất bản
    NhaXuatBan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NHAXUATBAN',
        required: true
    },
});

const Sach = mongoose.model('SACH', sachSchema);

module.exports = Sach;