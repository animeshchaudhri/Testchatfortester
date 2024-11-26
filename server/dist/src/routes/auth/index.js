"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authController_1 = require("../../controlleres/authController");
var validations_1 = require("../../middlewares/validations");
var pusherController_1 = require("../../controlleres/pusherController");
var router = express_1.default.Router();
// api/auth/signup
router.post('/signup', validations_1.signupValidation, authController_1.signupController);
// api/auth/login
router.post('/login', validations_1.loginValidation, authController_1.loginController);
// api/auth/logout
router.post('/logout', authController_1.logoutController);
// api/auth/refresh-token
router.get('/refresh-token', authController_1.refreshController);
// api/auth/forget-password
router.get('/forgot-password/:emailId', authController_1.forgotPasswordController);
// api/auth/forget-password
router.post('/reset-password', validations_1.resetPassValidation, authController_1.resetPasswordController);
// api/auth/pusher
router.post('/pusher-auth', pusherController_1.pusherController);
exports.default = router;
