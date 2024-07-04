exports.getcheckout = (req, res,next) => {
  res.render('checkout.ejs', {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin
  })
};