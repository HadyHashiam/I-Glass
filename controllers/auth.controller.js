const authModel = require("../models/auth.model")
const validationResult = require("express-validator").validationResult;

exports.getSignup = (req, res, next) => {
    res.render("signup.ejs",{
        authError: req.flash("authError")[0],
        validationErrors: req.flash("validationErrors"),
        isUser: false,
        isAdmin: false,
        pageTitle: "Signup"
    })
}

exports.postSignup = (req, res, next) => {
        authModel
            .createNewUser(req.body.username, req.body.email, req.body.password)
            .then(() => res.redirect("login"))
            .catch(err => {
                req.flash("authError", err);
                console.log(err);
                res.redirect("signup");
            });

}


exports.getLogin = (req, res, next) => {
    res.render("login.ejs",{
        authError: req.flash("authError")[0],
        validationErrors: req.flash("validationErrors"),
        isUser: false,
        isAdmin: false,
        pageTitle: "Login"
    })
};

exports.postLogin = (req, res, next) => {

        if (validationResult(req).isEmpty()) {
        authModel
            .login(req.body.email, req.body.password)
            .then(result => {
                req.session.userId = result.id;
                req.session.isAdmin= result.isAdmin;
                res.redirect("/home");
            })
            .catch(err => {
                req.flash("authError", err);
                res.redirect("/login");
            });
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/login");
    }    
}

exports.getlogout = (req, res, next) => {
    res.render("logOut.ejs",{
        isUser: true,
        isAdmin: req.session.isAdmin
    })
};

exports.postlogout = (req, res, next) => {
                                                         // check if user click yes or cancel
    let valueOfsubmit = req.body.submit
    if(valueOfsubmit == "Yes"){
        console.log("yes")
        req.session.destroy(() => {
        res.redirect("/");
        });
    }else if (valueOfsubmit == "Cancel"){
        res.redirect("/home");
        console.log("cancel")
    }else{  
        console.log(valueOfsubmit)
        res.redirect("/logout");
    }
}; 