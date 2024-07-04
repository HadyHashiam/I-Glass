const router = require("express").Router()              // router level
const authGuard = require("./guards/auth.guard")

const checkoutcontroller = require("../controllers/checkout.controller")

router.get("/checkout", authGuard.isAuth,checkoutcontroller.getcheckout )

module.exports = router
