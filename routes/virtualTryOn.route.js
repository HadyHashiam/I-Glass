const router = require("express").Router()              // router level

const virtualTryOncontroller = require("../controllers/virtualTryOn.controller")
const authGuard = require("./guards/auth.guard")

router.get("/virtualTryOn", authGuard.isAuth ,virtualTryOncontroller.getvirtualTryOn )

router.post("/bestStyle", authGuard.isAuth ,virtualTryOncontroller.postrundetection )

router.get("/bestStyle", authGuard.isAuth ,virtualTryOncontroller.getrundetection )


module.exports = router
