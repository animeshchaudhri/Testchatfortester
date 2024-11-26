"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.middleware = void 0;
var authorization_1 = require("./authorization");
Object.defineProperty(exports, "authenticate", { enumerable: true, get: function () { return authorization_1.authenticate; } });
var middleware_1 = __importDefault(require("./middleware"));
exports.middleware = middleware_1.default;
