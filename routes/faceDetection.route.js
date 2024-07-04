const router = require("express").Router()              // router level
const authGuard = require("./guards/auth.guard")

const faceDetectioncontroller = require("../controllers/faceDetection.controller")

router.get("/faceDetection",authGuard.isAuth, faceDetectioncontroller.getfaceDetection )

module.exports = router
