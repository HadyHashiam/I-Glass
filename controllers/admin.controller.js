const productsModel = require("../models/products.model");
const validationResult = require("express-validator").validationResult;

exports.getAddProduct = (req, res,next) => {
    res.render('addproduct.ejs',{
        validationErrors: req.flash("validationErrors"),
        isUser: true,
        isAdmin: true,
        productAdded: req.flash("added")[0],
        pageTitle: "Add Product"
    });
};

exports.postAdd = (req, res, next) => {
    if (validationResult(req).isEmpty()){
    req.body.image = req.file.filename;
        productsModel
            .addNewProduct(req.body)
            .then(() => {
                req.flash("added", true);
                res.redirect("/addproduct");
            })
            .catch(err => {
                console.log(' id is repeated');
                res.redirect("/error");
            });

    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/addproduct");
};  
}
