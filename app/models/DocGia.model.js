const mongoose = require('mongoose');

const docGiaSchema = new mongoose.Schema({
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
    // NgaySinh: {
    //     type: Date,
    //     required: true
    // },
    Phai: {
        type: Boolean,
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

const DocGia = mongoose.model('DOCGIA', docGiaSchema);

module.exports = DocGia;