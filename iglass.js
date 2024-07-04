require('dotenv').config();


const express = require("express")                             // import  module
const path = require("path")
const connectDB = require('./controllers/db');
const MongoStore = require('connect-mongo');

const session = require("express-session")
const flash = require("connect-flash")

const homeRouter = require("./routes/home.route")                 // import route
const authRouter = require("./routes/auth.route")
const contactusRouter = require("./routes/contactus.route")
const aboutusRouter = require("./routes/aboutus.route")
const virtualTryOnRouter = require("./routes/virtualTryOn.route")
const welcomeRouter = require("./routes/welcome.route")
const faceDetectionRouter = require("./routes/faceDetection.route")
const checkoutRouter = require("./routes/checkout.route")
const adminRouter = require("./routes/admin.route")
const cartRouter = require("./routes/cart.route")
const orderRouter = require("./routes/order.route")
const favRouter = require("./routes/fav.route")
const ErrorModelRouter = require("./routes/errormodel.route")
const ErrorRouter = require("./routes/error.route")

const app = express()

const port = 5000 || process.env.PORT;

app.use(express.static(path.join(__dirname, 'images')))
app.use(express.static(path.join(__dirname, 'assets')))
app.use(express.urlencoded({ extended: true }));

app.use(express.json())

app.use(flash())



app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  // cookie: { maxAge: new Date(Date.now() + (3600000)) }
  // Date.now() - 30 * 24 * 60 * 60 * 1000
}));

// Conntect to Database
connectDB();

app.set('viewer engine', 'ejs')                                                  // set ejs
app.set('views', 'views')


app.get('/', (req, res, next) => {                                                  // get route
  res.render('welcome.ejs')
})


app.use('/', homeRouter)                                  // use home route
app.use('/', authRouter)
app.use('/', contactusRouter)
app.use('/', aboutusRouter)
app.use('/', virtualTryOnRouter)
app.use('/', welcomeRouter)
app.use('/', faceDetectionRouter)
app.use('/', checkoutRouter)
app.use('/', aboutusRouter)
app.use('/', adminRouter)
app.use('/', cartRouter)
app.use('/', orderRouter)
app.use('/', favRouter)
app.use('/', ErrorModelRouter)
app.use('/', ErrorRouter)

app.listen(port, (err) => {
  console.log(err);
  console.log("server is running on port 5000");
})