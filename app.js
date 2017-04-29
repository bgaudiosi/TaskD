var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var util = require('util');
/* auth modules */
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

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
	userid: String,
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

/* passport stuff */
/* var rests = Restaurant.find({ 'foodTypes': search_val, "zip": location_val }, function (err, restau    rants) {if (err) return handleError(err);})
 * rests.lean().exec(function(err,restaurants){
 * if (err) return console.log(err)
 * do stuff */

passport.use(new Strategy(
  function(username, password, cb) {
    User.find({userid:username}, function(err, user) {
      if (err) { return cb(err); }
      if (user.length===0) {console.log("user not found"); return cb(null, false); }
      if (user[0].password != password) {console.log("bad pw"); return cb(null, false); }
      console.log("user logged in");
	  return cb(null, user[0]);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(id, cb) {
  cb(null, id);
		
  /*User.find({userid:id}, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });*/
});

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
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

/* More passport stuff */
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
/* Authentication methods */
app.get('/isAuthenticated',
	function(req, res) {
		console.log(req.user);
		res.send(req.user);
	}
);

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
});

app.post('/register', function(req, res) {
	var reg = req.body;
	
	User.find({userid:reg.username}, function(err, user) {
    	if (err) { return cb(err); }
    	if (user.length===0) {
			var new_guy = {};
			new_guy.userid = reg.username;
			new_guy.password = reg.password; // VERY UNSECURE
			var new_user = new User(new_guy);
			new_user.save(function (err, curr_restaurant) {
				  if (err) {
					  console.log("Error saving to DB");
					  return console.error(err);
				  }else {
					console.log("saving new user");
					res.redirect('/');
					res.end();
				  }

			});
		} else {
			res.send("Error: username already exists")
			//res.redirect('/');
			
		}
	});
});

app.get('/logout', 
	function(req, res) {
		console.log("should be logging out...");
		req.logout();
		res.redirect('/');
	}
);


/* Job methods */
/*
app.post('/create_job', function(req, res) {
	
}
*/
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
