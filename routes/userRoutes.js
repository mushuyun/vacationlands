const express = require("express");
const router = express.Router();
const passport = require('passport');
const userController = require("../controller/userController")
const User = require("../models/user");
const cathchAsync = require("../utils/catchAsync");

router.get("/register", userController.renderRegisterForm);

router.post("/register", cathchAsync(userController.registerUser));

router.get("/login", userController.renderLoginForm);

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    successFlash: true,
    failureRedirect: '/login'
}), userController.userLogin);

router.get('/logout', userController.userLogout);

module.exports = router;