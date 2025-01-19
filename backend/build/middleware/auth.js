"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies["auth_token"];
    if (!token) {
        return res
            .status(403)
            .json({ message: "Access Denied , No token provided" });
    }
    console.log(token);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded Token Payload:", decoded);
        req.userId = decoded.userId;
        req.isAdmin = decoded.isAdmin !== undefined ? decoded.isAdmin : false;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "invalid token" });
    }
};
exports.default = verifyToken;
