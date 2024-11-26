"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordController = exports.forgotPasswordController = exports.refreshController = exports.logoutController = exports.loginController = exports.signupController = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var prismadb_1 = __importDefault(require("../config/prismadb"));
var jwtOption_1 = require("../config/jwtOption");
var ErrorResponse_1 = __importDefault(require("../error/ErrorResponse"));
var mail_helper_1 = require("../helpers/mail.helper");
var auth_helper_1 = require("../helpers/auth.helper");
var helpers_1 = require("../helpers");
/**
 * Handles user signup by creating a new user account, generating access and refresh tokens,
 * and setting cookies with the tokens.
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction object.
 * @returns A JSON response indicating the success or failure of the signup process.
 */
var signupController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, username, email, password, hashedpass, profilePic, newUser, emailTemplatePath, emailContent, payload, _b, accessToken, refreshToken, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.validData || { name: '', username: '', email: '', password: '' }, name = _a.name, username = _a.username, email = _a.email, password = _a.password;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                return [4 /*yield*/, (0, helpers_1.generatePass)(password)];
            case 2:
                hashedpass = _c.sent();
                profilePic = (0, helpers_1.profilePicGenerator)(username);
                return [4 /*yield*/, prismadb_1.default.user.create({
                        data: {
                            name: name,
                            username: username,
                            email: email,
                            hashedPassword: hashedpass,
                            profile: profilePic,
                        },
                    })];
            case 3:
                newUser = _c.sent();
                emailTemplatePath = "./src/utils/template/welcome-email.html";
                return [4 /*yield*/, (0, mail_helper_1.compileHTMLEmailTemplate)(emailTemplatePath, {
                        user_name: newUser.name,
                        start_Url: "".concat(process.env.APP_WEB_URL, "/chats"),
                    })];
            case 4:
                emailContent = _c.sent();
                // send mail
                return [4 /*yield*/, (0, mail_helper_1.sendMail)(email, 'Welcome to Quick - Chat with the Speed of Life!', emailContent)];
            case 5:
                // send mail
                _c.sent();
                payload = {
                    id: newUser.id,
                    name: name,
                    email: email,
                    username: username,
                };
                req.session.user = payload;
                return [4 /*yield*/, (0, auth_helper_1.generateAccessTokenAndRefreshToken)({ payload: payload })];
            case 6:
                _b = _c.sent(), accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                // Set cookies with tokens
                res.cookie('authToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.APP_NODE_ENV === 'production', // Set to true in production
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.APP_NODE_ENV === 'production', // Set to true in production
                    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
                });
                // Send success response with user data and access token
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'Account created successfully',
                        data: {
                            id: newUser.id,
                            name: newUser.name,
                            username: newUser.username,
                            email: newUser.email,
                            profile: newUser.profile,
                            confirmToken: accessToken,
                        },
                    })];
            case 7:
                err_1 = _c.sent();
                console.error('Error in signupController:', err_1);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during signup'))];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.signupController = signupController;
/**
 * Authenticates a user by email and password, and generates access and refresh tokens upon successful login.
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @returns A JSON response indicating the success or failure of the login process.
 */
var loginController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, validationErrors, user, match, payload, _b, accessToken, refreshToken, err_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.signUpData || { email: '', password: '' }, email = _a.email, password = _a.password;
                validationErrors = {};
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                return [4 /*yield*/, prismadb_1.default.user.findFirst({
                        where: { email: email },
                    })];
            case 2:
                user = _c.sent();
                // invalid email
                if (!user) {
                    validationErrors['email'] = ['Did you mistype your email address?'];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.hashedPassword)];
            case 3:
                match = _c.sent();
                if (!match) {
                    validationErrors['password'] = ['Oops! The password you entered does not match.'];
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: validationErrors,
                        })];
                }
                payload = {
                    id: user === null || user === void 0 ? void 0 : user.id,
                    name: user === null || user === void 0 ? void 0 : user.name,
                    email: user === null || user === void 0 ? void 0 : user.email,
                    username: user === null || user === void 0 ? void 0 : user.username,
                };
                // Store user details in session
                req.session.user = payload;
                return [4 /*yield*/, (0, auth_helper_1.generateAccessTokenAndRefreshToken)({ payload: payload })];
            case 4:
                _b = _c.sent(), accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                // Set cookies with tokens
                res.cookie('authToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.APP_NODE_ENV === 'production', // Set to true in production
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                });
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.APP_NODE_ENV === 'production', // Set to true in production
                    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days (adjust as needed)
                });
                // Send success response with user data and access token
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'Logged in successfully',
                        data: {
                            id: user === null || user === void 0 ? void 0 : user.id,
                            name: user === null || user === void 0 ? void 0 : user.name,
                            username: user === null || user === void 0 ? void 0 : user.username,
                            email: user === null || user === void 0 ? void 0 : user.email,
                            profile: user === null || user === void 0 ? void 0 : user.profile,
                            confirmToken: accessToken,
                        },
                    })];
            case 5:
                err_2 = _c.sent();
                console.log(err_2);
                return [2 /*return*/, res.status(400).json({
                        success: false,
                        message: validationErrors,
                    })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.loginController = loginController;
/**
 * Logs out the user by clearing authentication cookies and destroying the session.
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction for error handling.
 * @returns A JSON response indicating the success or failure of the logout process.
 */
var logoutController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.body.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (!userId) {
                    return [2 /*return*/, next(ErrorResponse_1.default.notFound('User ID not found in session'))];
                }
                // Remove user account from the database
                return [4 /*yield*/, prismadb_1.default.account.deleteMany({
                        where: {
                            userId: userId,
                        },
                    })];
            case 2:
                // Remove user account from the database
                _a.sent();
                // Clear the auth token cookie
                res.clearCookie('authToken', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
                // Clear the refresh token cookie
                res.clearCookie('refreshToken', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
                // Destroy the session
                req.session.destroy(function (err) {
                    if (err) {
                        console.error('Error destroying session:', err);
                        return next(ErrorResponse_1.default.badRequest('An error occurred during logout'));
                    }
                    return res.status(200).json({
                        success: true,
                        message: 'Logged out successfully',
                    });
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error('Error in logoutController:', error_1);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during logout'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.logoutController = logoutController;
/**
 * create new  generates access and refresh tokens upon
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction for error handling.
 * @returns A JSON response indicating the success or failure of the forgetpassword process.
 */
var refreshController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, authHeader, accessToken_1, userAccount, secret, decode, user, payload, _a, accessToken, newRefreshToken, error_2;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
        switch (_l.label) {
            case 0:
                _l.trys.push([0, 5, , 6]);
                refreshToken = (_b = req.cookies) === null || _b === void 0 ? void 0 : _b.refreshToken;
                if (!!refreshToken) return [3 /*break*/, 2];
                authHeader = req.headers['authorization'];
                accessToken_1 = authHeader && authHeader.split(' ')[1];
                if (!accessToken_1) {
                    return [2 /*return*/, next(ErrorResponse_1.default.badRequest('Access token is required'))];
                }
                return [4 /*yield*/, prismadb_1.default.account.findFirst({ where: { access_token: accessToken_1 } })];
            case 1:
                userAccount = _l.sent();
                if (!userAccount) {
                    return [2 /*return*/, next(ErrorResponse_1.default.badRequest('Invalid access token'))];
                }
                refreshToken = userAccount.refresh_token;
                _l.label = 2;
            case 2:
                // Ensure refresh token is available
                if (!refreshToken) {
                    return [2 /*return*/, next(ErrorResponse_1.default.badRequest('Refresh token is required'))];
                }
                secret = jwtOption_1.jwtConfig.REFRESH_TOKEN.secret;
                decode = (0, helpers_1.verifyToken)(refreshToken, secret);
                return [4 /*yield*/, prismadb_1.default.user.findFirst({
                        where: { id: (_c = decode === null || decode === void 0 ? void 0 : decode.data) === null || _c === void 0 ? void 0 : _c.id },
                    })];
            case 3:
                user = _l.sent();
                payload = {
                    id: (_d = decode === null || decode === void 0 ? void 0 : decode.data) === null || _d === void 0 ? void 0 : _d.id,
                    name: (_e = decode === null || decode === void 0 ? void 0 : decode.data) === null || _e === void 0 ? void 0 : _e.name,
                    email: (_f = decode === null || decode === void 0 ? void 0 : decode.data) === null || _f === void 0 ? void 0 : _f.email,
                    username: decode.data.username,
                };
                return [4 /*yield*/, (0, auth_helper_1.generateAccessTokenAndRefreshToken)({ payload: payload })];
            case 4:
                _a = _l.sent(), accessToken = _a.accessToken, newRefreshToken = _a.refreshToken;
                // Set cookies with new tokens
                res.cookie('authToken', accessToken, {
                    httpOnly: true,
                    secure: process.env.APP_NODE_ENV === 'production',
                    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
                });
                res.cookie('refreshToken', newRefreshToken, {
                    httpOnly: true,
                    secure: process.env.APP_NODE_ENV === 'production',
                    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
                });
                // Send the new tokens in the response
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'Tokens refreshed successfully',
                        data: {
                            id: (_g = decode === null || decode === void 0 ? void 0 : decode.data) === null || _g === void 0 ? void 0 : _g.id,
                            name: (_h = decode === null || decode === void 0 ? void 0 : decode.data) === null || _h === void 0 ? void 0 : _h.name,
                            username: (_j = decode === null || decode === void 0 ? void 0 : decode.data) === null || _j === void 0 ? void 0 : _j.username,
                            email: (_k = decode === null || decode === void 0 ? void 0 : decode.data) === null || _k === void 0 ? void 0 : _k.email,
                            profile: user === null || user === void 0 ? void 0 : user.profile,
                            confirmToken: accessToken,
                        },
                    })];
            case 5:
                error_2 = _l.sent();
                console.error('Error in refreshController:', error_2);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during refreshing token'))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.refreshController = refreshController;
/**
 * create new password by destorying the old password
 * @param req The Express Request object.
 * @param res The Express Response object.
 * @param next The Express NextFunction for error handling.
 * @returns A JSON response indicating the success or failure of the refreshtoken process.
 */
var forgotPasswordController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var email, validationErrors, user, secret, payload, expiry, token, url, emailTemplatePath, emailContent, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.params.emailId;
                validationErrors = {};
                // validating email
                if (!email ||
                    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
                    return [2 /*return*/, next(ErrorResponse_1.default.badRequest('Enter your email'))];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, prismadb_1.default.user.findFirst({
                        where: { email: email },
                    })];
            case 2:
                user = _a.sent();
                // invalid email
                if (!user) {
                    validationErrors['email'] = ['Did you mistype your email address?'];
                    return [2 /*return*/, res.status(400).json({
                            success: false,
                            message: validationErrors,
                        })];
                }
                secret = jwtOption_1.jwtConfig.RESET_PASSWORD_TOKEN.secret;
                payload = user.email;
                expiry = jwtOption_1.jwtConfig.RESET_PASSWORD_TOKEN.expiry;
                token = (0, helpers_1.generateToken)(payload, secret, expiry);
                url = "".concat(process.env.APP_WEB_URL, "/forget-pass/").concat(token);
                emailTemplatePath = "./src/utils/template/reset-password-email.html";
                return [4 /*yield*/, (0, mail_helper_1.compileHTMLEmailTemplate)(emailTemplatePath, {
                        resetUrl: url,
                    })];
            case 3:
                emailContent = _a.sent();
                // send mail
                return [4 /*yield*/, (0, mail_helper_1.sendMail)(email, 'Forgot Password Link', emailContent)];
            case 4:
                // send mail
                _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'A password reset link has been sent to your email.',
                    })];
            case 5:
                error_3 = _a.sent();
                console.error('Error in forgotPasswordController:', error_3);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during forget password'))];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.forgotPasswordController = forgotPasswordController;
/**
 * Handles the reset password functionality.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating the success or failure of the password reset.
 */
var resetPasswordController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, token, password, secret, decode, hashedpass, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.resetPass || { password: '', token: '' }, token = _a.token, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                secret = jwtOption_1.jwtConfig.RESET_PASSWORD_TOKEN.secret;
                decode = (0, helpers_1.verifyToken)(token, secret);
                if (!decode.key)
                    return [2 /*return*/, next(ErrorResponse_1.default.forbidden('Invalid reset link'))];
                return [4 /*yield*/, (0, helpers_1.generatePass)(password)];
            case 2:
                hashedpass = _b.sent();
                // updateing to db
                return [4 /*yield*/, prismadb_1.default.user.update({
                        where: { email: decode.key },
                        data: {
                            hashedPassword: hashedpass,
                        },
                    })];
            case 3:
                // updateing to db
                _b.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'Password updated successfully',
                    })];
            case 4:
                error_4 = _b.sent();
                if (error_4.name === 'TokenExpiredError')
                    return [2 /*return*/, next(ErrorResponse_1.default.forbidden('The Reset link has expired, please request a new one.'))];
                else if (error_4.name)
                    return [2 /*return*/, next(ErrorResponse_1.default.forbidden('Invalid reset link'))];
                console.error('Error in resetPasswordController:', error_4);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during reset password'))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.resetPasswordController = resetPasswordController;
