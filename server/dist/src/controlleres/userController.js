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
exports.getProfileController = exports.updateprofileController = exports.getAllUsersController = exports.getUsersController = void 0;
var prismadb_1 = __importDefault(require("../config/prismadb"));
var ErrorResponse_1 = __importDefault(require("../error/ErrorResponse"));
/**
 * Retrieves the list of users from the database.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response containing the list of users.
 */
var getUsersController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, conversation, users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.userSession;
                // Ensure email is available in userSession
                if (!(user === null || user === void 0 ? void 0 : user.email)) {
                    return [2 /*return*/, next(ErrorResponse_1.default.forbidden('Unauthorized: no access '))];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prismadb_1.default.conversation.findMany({
                        orderBy: {
                            createdAt: 'desc',
                        },
                        where: {
                            isGroup: false,
                            userIds: {
                                has: user === null || user === void 0 ? void 0 : user.id,
                            },
                        },
                        include: {
                            users: {
                                where: {
                                    id: {
                                        not: user === null || user === void 0 ? void 0 : user.id,
                                    },
                                },
                            },
                        },
                    })];
            case 2:
                conversation = _a.sent();
                users = conversation.map(function (value) { return value.users; }).flat();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'Users fetched successfully',
                        data: users,
                    })];
            case 3:
                error_1 = _a.sent();
                console.error('Error in getUsersController:', error_1);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during get users'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUsersController = getUsersController;
/**
 * Retrieves all users from the database, excluding the current user.
 * Requires the user to be authenticated and have an email in the session.
 * Returns a JSON response with the list of users.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response with the list of users.
 */
var getAllUsersController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, users, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.userSession;
                // Ensure email is available in userSession
                if (!(user === null || user === void 0 ? void 0 : user.email)) {
                    return [2 /*return*/, next(ErrorResponse_1.default.forbidden('Unauthorized: no access '))];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prismadb_1.default.user.findMany({
                        orderBy: {
                            createdAt: 'desc',
                        },
                        where: {
                            NOT: {
                                email: user === null || user === void 0 ? void 0 : user.email,
                            },
                        },
                    })];
            case 2:
                users = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'All Users fetched successfully',
                        data: users,
                    })];
            case 3:
                error_2 = _a.sent();
                console.error('Error in getAllUsersController:', error_2);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during get all users'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAllUsersController = getAllUsersController;
/**
 * Updates a user's information.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating the success of the update operation.
 */
var updateprofileController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, name, email, username, updatedUser, token, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.userSession;
                _a = req.body, name = _a.name, email = _a.email, username = _a.username;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                if (!user) {
                    return [2 /*return*/, next(ErrorResponse_1.default.forbidden('Unauthorized: no access '))];
                }
                return [4 /*yield*/, prismadb_1.default.user.update({
                        where: {
                            id: user === null || user === void 0 ? void 0 : user.id,
                        },
                        data: {
                            name: name,
                            email: email,
                            username: username,
                        },
                    })];
            case 2:
                updatedUser = _b.sent();
                return [4 /*yield*/, prismadb_1.default.account.findFirst({
                        where: {
                            userId: user === null || user === void 0 ? void 0 : user.id,
                        },
                    })];
            case 3:
                token = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'User updated successfully',
                        data: {
                            id: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.id,
                            name: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.name,
                            username: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.username,
                            email: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.email,
                            profile: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.profile,
                            confirmToken: token === null || token === void 0 ? void 0 : token.access_token,
                        },
                    })];
            case 4:
                error_3 = _b.sent();
                console.error('Error in updateprofileController:', error_3);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during update user'))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateprofileController = updateprofileController;
/**
 * Controller function to get the user profile.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response with the user profile data.
 */
var getProfileController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, currentUser, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.userSession;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (!user) {
                    return [2 /*return*/, next(ErrorResponse_1.default.forbidden('Unauthorized: no access '))];
                }
                return [4 /*yield*/, prismadb_1.default.user.findUnique({
                        where: {
                            id: user === null || user === void 0 ? void 0 : user.id,
                        },
                    })];
            case 2:
                currentUser = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'User fetched successfully',
                        data: currentUser,
                    })];
            case 3:
                error_4 = _a.sent();
                console.error('Error in getProfileController:', error_4);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during get user'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getProfileController = getProfileController;
