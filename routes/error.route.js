const router = require("express").Router()              // router level


const Errorontroller = require("../controllers/error.controller")

router.get("/error", Errorontroller.getError )

module.exports = router
