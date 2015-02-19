var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')

var routes = require('./routes/index');
var api = require('./routes/api');
var gpslog = require('./routes/gpslog');



// environment specific configurations
var config = require('config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


// http://thenitai.com/2013/11/25/how-to-access-sessions-in-jade-template/
app.use(function(req,res,next){
	res.locals.session = req.session;
	next();
});


// get access to URL of running app
app.use(function(req, res, next) {
    req.getBaseUrl = function() {
      return req.protocol + "://" + req.get('host');
    }
    return next();
  });
  


// adds config object to all responses
var addconfig = require('./services/middleware/addconfig.js');
app.use(addconfig());



app.use('/', routes);
app.use('/gpslog', gpslog);
app.use('/api', api);



// adds config object to all responses
var addconfig = require('./services/middleware/addconfig.js');
app.use(addconfig());


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,











        error: {}
    });
});




//  1000000001,20150215123432,16.369861,48.187290,0,190,228,5,2
//var http = require('http').Server(app);
var socketserver = app.listen(4444);


var mongojs = require("mongojs");


var PORT = 5032;

var HOST = '127.0.0.1';
//var HOST = '213.208.138.106';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');


//server.bind(PORT,HOST);

var DB="tracker";

var connection_string = '127.0.0.1:27017/'+DB;
var db = mongojs(connection_string, [DB]);


var io = require('socket.io').listen(socketserver);


	//io.set('transports',['websocket']);
	


/*http.listen(3000, function(){
  console.log('Websocket server listening on *:3000');
});
*/

/*
io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});


*/


server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    
    // message is a nodejs Buffer http://nodejs.org/api/buffer.html
    var _raw = message.toString('ascii');
    
    console.log("--- _raw = "+_raw);
    
    var _rawArray = _raw.split(",");
  
      
    var _data = {};
    _data.deviceID = _rawArray[0];
    _data.dateTime = _rawArray[1];
    _data.longitude = _rawArray[2];
    _data.latitude = _rawArray[3];
    _data.speed = _rawArray[4];
    _data.heading = _rawArray[5];
    _data.altitude = _rawArray[6];
    _data.satellite = _rawArray[7];
    _data.eventID = _rawArray[8];
    
    
    
    
    if (_data.deviceID=="1000000001")
    {
		console.log("[OK] got valid gps packet: "+JSON.stringify(_data));
		db.collection("gpslog").insert(_data, function(err , success){
								console.log('Response success '+success);
								console.log('Response error '+err);
		});
		
		io.sockets.emit('gpslog',_data);
	}


});

server.bind(PORT, HOST);












module.exports = app;
