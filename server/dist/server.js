"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var app_1 = __importDefault(require("./src/app"));
// config env;
require("dotenv/config");
var port = process.env.APP_PORT || 5000;
app_1.default.set('port', port);
var server = http_1.default.createServer(app_1.default);
server.listen(port, function () {
    console.log("Server is running on http://localhost:".concat(port), process.env.APP_LEVEL);
    console.log(" \n________  ___  ___  ________  ___  ___  __       \n|\\   __  \\|\\  \\|\\  \\|\\   ____\\|\\  \\|\\  \\|\\  \\     \n\\ \\  \\|\\  \\ \\  \\\\\\  \\ \\  \\___|\\ \\  \\ \\  \\/  /|_   \n \\ \\  \\\\\\  \\ \\  \\\\\\  \\ \\  \\    \\ \\  \\ \\   ___  \\  \n  \\ \\  \\\\\\  \\ \\  \\\\\\  \\ \\  \\____\\ \\  \\ \\  \\\\ \\  \\ \n   \\ \\_____  \\ \\_______\\ \\_______\\ \\__\\ \\__\\\\ \\__\\\n    \\|___| \\__\\|_______|\\|_______|\\|__|\\|__| \\|__|\n          \\|__|                                   \n          \n          Ditch the delays, connect in a heartbeat. It's chat lightning speed.\n                                                  \n");
});
