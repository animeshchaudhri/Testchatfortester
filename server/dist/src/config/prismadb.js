"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
function createPrismaClient() {
    try {
        return new client_1.PrismaClient();
    }
    catch (error) {
        console.error('Error connecting to Prisma:', error);
        process.exit(1); // Exit the process as Prisma connectivity is essential for the application
    }
}
var db = globalThis.prisma || createPrismaClient();
if (process.env.APP_NODE_ENV !== 'production')
    globalThis.prisma = db;
exports.default = db;
