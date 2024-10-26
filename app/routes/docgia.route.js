const express = require("express");
const dg = require("../controllers/DocGia.controller");
const authMdw = require("../middlewares/authentication.middleware");

const router = express.Router();

const allowedRoles = ["nhanvien", "admin"];

router.route("/")
    .get(authMdw.checkRole(allowedRoles), dg.getAllDocGia)
    .post(authMdw.checkRole(allowedRoles), dg.createDocGia);    
    
router.route("/:id")
    .get( dg.getDocGiaById)
    .put(authMdw.checkRole(allowedRoles), dg.updateDocGia)
    .delete(authMdw.checkRole(allowedRoles), dg.deleteDocGia);

module.exports = router;