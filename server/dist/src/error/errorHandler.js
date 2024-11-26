"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
var ErrorResponse_1 = __importDefault(require("./ErrorResponse"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var errorHandler = function (err, req, res, next) {
    console.error(err);
    if (err instanceof ErrorResponse_1.default) {
        return res.status(err.status).json({
            success: false,
            status: err.status,
            message: err.message,
        });
    }
    return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
};
exports.errorHandler = errorHandler;
// 404 route handler
var notFoundHandler = function (req, res) {
    res.status(404).json({ success: false, status: 404, message: 'Not found' });
};
exports.notFoundHandler = notFoundHandler;
