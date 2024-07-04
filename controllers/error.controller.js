exports.getError = (req, res,next) => {
  
  res.render('error.ejs', {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin
  })
};
