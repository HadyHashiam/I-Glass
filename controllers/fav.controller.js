const favModel = require("../models/fav.model");
const validationResult = require("express-validator").validationResult;




exports.removeItem = (req, res, next) => {
    const productId = req.params.productId;
    const userId = req.session.userId;
    favModel.deleteItem(productId, userId)
        .then(() => {
            res.sendStatus(204); 
        })
        .catch(err => {
            console.error('Error removing item from favorites:', err);
            res.status(500).send('Error removing item from favorites');
        });
};
exports.postFav = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    favModel
      .addNewItem({
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        userId: req.session.userId,
        productId: req.body._id,
        timestamp: Date.now()
      })
      .then(() => {
        console.log("item added to favorites ");
        res.end();
      })  
      .catch(err => {
        res.redirect("/error");
      });
  } else {  
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/favorites");
  }
};  

exports.postDelete = (req, res, next) => {                                 ///////////////////////////////////////
    favModel
        .deleteItem(req.body.cartId)
        .then(() => res.redirect("/cart"))
        .catch(err => res.redirect("/error"));
};

exports.removeItem = (req, res, next) => {
const userId = req.session.userId;
favModel.deleteItem3(userId)
    .then(() => {
      res.sendStatus(204); //
    })
    .catch(err => {
    console.error('Error removing item from favorites:', err);
    res.status(500).send('Error removing item from favorites');
    });
};
