"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pusherServer = void 0;
var pusher_1 = __importDefault(require("pusher"));
exports.pusherServer = new pusher_1.default({
    appId: process.env.APP_PUSHER_ID,
    key: process.env.APP_PUSHER_KEY,
    secret: process.env.APP_PUSHER_SECRET,
    cluster: process.env.APP_PUSHER_CLUSTER,
    useTLS: true,
    //encrypted: true
});
