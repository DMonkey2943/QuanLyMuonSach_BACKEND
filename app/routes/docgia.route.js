const express = require("express");
const dg = require("../controllers/DocGia.controller");

const router = express.Router();

router.route("/")
    .get(dg.getAllDocGia)
    .post(dg.createDocGia);    
    
router.route("/:id")
    .get(dg.getDocGiaById)
    .put(dg.updateDocGia)
    .delete(dg.deleteDocGia);

module.exports = router;