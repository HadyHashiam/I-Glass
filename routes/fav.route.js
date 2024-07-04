const router = require("express").Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check;

const authGaurd = require("./guards/auth.guard");

const favController = require("../controllers/fav.controller");


router.post(
    "/favorites",
    authGaurd.isAuth,
    bodyParser.urlencoded({ extended: true }),
    favController.postFav
);

router.delete("/favorites/:productId", authGaurd.isAuth, favController.removeItem); 
router.delete("/favorites/delete", authGaurd.isAuth, favController.removeItem); 




module.exports = router





