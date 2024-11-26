"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var express_1 = __importDefault(require("express"));
var express_session_1 = __importDefault(require("express-session"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var express_rate_limit_1 = __importDefault(require("express-rate-limit"));
var limiterOptions = {
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 1000, // Limit each IP to 1000 requests per `window`
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many request from this IP. Please try again after an hour',
};
var corsOptions = {
    //origin: process.env.APP_WEB_URL || 'http://localhost:3000',
    origin: ['http://localhost:3000', 'http://192.168.156.37:3000', 'https://quickv.vercel.app'],
    credentials: true,
    optionsSuccessStatus: 200,
};
var sessionOptions = {
    secret: process.env.APP_SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days (adjust as needed)
    },
};
var middleware = [
    //requestLogger, // logger custom middleware
    (0, express_rate_limit_1.default)(limiterOptions), // requist limiter
    (0, helmet_1.default)(), // set security HTTP headers
    (0, cors_1.default)(corsOptions),
    express_1.default.json(),
    (0, cookie_parser_1.default)(),
    express_1.default.urlencoded({ extended: true }),
    (0, express_session_1.default)(sessionOptions),
];
exports.default = middleware;
