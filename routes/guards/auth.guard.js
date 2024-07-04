exports.isAuth = (req, res, next) => {
    if (req.session.userId) next();
    else res.redirect("/login");                                                    // then other actions like same page to redirect
};

exports.notAuth = (req, res, next) => {
    if (!req.session.userId) next();
    else res.redirect("/home");
};
