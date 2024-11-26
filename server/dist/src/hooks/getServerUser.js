"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerUser = void 0;
var helpers_1 = require("../helpers");
var error_1 = require("../error");
var jwtOption_1 = require("../config/jwtOption");
var getServerUser = function (req, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    var secret = jwtOption_1.jwtConfig.ACCESS_TOKEN.secret;
    try {
        if (token) {
            var session = (0, helpers_1.verifyToken)(token, secret);
            return session.data;
        }
        else {
            return next(error_1.ErrorResponse.unauthorized('Unauthorized: Token is missing'));
        }
    }
    catch (error) {
        return next(error_1.ErrorResponse.badRequest('something went wrong'));
    }
};
exports.getServerUser = getServerUser;
