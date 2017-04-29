var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/* database modules */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/StuFree')

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', 
	function() {
		console.log("Successfully connected to MongoDB with Mongoose");
});

var user_schema = new Schema({
	name: String,
	email: String,
	password: String,
	rating: Number,
	location: String,
	description: String
})

var job_schema = new Schema({
	title: String,
	description: String,
	icon: String,
	time: String,
	price: Number
})
var User = mongoose.model('User', user_schema);
var Job = mongoose.model('Job', job_schema);

/* Routes */
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


app.post('/create_job', function(req, res) {

}

app.post('/login', function(req, res) {

});

app.post('/register', function(req, res) {

});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
