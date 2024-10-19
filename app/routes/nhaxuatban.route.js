const express = require("express");
const nxb = require("../controllers/NhaXuatBan.controller");

const router = express.Router();

router.route("/")
    .get(nxb.getAllNhaXuatBan)
    .post(nxb.createNhaXuatBan);    
    
router.route("/:id")
    .get(nxb.getNhaXuatBanById)
    .put(nxb.updateNhaXuatBan)
    .delete(nxb.deleteNhaXuatBan);

module.exports = router;