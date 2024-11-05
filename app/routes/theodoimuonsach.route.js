const express = require("express");
const tdms = require("../controllers/TheoDoiMuonSach.controller");

const router = express.Router();

// router.route("/")
//     .get(tdms.getAllTDMuonSach)
//     .post(tdms.createTDMuonSach);
    
// router.route("/:id")
//     .get(tdms.getTDMuonSachById)
//     .put(tdms.updateTDMuonSach)
//     .delete(tdms.deleteTDMuonSach);

router.route("/").get(tdms.getAllTDMuonSach);
router.route("/docgia/:docGiaId").get(tdms.getAllTDMuonSachByDocGia);
router.route("/sach/:sachId").get(tdms.getAllTDMuonSachBySach);
router.route("/muonsach").post(tdms.borrowSach);
router.route("/trasach/:tdmsId").put(tdms.returnSach);
// router.route("/trasach").post(tdms.returnSach);
router.route("/kiemTraSachCoSan/:sachId").get(tdms.checkSachAvailable);

module.exports = router;