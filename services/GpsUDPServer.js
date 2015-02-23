/**
 * GpsLog encapsulated fucntionality
 */
var express = require('express');
var config = require('config');
var mongojs = require("mongojs");

var _ = require('lodash');

var DB="tracker";

var connection_string = '127.0.0.1:27017/'+DB;
var db = mongojs(connection_string, [DB]);

var app = express();
var socketserver = app.listen(config.wsPort);
var io = require('socket.io').listen(socketserver);


/**
 * start UDPServer
 * 	//  1000000001,20150215123432,16.369861,48.187290,0,190,228,5,2
 */
exports.start = function(callback) {
	var mongojs = require("mongojs");

	var PORT = config.gpsUdpPort;
	var HOST = config.serverIP;
	//var HOST = '213.208.138.106';

	var dgram = require('dgram');
	var server = dgram.createSocket('udp4');

	var connection_string = config.database.host+'/'+config.database.db;
	var db = mongojs(connection_string, [config.database.db]);
	var moment = require('moment');


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
		_data.dateTime = moment(_rawArray[1],"YYYYMMDDHHmmssSS").toDate();
		_data.longitude = _rawArray[2];
		_data.latitude = _rawArray[3];
		_data.speed = parseInt(_rawArray[4]);
		_data.heading = parseInt(_rawArray[5]);
		_data.altitude = parseInt(_rawArray[6]);
		_data.satellite = parseInt(_rawArray[7]);
		_data.eventID = parseInt(_rawArray[8]);

		if (_data.deviceID=="1000000001")
		{
			console.log("[OK] got valid gps packet: "+JSON.stringify(_data));
			console.log("...going to insert..."+connection_string);
			db.collection("gpslog").insert(_data, function(err , success){
				console.log('Response success '+success);
				console.log('Response error '+err);
			});
			
			io.sockets.emit('gpslog',_data);
		}
	});
	server.bind(PORT, HOST);
}

