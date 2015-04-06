// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var port  	 = process.env.PORT || 8080; 				// set the port
var consolidate = require('consolidate');
var morgan = require('morgan'); 		// log requests to the console (express4)
var bodyParser = require('body-parser'); 	// pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration ===============================================================
app.engine('dust',consolidate.dust);
app.use(express.static(__dirname + '/public')); 				// set the static files location /public/img will be /img for users
app.use(morgan('dev')); 										// log every request to the console
//app.use(bodyParser.urlencoded({'extended':'true'})); 			// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit: '50mb', 'extended':'true'}));
app.use(bodyParser.json({limit: '5mb'}));									// parse application/json

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("snapSearch App listening on port " + port);
