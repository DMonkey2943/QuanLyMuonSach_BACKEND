const express = require("express");
const nv = require("../controllers/NhanVien.controller");

const router = express.Router();

router.route("/")
    .get(nv.getAllNhanVien)
    .post(nv.createNhanVien);    
    
router.route("/:id")
    .get(nv.getNhanVienById)
    .put(nv.updateNhanVien)
    .delete(nv.deleteNhanVien);

module.exports = router;