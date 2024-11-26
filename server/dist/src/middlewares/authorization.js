"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
var ErrorResponse_1 = __importDefault(require("../error/ErrorResponse"));
var helpers_1 = require("../helpers");
var jwtOption_1 = require("../config/jwtOption");
var authenticate = function (req, res, next) {
    var _a, _b;
    try {
        // Extract access token from cookies or headers
        var accessToken = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
        if (!accessToken)
            return next(ErrorResponse_1.default.unauthorized('Unauthorized access.'));
        // Verify token
        var secret = jwtOption_1.jwtConfig.ACCESS_TOKEN.secret;
        var decode = (0, helpers_1.verifyToken)(accessToken, secret);
        if (!decode || !decode.data || !decode.data.email || !decode.data.id) {
            return next(ErrorResponse_1.default.unauthorized('Invalid token data'));
        }
        // If token is valid, attach user data to request object
        req.userSession = decode.data;
        // Proceed to the next middleware or route handler
        return next();
    }
    catch (err) {
        console.error('Error in userAuthorization middleware:', err);
        return next(ErrorResponse_1.default.badRequest('something went wrong'));
    }
};
exports.authenticate = authenticate;
