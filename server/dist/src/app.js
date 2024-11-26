"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var morgan_1 = __importDefault(require("morgan"));
var express_1 = __importDefault(require("express"));
var routes_1 = __importDefault(require("./routes"));
var middlewares_1 = require("./middlewares");
var error_1 = require("./error");
// Create an Express application
var app = (0, express_1.default)();
// app middlewares
app.use(middlewares_1.middleware);
//logger
app.use((0, morgan_1.default)(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
    ].join(' ');
}));
// api/routes
app.use(routes_1.default);
// Error handlers
app.use(error_1.errorHandler);
app.use(error_1.notFoundHandler); // 404 route handler
exports.default = app;
