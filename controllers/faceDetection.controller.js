exports.getfaceDetection = (req, res,next) => {
  res.render('faceDetection.ejs', {
    isUser: req.session.userId,
    isAdmin: req.session.isAdmin
  })
};