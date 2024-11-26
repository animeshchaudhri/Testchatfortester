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
exports.generateToken = exports.verifyToken = exports.generatePass = exports.profilePicGenerator = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Generates a URL for a profile picture based on the given username.
 * @param username The username used to generate the profile picture URL.
 * @returns A URL for the profile picture.
 */
var profilePicGenerator = function (username) {
    var baseURL = 'https://avatar.iran.liara.run/public/';
    var profilePicURL = "".concat(baseURL, "?username=").concat(encodeURIComponent(username));
    return profilePicURL;
};
exports.profilePicGenerator = profilePicGenerator;
/**
 * Generates a hashed password using bcrypt with a specified number of salt rounds.
 * @param password The password to be hashed.
 * @returns A promise that resolves to the hashed password.
 */
var generatePass = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    var saltRounds, hashedPassword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                saltRounds = Number(process.env.APP_SALT_ROUNDS) || 10;
                return [4 /*yield*/, bcrypt_1.default.hash(password, saltRounds)];
            case 1:
                hashedPassword = _a.sent();
                return [2 /*return*/, hashedPassword];
        }
    });
}); };
exports.generatePass = generatePass;
/**
 * Verifies a token using jwt with a specified secret.
 * @param token The user authentication token to be verified.
 * @param secret The secret used to verify the token.
 * @returns The decoded jwt token.
 */
var verifyToken = function (token, secret) {
    var decodedToken = jsonwebtoken_1.default.verify(token, secret);
    return decodedToken;
};
exports.verifyToken = verifyToken;
/**
 * Generates a token using the provided payload, secret, and expiry.
 * @param payload - The payload to be included in the token.
 * @param secret - The secret key used to sign the token.
 * @param expiry - The expiration time for the token.
 * @returns The generated token.
 */
var generateToken = function (payload, secret, expiry) {
    var generatedToken = jsonwebtoken_1.default.sign({ key: payload }, secret, { expiresIn: expiry });
    return generatedToken;
};
exports.generateToken = generateToken;
