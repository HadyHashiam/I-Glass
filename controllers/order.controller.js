const cartModel = require("../models/cart.model");
const orderModel = require("../models/order.model");
const validationResult = require("express-validator").validationResult;

exports.getOrderVerify = (req, res, next) => {
    cartModel
        .getItemById(req.query.order )
        .then(cartItem => {
            res.render("deliveryDetails.ejs", {
                cart: cartItem,
                isUser: true,
                isAdmin: req.session.isAdmin,
                pageTitle: "deliveryDetails",
                validationError: req.flash("validationErrors")[0]
            });
        })
        .catch(err => res.redirect("/error"));
};

exports.getOrder = (req, res, next) => {
    orderModel
        .getOrdersByUser(req.session.userId)
        .then(items => {
            res.render("orders.ejs", {
                pageTitle: "Orders",
                isUser: true,
                isAdmin: req.session.isAdmin,
                items: items
            });
        })
        .catch(err => res.redirect("/error"));
};

// add new order from cart.ejs or home.ejs
exports.postOrder = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        orderModel
            .addNewOrder(req.body)
            .then(() => res.redirect("/orders"))
            .catch(err => {
                req.flash("validationErrors", [{ msg: "The Available quantity is stock not enough , please change the amount and save again" }]);
                res.redirect("/cart?error=quantity");
            });
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/deliveryDetails?order=" + req.body.cartId);
    }
};



exports.postCancel = (req, res, next) => {
    orderModel
        .cancelOrder(req.body.orderId)
        .then(() => res.redirect("/orders"))
        .catch(err => {
            res.redirect("/error");
        });
};
