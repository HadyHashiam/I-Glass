const router = require("express").Router()              // router level
const multer = require("multer")
const authGuard = require("./guards/auth.guard")
const contactuscontroller = require("../controllers/contactus.controller")
const check = require("express-validator").check;


router.get("/contactus", authGuard.isAuth,contactuscontroller.getContactus )

router.post("/contactus",
authGuard.isAuth,
multer().none(),
check("fullname")
    .not()
    .isEmpty()
    .withMessage("fullname is required"),
check("email")  
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid format"), 
check("phone")
    .not()
    .isEmpty()
    .withMessage("phone is required"),
check("subject")
    .not()
    .isEmpty()
    .withMessage("subject is required"),
check("message")
    .not()
    .isEmpty()
    .withMessage("message is required"),
contactuscontroller.postContactus )  

module.exports = router
