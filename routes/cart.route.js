const router = require("express").Router();
const bodyParser = require("body-parser");
const check = require("express-validator").check;

const authGaurd = require("./guards/auth.guard");

const cartController = require("../controllers/cart.controller");


router.get("/cart", authGaurd.isAuth, cartController.getCart);

// to post data from url to cart collection
router.post(
    "/cart",
    authGaurd.isAuth,
    bodyParser.urlencoded({ extended: true }),
    cartController.postCart
);

router.delete("/cart/:productId", authGaurd.isAuth, cartController.removeItem); 

router.post(
    "/cart/save",
    authGaurd.isAuth,
    bodyParser.urlencoded({ extended: true }),

    cartController.postSave
);

router.post(
    "/cart/delete",
    authGaurd.isAuth,
    bodyParser.urlencoded({ extended: true }),
    cartController.postDelete
);


module.exports = router;
