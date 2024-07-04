exports.getErrormodel = (req, res,next) => {
  
  res.render('errormodel.ejs', {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin
  })
};
