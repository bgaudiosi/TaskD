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
	rating: String,
	location: String,
	description: String
})

var job_schema = new Schema({
	title: String,
	description: String,
	type: String,
	time: String,
	price: String,
	owner: String
})
var User = mongoose.model('User', user_schema);
var Job = mongoose.model('Job', job_schema);

/* passport stuff */

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
			new_guy.name = reg.name;
			new_guy.location = reg.location;
			new_guy.userid = reg.username;
			new_guy.email = reg.email;
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
		req.logout();
		res.redirect('/');
	}
);

app.get('/user_data',
	function(req, res) {
		res.send(req.user);
	}
);


/* Job methods */
/*
var job_schema = new Schema({
	title: String,
	description: String,
	type: String,
	time: String,
	price: Number
})*/
app.post('/job_create',
	function(req, res) {
		var job = req.body;
		if (job.title === "" || job.description === "" || job.type === "" ||
			job.time === "" || job.price === "") {
			res.redirect('/');
			return;
		}
		Job.find({title:job.title}, function(err, jobs) {
    		if (err) { return cb(err); }
   		 	if (jobs.length===0) {
				var new_guy = {};
				new_guy.title = job.title;
				new_guy.description = job.description;
				new_guy.type = job.type;
				new_guy.time = job.time;
				new_guy.price = job.price;
				new_guy.owner = req.user.userid;
				console.log("req.user = " + req.user);
				var new_job = new Job(new_guy);
				new_job.save(function (err, new_job) {
					if (err) {
						console.log("Error saving to DB");
						return console.error(err);
					} else {
						
						
						res.redirect('/');
						res.end();
					}
				});
			} else {
				res.send("Error: A job of this name already exists")
				//res.redirect('/');
			}	
		});
	}
);

app.get('/job_list',
	function(req, res) {
		Job.find({}, function(err, jobs) {
    		if (err) { return cb(err); }
   		 	if (jobs.length===0) {
				res.end();
			} else {
				res.send(jobs);
				res.end();
			}	
		});
	}
);

app.post('/job_find_by_title',
	function(req, res) {
		var job= req.body;
		Job.find({title:job.title}, function(err, jobs) {
    		if (err) { return cb(err); }
   		 	if (jobs.length===0) {
				res.send("a job of this title does not exist");
			} else {
				res.send(jobs[0]);
				//res.redirect('/');
			}
		});
	}
);

app.post('/job_update',
	function(req, res) {
		var job = req.body;
		Job.find({title:job.title}, function(err, jobs) {
    		if (err) { return cb(err); }
   		 	if (jobs.length===0) {
				res.send("error: job title does not exist");
			} else {
				jobs[0].title = job.title
				jobs[0].description = job.description;
				jobs[0].type = job.type;
				jobs[0].time = job.time;
				jobs[0].price = job.price;
				jobs[0].save(function (err, updatedJob) {
					if (err) return cb(err);
					res.end();
				});
			}	
		});
	}
);

app.post('/job_delete',
	function(req, res)  {
		var job = req.body;
		Job.findOneAndRemove({title: job.title}, function(err, gone) {
			console.log("deleted??");
			
			res.redirect('/');
		});
	}
);

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
