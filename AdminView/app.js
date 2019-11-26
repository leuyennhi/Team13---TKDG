var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash    = require('connect-flash');
var session      = require('express-session');
var passport = require('passport');

require('dotenv').config()

require('./config/passport')(passport);

var app = express();

//in the declarations
const exphbs  = require('express-handlebars');

//when configuring the app view engine
app.engine('hbs', exphbs({
  extname: 'hbs',
  helpers: require('./config/handlebars-helpers') 
}));

// Set up mongoose connection
var mongoose = require('mongoose');
//var dev_db_url = 'mongodb+srv://admin:123@demo-l6r8b.mongodb.net/SHOP?retryWrites=true';
var mongoDB = process.env.MONGODB_URI //|| dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Cloudinary
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
cloudinary.config({cloud_name: process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret: process.env.CLOUDINARY_API_SECRET});

const storage = cloudinaryStorage({cloudinary: cloudinary,folder: "demo",allowedFormats: ["jpg", "png"],transformation: [{ width: 5000, height: 5000, crop: "limit" }]});

const parser = multer({ storage: storage });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  secret: 'xxxxxxxxxxxxx',
  resave: true,
  saveUninitialized: true,})); 

app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 

app.use(function(req, res, next){
// if there's a flash message in the session request, make it available 
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

require('./routes/index')(app,passport,parser);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
