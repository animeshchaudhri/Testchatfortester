"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = __importDefault(require("./auth"));
var user_1 = __importDefault(require("./user"));
var chat_1 = __importDefault(require("./chat"));
var middlewares_1 = require("../middlewares");
var router = express_1.default.Router();
// auth routes
router.use('/api/auth', auth_1.default);
//chats routes
router.use('/api/chats', middlewares_1.authenticate, chat_1.default);
//user routes
router.use('/api/users', middlewares_1.authenticate, user_1.default);
router.use('/api', function (req, res) {
    res.status(200).json({ success: true, message: 'The API is up and running.' });
});
exports.default = router;
