"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var chatsController_1 = require("../../controlleres/chatsController");
var msgController_1 = require("../../controlleres/msgController");
var router = express_1.default.Router();
// Get messages by chat ID
router.get('/msg/get-messages/:Id', msgController_1.getMessagesController);
// Create a new message
router.post('/msg/create-msg', msgController_1.createMessagesControllerr);
// Get all chats
router.get('/get-chats', chatsController_1.getChatController);
// Get all group chats
router.get('/get-groupchats', chatsController_1.getGroupChatController);
// Get a single chat by ID
router.get('/get-chats/:Id', chatsController_1.getSingleChatController);
// Mark a chat as seen
router.get('/:Id/seen', chatsController_1.getChatByParamsController);
// Create a new chat
router.post('/create-chat', chatsController_1.getcreateChatController);
// Add members to a chat
router.patch('/add-members', chatsController_1.updateChatController);
// Delete a chat by ID
router.delete('/delete-chat/:Id', chatsController_1.deleteChatController);
exports.default = router;
