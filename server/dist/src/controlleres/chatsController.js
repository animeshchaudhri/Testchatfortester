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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChatController = exports.deleteChatController = exports.getcreateChatController = exports.getChatByParamsController = exports.getSingleChatController = exports.getGroupChatController = exports.getChatController = void 0;
var prismadb_1 = __importDefault(require("../config/prismadb"));
var pusher_1 = require("../config/pusher");
var ErrorResponse_1 = __importDefault(require("../error/ErrorResponse"));
/**
 * Retrieves conversations for the current user.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response with the fetched conversations.
 */
var getChatController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, conversations, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.userSession;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                // Ensure email is available in userSession
                if (!(user === null || user === void 0 ? void 0 : user.email)) {
                    return [2 /*return*/, next(ErrorResponse_1.default.forbidden('Unauthorized: Invalid group chat data'))];
                }
                return [4 /*yield*/, prismadb_1.default.conversation.findMany({
                        orderBy: {
                            lastMessageAt: 'desc',
                        },
                        where: {
                            isGroup: false,
                            userIds: {
                                has: user === null || user === void 0 ? void 0 : user.id,
                            },
                        },
                        include: {
                            users: true,
                            messages: {
                                include: {
                                    seen: true,
                                    sender: true,
                                },
                            },
                        },
                    })];
            case 2:
                conversations = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'chats founded',
                        data: conversations,
                    })];
            case 3:
                error_1 = _a.sent();
                console.error('Error in getConversationsController:', error_1);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during get chats'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getChatController = getChatController;
/**
 * Retrieves Group conversations for the current user.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response with the fetched conversations.
 */
var getGroupChatController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, conversations, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.userSession;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                // Ensure email is available in userSession
                if (!(user === null || user === void 0 ? void 0 : user.email)) {
                    return [2 /*return*/, next(ErrorResponse_1.default.forbidden('Unauthorized: Invalid group chat data'))];
                }
                return [4 /*yield*/, prismadb_1.default.conversation.findMany({
                        orderBy: {
                            lastMessageAt: 'desc',
                        },
                        where: {
                            isGroup: true,
                            userIds: {
                                has: user === null || user === void 0 ? void 0 : user.id,
                            },
                        },
                        include: {
                            users: true,
                            messages: {
                                include: {
                                    seen: true,
                                    sender: true,
                                },
                            },
                        },
                    })];
            case 2:
                conversations = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'chats founded',
                        data: conversations,
                    })];
            case 3:
                error_2 = _a.sent();
                console.error('Error in getGroupChatController:', error_2);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during get Group chats'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getGroupChatController = getGroupChatController;
/**
 * Retrieves a single chat based on the provided Id.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns The JSON response containing the fetched conversation.
 */
var getSingleChatController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var Id, conversations, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                Id = req.params.Id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prismadb_1.default.conversation.findMany({
                        where: {
                            id: Id,
                        },
                        include: {
                            users: true,
                        },
                    })];
            case 2:
                conversations = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'converstaion founded',
                        data: conversations,
                    })];
            case 3:
                error_3 = _a.sent();
                console.error('Error is getSingleChatController:', error_3);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during get single chats'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getSingleChatController = getSingleChatController;
/**
 * Retrieves a conversation by its ID and returns the conversation data along with the last message.
 * Also updates the "seen" status of the last message and triggers pusher events.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns The conversation data and the updated message.
 */
var getChatByParamsController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, Id, conversation, lastMessage, updatedMessage, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.userSession;
                Id = req.params.Id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                if (!user) {
                    return [2 /*return*/, next(ErrorResponse_1.default.unauthorized('unauthorized'))];
                }
                return [4 /*yield*/, prismadb_1.default.conversation.findUnique({
                        where: {
                            id: Id,
                        },
                        include: {
                            messages: {
                                include: {
                                    seen: true,
                                },
                            },
                            users: true,
                        },
                    })];
            case 2:
                conversation = _a.sent();
                if (!conversation) {
                    return [2 /*return*/, next(ErrorResponse_1.default.badRequest('Invalid ID'))];
                }
                lastMessage = conversation.messages[conversation.messages.length - 1];
                if (!lastMessage) {
                    return [2 /*return*/, res.status(200).json({
                            success: true,
                            message: 'conversation not started yet',
                        })];
                }
                return [4 /*yield*/, prismadb_1.default.message.update({
                        where: {
                            id: lastMessage.id,
                        },
                        include: {
                            sender: true,
                            seen: true,
                        },
                        data: {
                            seen: {
                                connect: {
                                    id: user === null || user === void 0 ? void 0 : user.id,
                                },
                            },
                        },
                    })];
            case 3:
                updatedMessage = _a.sent();
                return [4 /*yield*/, pusher_1.pusherServer.trigger(Id, 'message:update', updatedMessage)];
            case 4:
                _a.sent();
                return [4 /*yield*/, pusher_1.pusherServer.trigger(user === null || user === void 0 ? void 0 : user.email, 'conversation:update', {
                        id: Id,
                        isGroup: conversation.isGroup,
                        messages: [updatedMessage],
                    })];
            case 5:
                _a.sent();
                if (lastMessage.seenIds.indexOf(user.id) !== -1) {
                    return [2 /*return*/, res.status(200).json({
                            success: true,
                            message: 'conversation founded',
                        })];
                }
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'updatedMessage',
                    })];
            case 6:
                error_4 = _a.sent();
                console.error('Error is getChatByParamsController:', error_4);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during get messages'))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getChatByParamsController = getChatByParamsController;
/**
 * Handles the creation of a chat or retrieval of an existing chat.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating the success status and the created/retrieved chat data.
 */
var getcreateChatController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, userId, isGroup, members, name, newConversation_1, existingConversations, singleConversation, newConversation_2, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.userSession;
                _a = req.body, userId = _a.chatId, isGroup = _a.isGroup, members = _a.members, name = _a.name;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                if (!(user === null || user === void 0 ? void 0 : user.id) || !(user === null || user === void 0 ? void 0 : user.email)) {
                    return [2 /*return*/, next(ErrorResponse_1.default.badRequest('Unauthorized'))];
                }
                if (isGroup && (!members || members.length < 2 || !name)) {
                    return [2 /*return*/, next(ErrorResponse_1.default.unauthorized('Add two members and a group name to create a group chat'))];
                }
                if (!isGroup) return [3 /*break*/, 3];
                return [4 /*yield*/, prismadb_1.default.conversation.create({
                        data: {
                            name: name,
                            isGroup: isGroup,
                            users: {
                                connect: __spreadArray(__spreadArray([], members.map(function (member) { return ({ id: member.value }); }), true), [{ id: user.id }], false),
                            },
                        },
                        include: {
                            users: true,
                        },
                    })];
            case 2:
                newConversation_1 = _b.sent();
                newConversation_1.users.forEach(function (user) {
                    if (user.email) {
                        pusher_1.pusherServer.trigger(user.email, 'conversation:new', newConversation_1);
                    }
                });
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'Group chat created successfully',
                        data: newConversation_1,
                    })];
            case 3: return [4 /*yield*/, prismadb_1.default.conversation.findMany({
                    where: {
                        OR: [{ userIds: { equals: [user.id, userId] } }, { userIds: { equals: [userId, user.id] } }],
                    },
                })];
            case 4:
                existingConversations = _b.sent();
                singleConversation = existingConversations[0];
                if (singleConversation) {
                    return [2 /*return*/, res.status(200).json({
                            success: true,
                            message: 'Chat found or created successfully',
                            data: singleConversation,
                        })];
                }
                return [4 /*yield*/, prismadb_1.default.conversation.create({
                        data: {
                            isGroup: false,
                            users: {
                                connect: [
                                    {
                                        id: user.id,
                                    },
                                    {
                                        id: userId,
                                    },
                                ],
                            },
                        },
                        include: {
                            users: true,
                        },
                    })];
            case 5:
                newConversation_2 = _b.sent();
                newConversation_2.users.map(function (user) {
                    if (user.email) {
                        pusher_1.pusherServer.trigger(user.email, 'conversation:new', newConversation_2);
                    }
                });
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'Chat found or created successfully',
                        data: newConversation_2,
                    })];
            case 6:
                error_5 = _b.sent();
                console.error('Error in getChatController:', error_5);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during create chat'))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getcreateChatController = getcreateChatController;
/**
 * Deletes a chat conversation.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating the success of the operation and the deleted conversation data.
 */
var deleteChatController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var Id, user, existingConversation_1, deletedConversation, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                Id = req.params.Id;
                user = req.userSession;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, prismadb_1.default.conversation.findUnique({
                        where: {
                            id: Id,
                        },
                        include: {
                            users: true,
                        },
                    })];
            case 2:
                existingConversation_1 = _b.sent();
                if (!existingConversation_1) {
                    return [2 /*return*/, next(ErrorResponse_1.default.badRequest('Invalid ID'))];
                }
                return [4 /*yield*/, prismadb_1.default.conversation.deleteMany({
                        where: {
                            id: Id,
                            userIds: {
                                hasSome: [(_a = user === null || user === void 0 ? void 0 : user.id) !== null && _a !== void 0 ? _a : ''],
                            },
                        },
                    })];
            case 3:
                deletedConversation = _b.sent();
                existingConversation_1.users.forEach(function (user) {
                    if (user.email) {
                        pusher_1.pusherServer.trigger(user.email, 'conversation:remove', existingConversation_1);
                    }
                });
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'conversation deleted successfully',
                        data: deletedConversation,
                    })];
            case 4:
                error_6 = _b.sent();
                console.error('Error is deleteChatController:', error_6);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during delete chat'))];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteChatController = deleteChatController;
/**
 * update chat members.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response indicating the success of the operation and the deleted conversation data.
 */
var updateChatController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, _a, groupId, isGroup, members, updatedGroup_1, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.userSession;
                _a = req.body, groupId = _a.groupId, isGroup = _a.isGroup, members = _a.members;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                if (!(user === null || user === void 0 ? void 0 : user.id) || !(user === null || user === void 0 ? void 0 : user.email)) {
                    return [2 /*return*/, next(ErrorResponse_1.default.badRequest('Unauthorized'))];
                }
                if (isGroup && !members) {
                    return [2 /*return*/, next(ErrorResponse_1.default.unauthorized('Unauthorized: Invalid group chat data'))];
                }
                return [4 /*yield*/, prismadb_1.default.conversation.update({
                        where: { id: groupId },
                        data: {
                            users: {
                                connect: __spreadArray(__spreadArray([], members.map(function (member) { return ({ id: member.value }); }), true), [{ id: user.id }], false),
                            },
                        },
                        include: {
                            users: true,
                        },
                    })];
            case 2:
                updatedGroup_1 = _b.sent();
                updatedGroup_1.users.forEach(function (user) {
                    if (user.email) {
                        pusher_1.pusherServer.trigger(user.email, 'conversation:new', updatedGroup_1);
                    }
                });
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'Group chat udpated successfully',
                        // data: updatedGroup,
                    })];
            case 3:
                error_7 = _b.sent();
                console.error('Error in updateChatController:', error_7);
                return [2 /*return*/, next(ErrorResponse_1.default.badRequest('An error occurred during add member'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateChatController = updateChatController;
