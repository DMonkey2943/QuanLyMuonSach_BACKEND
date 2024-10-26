const jwt = require('jsonwebtoken');
const ApiError = require("../api-error");

exports.checkRole = (roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(new ApiError(401, "Unauthorized"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Bạn không có quyền truy cập' })
            };
            next();
        } catch (error) {
            return next(new ApiError(401, `Token không hợp lệ: ${error.message}`));
        }
    }
}