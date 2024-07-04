
const cartModel = require("../models/cart.model");
const validationResult = require("express-validator").validationResult;

exports.getCart = (req, res, next) => {
    cartModel.getItemsByUser(req.session.userId)
        .then(items => {
            let totalPrice = items.reduce((acc, item) => acc + item.price, 0);
            res.render("cart.ejs", {
                items: items,
                totalPrice: totalPrice,
                isUser: true,
                isAdmin: req.session.isAdmin,
                pageTitle: "Cart",
                errorMessage: req.flash("validationErrors")[0] 
            });
        })
        .catch(err => {
            res.redirect("/error");
        });
};



exports.postCart = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        cartModel
            .addNewItem({
                name: req.body.name,
                price: req.body.price,
                amount: req.body.amount,
                image : req.body.image,
                userId: req.session.userId,
                productId: req.body._id,
                timestamp: Date.now()
            })
            .then(() => {
                console.log("item added to cart")

                res.end();
            })
            .catch(err => {
                res.redirect("/error");
            });
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect(req.body.redirectTo);
    }
    
};

exports.postSave = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        cartModel
            .editItem(req.body.cartId, {
                amount: req.body.amount,
                timestamp: Date.now()
            })
            .then(() => res.redirect("/cart") ,
            console.log("item updated to cart"))
            .catch(err => res.redirect("/error"));
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/cart");
    }
};

exports.postDelete = (req, res, next) => {
    cartModel
        .deleteItem(req.body.cartId)
        .then(() => res.redirect("/cart"),
        console.log('Item removed from cart'))
        .catch(err => res.redirect("/error"));
};

// exports.postDelete = (req, res, next) => {
//     cartModel
//         .deleteItem(req.body.cartId)
//         .then(() =>
//         console.log('Item removed from cart'),
//             res.redirect("/cart")
//         ).catch(err =>
//             console.log('Error removing item from cart:', err),
//             res.redirect("/error"));
// };


exports.removeItem = (req, res, next) => {
const userId = req.session.userId;
cartModel.deleteItem3(userId)
    .then(() => {
        console.log('Item removed from cart');
        res.sendStatus(204); 
    })
    .catch(err => {
    console.error('Error removing item from cart:', err);
    res.redirect("/error");
    });
};
