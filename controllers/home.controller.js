const productsModel = require("../models/products.model");
const cartModel = require("../models/cart.model");
const favModel = require("../models/fav.model");

exports.getHomeWithCart = (req, res, next) => {
    let category = req.query.category;
    let validCategory = ["Men Eye Glasses", "Men Sun Glasses", "Women Eye Glasses", "Women Sun Glasses", "Kids Glasses"];
    let productsPromise;

    if (category && validCategory.includes(category)) {
        productsPromise = productsModel.getProductsByCategory(category);
    } else {
        productsPromise = productsModel.getAllProducts();
    }
    productsPromise.then(products => {
        cartModel.getItemsByUser(req.session.userId)
            .then(cartItems => {
                favModel.getItemsByUser(req.session.userId)
                    .then(favItems => {
                        const cartProductIds = cartItems.map(item => item.productId);
                        const favProductIds = favItems.map(item => item.productId);
                        
                        products.forEach(product => {
                            product.isFavorite = favProductIds.includes(product._id);
                        });
                        let totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);
                        res.render('home.ejs', {
                            products: products,
                            itemsInCart: cartProductIds,
                            itemsInFav: favProductIds,
                            totalPrice: totalPrice,
                            isUser: req.session.userId,
                            isAdmin: req.session.isAdmin,
                            pageTitle: "Home"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.redirect("/error");
                    });
            })
            .catch(err => {
                console.log(err);
                res.redirect("/error");
            });
    })
    .catch(err => {
        console.log(err);
        res.redirect("/error");
    });
};
