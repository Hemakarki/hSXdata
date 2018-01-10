let express   = require('express');
let app       = express();
let bodyParser= require('body-parser');
let cors      = require('cors');
let morgan    = require('morgan');
let mongoose  = require('mongoose');
let apiRoutes = express.Router(); 
let jwt       = require('jsonwebtoken');
let config    = require('./config'); 
let  db       = require('./config');
let port = process.env.PORT || 8080; 

// mongoose.createConnection("mongodb://localhost/InstagramReportApp",{
//     useMongoClient: true});

// connect to our mongoDB database 
mongoose.Promise = global.Promise;
mongoose.connect(db.database,{useMongoClient: true}); 

app.set('superSecret', config.secret);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));

// routes
require('./routes/user')(app, express);

app.listen(port);
console.log('http://localhost:' + port);

module.exports = app;