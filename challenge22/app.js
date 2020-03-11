const createError = require('http-errors');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const indexRouter = require('./routes/index-routes');

// create app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// use middleware
app.use(cors())
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

//use router
app.use('/', indexRouter);

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

// config connection to mongodb
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/breaddb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
})
.then(() => console.log('DB connected successfully'))
.catch((err) => console.error(err))

module.exports = app;
