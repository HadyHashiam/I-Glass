const router = require("express").Router()              // router level

const welcomeontroller = require("../controllers/welcome.controller")

router.get("/welcome", welcomeontroller.getwelcome )

module.exports = router
