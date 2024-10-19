const mongoose = require('mongoose');

const nhaXuatBanSchema = new mongoose.Schema({
    TenNXB: {
        type: String,
        required: true
    },
    DiaChi: {
        type: String,
        required: true
    },
});

const NhaXuatBan = mongoose.model('NHAXUATBAN', nhaXuatBanSchema);

module.exports = NhaXuatBan;