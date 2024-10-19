const express = require("express");
const sach = require("../controllers/Sach.controller");

const router = express.Router();

router.route("/")
    .get(sach.getAllSach)
    .post(sach.createSach);    
    
router.route("/:id")
    .get(sach.getSachById)
    .put(sach.updateSach)
    .delete(sach.deleteSach);

module.exports = router;