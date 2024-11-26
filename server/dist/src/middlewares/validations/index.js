"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassValidation = exports.loginValidation = exports.signupValidation = void 0;
var loginValidation_1 = __importDefault(require("./loginValidation"));
exports.loginValidation = loginValidation_1.default;
var signupValidation_1 = __importDefault(require("./signupValidation"));
exports.signupValidation = signupValidation_1.default;
var resetPassValidation_1 = __importDefault(require("./resetPassValidation"));
exports.resetPassValidation = resetPassValidation_1.default;
