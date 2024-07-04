exports.getAboutus = (req, res,next) => {
  
  res.render('aboutus.ejs', {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin
  })
};
