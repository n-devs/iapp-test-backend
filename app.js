const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const cors = require('cors');
// const multer = require('multer');
// const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authenticationRouter = require('./routes/authentication.router');
var buyRouter = require('./routes/buy.router');
var productsRouter = require('./routes/products.router');
var cartRouter = require('./routes/cart.router');

require('dotenv').config();

// const upload = multer();

const app = express();

const urlDB = "mongodb://localhost:27017/test"


mongoose.connect(urlDB, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
});

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

app.use(session({
  secret: process.env.TOKEN_SECRET,
  resave: true,
  saveUninitialized: false,
  store:MongoStore.create({ mongoUrl: urlDB,
    ttl: 14 * 24 * 60 * 60 // = 14 days. Default 
  })
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', [authenticationRouter, buyRouter, productsRouter, cartRouter]);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
