const router = require("express").Router()              // router level
const authGuard = require("./guards/auth.guard")

const errormodelcontroller = require("../controllers/errormodel.controller")

router.get("/errormodel", errormodelcontroller.getErrormodel )

module.exports = router
