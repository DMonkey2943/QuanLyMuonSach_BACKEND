const express = require("express");
const cors = require("cors");
const ApiError = require("./app/api-error");
const nhaXuatBanRouter = require("./app/routes/nhaxuatban.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/nhaxuatban", nhaXuatBanRouter);

app.get("/", (req, res) => {
    res.json({ message: "Home page" });
});

// handle 404 response
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;