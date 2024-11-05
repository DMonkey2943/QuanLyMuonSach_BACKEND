const mongoose = require('mongoose');

const theoDoiMuonSachSchema = new mongoose.Schema({
    // Khóa ngoại DocGia._id liên kết với Độc giả
    DocGia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DOCGIA',
        required: true
    },
    // Khóa ngoại Sach._id liên kết với Sách
    Sach: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SACH',
        required: true
    },
    NgayMuon: {
        type: Date,
        default: Date.now,
        required: true
    },
    NgayTra: {
        type: Date,
        required: false
    }
});

const TheoDoiMuonSach = mongoose.model('THEODOIMUONSACH', theoDoiMuonSachSchema);

module.exports = TheoDoiMuonSach;