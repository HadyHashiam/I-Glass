const Contactusmodel = require('../models/contactus.model');
const validationResult = require("express-validator").validationResult;

exports.getContactus = (req, res,next) => {
  
  res.render('contactus.ejs', {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin
  })
};


exports.postContactus = (req, res, next) => {
  if (validationResult(req).isEmpty()) {
    Contactusmodel
      .addNewContactus({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        subject: req.body.subject,
        userId: req.session.userId,
        message: req.body.message
      })
      .then(() => {
        console.log("contactus added");
        res.redirect("/contactus");
      })
      .catch(err => {
        res.redirect("/error");
      });
  } else {
    req.flash("validationErrors", validationResult(req).array());
    res.redirect("/contactus");
  }
};