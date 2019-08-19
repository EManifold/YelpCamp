var express = require('express'),
	 app = express(),
	 bodyParser = require('body-parser'),
	 mongoose = require('mongoose'),
	 Campground = require('./models/campground'),
	 Comment = require('./models/comment'),
	 seedDB = require('./seeds'),
	 passport = require('passport'),
	 User = require('./models/user'),
	 LocalStrategy = require('passport-local'),
	 methodOverride = require('method-override'),
	 flash = require('connect-flash');

//requiring routes
var commentRoutes = require('./routes/comments'),
	 campgroundRoutes = require('./routes/campgrounds'),
	 indexRoutes = require('./routes/index');

app.listen(3000, function() {
	console.log('YelpCamp server started');
});

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB(); //seed the database

//passport configuration
app.use(require('express-session')({
	secret: 'I am the best',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);










