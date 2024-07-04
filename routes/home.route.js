const router = require("express").Router()              // router level
const homecontroller = require("../controllers/home.controller")


router.get("/home", homecontroller.getHomeWithCart)



module.exports = router
