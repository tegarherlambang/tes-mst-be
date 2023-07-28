require('dotenv').config();
const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
    var token = req.headers.authorization;
    if (token) {
        // verifies secret and checks if the token is expired
        jwt.verify(
            token.replace(/^Bearer\s/, ''),
            process.env.JWT_SECRET,
            (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        status: false,
                        result: [],
                        message: "Invalid token"
                    });
                } else {
                    req.user = decoded;
                    return next();
                }
            }
        );
    } else {
        return res.status(401).json({
            status: false,
            result: [],
            message: "Token not found"
        });
    }
};

