const router = require("express").Router()           
const authGuard = require("./guards/auth.guard")

const aboutuscontroller = require("../controllers/aboutus.controller")

router.get("/aboutus", aboutuscontroller.getAboutus )

module.exports = router
