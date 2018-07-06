var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);	
var http = require('http');
var server = http.Server(app);
var io = require('socket.io')(server);
io = io.listen(server);


var db = require('./config/db');

var port = process.env.PORT || 8800;

mongoose.set('debug',true);

mongoose.connect(db.url);

app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('X-HTTP-Method-Override'));

app.use(express.static(__dirname + '/public'));

// session details
var sessionStore = new mongoStore({
    mongooseConnection: mongoose.connection,
    autoRemove: 'interval',
    autoRemoveInterval: 10
});

app.use(session({
    secret: 'mykeypleasedontguess',
    cookie:{
        // maxAge:5256000000,
    },
    resave: true,
    saveUninitialized: true,
    store: sessionStore
}));

app.use(function (req, res, next) { 
    var value = '*';

    if(req.headers.origin){
        value = req.headers.origin;
    }
    
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin',value);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST,  PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

require("./app/routes")(app,io);
server.listen(port);

server = http.createServer(app);
console.log('Magic happens on port ' + port);

// expose app
exports = module.exports = app;
