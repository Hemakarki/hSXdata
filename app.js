var express   = require('express');
var app       = express();
var bodyParser= require('body-parser');
var morgan    = require('morgan');
var mongoose  = require('mongoose');
var apiRoutes = express.Router(); 
var jwt       = require('jsonwebtoken');
var config    = require('./config'); 
var User      = require('./models/user'); 

var port = process.env.PORT || 8080; 
mongoose.connect(config.database); 
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

// routes
require('./routes/user')(app, express);

app.listen(port);
console.log('http://localhost:' + port);

module.exports = app;