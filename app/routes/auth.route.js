const express = require("express");
const auth = require("../controllers/Auth.controller");
const authMdw = require("../middlewares/authentication.middleware");

const router = express.Router();

router.post("/register", auth.registerDocGia);
router.post("/login", auth.login);
router.post("/logout", authMdw.checkRole(['admin', 'nhanvien', 'docgia']), auth.logout);

module.exports = router;