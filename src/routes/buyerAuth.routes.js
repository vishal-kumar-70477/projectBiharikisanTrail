const express = require("express")
const buyerAuthController = require("../controllers/buyerAuth.controller")
const buyerAuthRouter = express.Router();


buyerAuthRouter.post("/register",buyerAuthController.register)
buyerAuthRouter.post("/otp-verification",buyerAuthController.otpVerification)
buyerAuthRouter.post("/login",buyerAuthController.login)
buyerAuthRouter.get("/logout",buyerAuthController.logout)





module.exports = buyerAuthRouter;