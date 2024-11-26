"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userController_1 = require("../../controlleres/userController");
var router = express_1.default.Router();
//api/users/get-users
router.get('/get-users', userController_1.getUsersController);
//api/users/all
router.get('/all', userController_1.getAllUsersController);
//api/users/profile
router.get('/profile', userController_1.getProfileController);
//api/users/update-profile
router.put('/update-profile', userController_1.updateprofileController);
exports.default = router;
