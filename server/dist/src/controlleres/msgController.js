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
exports.createMessagesControllerr = exports.getMessagesController = void 0;
var uuid_1 = require("uuid");
var prismadb_1 = __importDefault(require("../config/prismadb"));
var error_1 = require("../error");
var pusher_1 = require("../config/pusher");
/**
 * Retrieves messages for a given conversation ID.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns A JSON response with the retrieved messages.
 */
var getMessagesController = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var Id, message, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                Id = req.params.Id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, prismadb_1.default.message.findMany({
                        where: {
                            conversationId: Id,
                        },
                        include: {
                            sender: true,
                            seen: true,
                        },
                        orderBy: {
                            createdAt: 'asc',
                        },
                    })];
            case 2:
                message = _a.sent();
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'message founded',
                        data: message,
                    })];
            case 3:
                error_2 = _a.sent();
                console.error('Error is getMessageController:', error_2);
                return [2 /*return*/, next(error_1.ErrorResponse.badRequest('An error occurred during get messages'))];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getMessagesController = getMessagesController;
/**
 * Creates a new message and updates the conversation with the new message.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @returns The response with the created message data.
 */
var createMessagesControllerr = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, instant_id, _a, message, image, conversationId, newMessage_1, updatedConversation_1, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                user = req.userSession;
                instant_id = (0, uuid_1.v4)();
                _a = req.body, message = _a.message, image = _a.image, conversationId = _a.conversationId;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, pusher_1.pusherServer.trigger(conversationId, 'instant:message', {
                        id: instant_id,
                        sender: {
                            id: user === null || user === void 0 ? void 0 : user.id,
                            name: user === null || user === void 0 ? void 0 : user.name,
                            email: user === null || user === void 0 ? void 0 : user.email,
                            profile: "https://avatar.iran.liara.run/public/?username=".concat(user === null || user === void 0 ? void 0 : user.username),
                            createdAt: new Date().toISOString(),
                        },
                        message: message,
                    })];
            case 2:
                _b.sent();
                return [4 /*yield*/, prismadb_1.default.message.create({
                        data: {
                            body: message,
                            image: image,
                            conversation: {
                                connect: {
                                    id: conversationId,
                                },
                            },
                            sender: {
                                connect: {
                                    id: user === null || user === void 0 ? void 0 : user.id,
                                },
                            },
                            seen: {
                                connect: {
                                    id: user === null || user === void 0 ? void 0 : user.id,
                                },
                            },
                        },
                        include: {
                            seen: true,
                            sender: true,
                        },
                    })];
            case 3:
                newMessage_1 = _b.sent();
                return [4 /*yield*/, prismadb_1.default.conversation.update({
                        where: {
                            id: conversationId,
                        },
                        data: {
                            lastMessageAt: new Date(),
                            messages: {
                                connect: {
                                    id: newMessage_1.id,
                                },
                            },
                        },
                        include: {
                            users: true,
                            messages: {
                                include: {
                                    seen: true,
                                },
                            },
                        },
                    })];
            case 4:
                updatedConversation_1 = _b.sent();
                return [4 /*yield*/, pusher_1.pusherServer.trigger(conversationId, 'messages:new', {
                        id: instant_id,
                        chatId: conversationId,
                        isGroup: updatedConversation_1.isGroup,
                        message: newMessage_1,
                    })];
            case 5:
                _b.sent();
                updatedConversation_1.users.forEach(function (user) {
                    if (user === null || user === void 0 ? void 0 : user.email) {
                        pusher_1.pusherServer.trigger(user.email, 'conversation:update', {
                            id: conversationId,
                            isGroup: updatedConversation_1.isGroup,
                            message: [newMessage_1],
                        });
                    }
                });
                return [2 /*return*/, res.status(200).json({
                        success: true,
                        message: 'Message created successfully',
                    })];
            case 6:
                error_3 = _b.sent();
                console.error('Error is createMessageController:', error_3);
                return [2 /*return*/, next(error_1.ErrorResponse.badRequest('An error occurred during create messages'))];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.createMessagesControllerr = createMessagesControllerr;
