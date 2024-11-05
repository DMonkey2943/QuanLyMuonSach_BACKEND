const mongoose = require('mongoose');
const ApiError = require("../api-error");
const TheoDoiMuonSach = require('../models/TheoDoiMuonSach.model');
const DocGia = require('../models/DocGia.model');
const Sach = require('../models/Sach.model');

exports.borrowSach = async (req, res, next) => {
    const { DocGiaId, SachId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(DocGiaId) || !mongoose.Types.ObjectId.isValid(SachId)) {
        // return res.status(400).json({ message: 'ID không hợp lệ' });
        return next(new ApiError(400, "ID không hợp lệ"));
    }

    const docgia = await DocGia.findById(DocGiaId);
    if (!docgia) {
        return next(new ApiError(404, "Độc giả không tồn tại"));
    }

    const sach = await Sach.findById(SachId);
    if (!sach) {
        return next(new ApiError(404, "Sách không tồn tại"));
    }

    try {
        const muonSach = await TheoDoiMuonSach.create({
            DocGia: DocGiaId,
            Sach: SachId,
        });
        return res.send(muonSach);
    } catch (error) {
        return next(new ApiError(500, `Mượn sách thất bại: ${error.message}`, ));
    }
};

exports.returnSach = async (req, res, next) => {
    try {
        const tdmsId = req.params.tdmsId; // Lấy ID trực tiếp từ params
        // const { tdmsId } = req.body;

        const traSach = await TheoDoiMuonSach.findByIdAndUpdate(
            tdmsId,
            { NgayTra: new Date() },
            { new: true }
        );

        if (!traSach) {
            return next(new ApiError(404, "Không tìm thấy lượt Mượn sách này!"));
        }

        return res.send(traSach);
    } catch (error) {
        return next(new ApiError(500, `Trả sách thất bại: ${error.message}`));
    }
};

exports.getAllTDMuonSach = async (req, res, next) => {
    try {
        const tdms = await TheoDoiMuonSach.find({}).populate('DocGia').populate('Sach').sort({ NgayMuon: -1 });

        return res.send(tdms);
    } catch (error) {
        return next(new ApiError(500, `Lấy danh sách các lượt Mượn sách thất bại: ${error.message}`));
    }
};

exports.getAllTDMuonSachByDocGia = async (req, res, next) => {
    try {
        const { docGiaId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(docGiaId)) {
            return next(new ApiError(400, "ID không hợp lệ"));
        }
        const tdms = await TheoDoiMuonSach.find({ DocGia: docGiaId }).populate('Sach').populate('DocGia').sort({ NgayMuon: -1 });
        
        return res.send(tdms);
    } catch (error) {
        return next(new ApiError(500, `Lấy danh sách các lượt Mượn sách của Độc giả thất bại: ${error.message}`));;
    }
};

exports.getAllTDMuonSachBySach = async (req, res, next) => {
    try {
        const { sachId } = req.params;
        const tdms = await TheoDoiMuonSach.find({ Sach: sachId }).populate('DocGia').populate('Sach').sort({ NgayMuon: -1 });
        
        return res.send(tdms);
    } catch (error) {
        return next(new ApiError(500, `Lấy danh sách các lượt Mượn sách của Sách thất bại: ${error.message}`));
    }
};

exports.getAllTDMuonSachNotReturn = async (req, res, next) => {
    try {
        const tdms = await TheoDoiMuonSach.find({ NgayTra: { $exists: false } }).populate('DocGia').populate('Sach');

        return res.send(tdms);
    } catch (error) {
        return next(new ApiError(500, `Lấy danh sách các lượt Mượn sách chưa trả thất bại: ${error.message}`));
    }
};

exports.checkSachAvailable = async (req, res, next) => {
    try {
        const { sachId } = req.params;

        // Kiểm tra số lượng sách đã mượn
        const daMuon = await TheoDoiMuonSach.countDocuments({
            Sach: sachId,
            NgayTra: { $exists: false } // Chỉ tính các bản ghi chưa có NgayTra, nghĩa là sách chưa được trả
        });
        const sach = await Sach.findById(sachId);

        const sachConLai = sach.SoQuyen - daMuon;
        
        return res.send({
            available: sachConLai > 0, //Nếu số lượng sách còn lại > 0 thì available: true
            sachConLai //Số lượng sách còn lại
        });
        // res.status(200).json({ available: conLai > 0, conLai });
    } catch (error) {
            return next(new ApiError(500, `Có lỗi xảy ra: ${error.message}`));
    }
};
