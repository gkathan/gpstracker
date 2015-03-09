/**
 * GpsLog encapsulated fucntionality
 */
var express = require('express');
var config = require('config');
var mongojs = require("mongojs");

var _ = require('lodash');
var geo = require('node-geo-distance');

var DB="tracker";

var connection_string = '127.0.0.1:27017/'+DB;
var db = mongojs(connection_string, [DB]);

var app = express();
var socketserver = app.listen(config.wsPort);
var io = require('socket.io').listen(socketserver);

var logservice = require('./GpsLogService');


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
			
			// do a sanity check of the gps data
			// sometime tk5000 sends wrong data which is 100's of kilometers away 
			// let's filter those false positives out here ....
			logservice.findLatest(function(err,_latest){
				console.log("[CHECK] latest gpslog: "+JSON.stringify(_latest)); 
				
				if (_latest != undefined){
					var _c1={"latitude":parseFloat(_data.latitude),"longitude":parseFloat(_data.longitude)};
					var _c2={"latitude":parseFloat(_latest.latitude),"longitude":parseFloat(_latest.longitude)};
					
					geo.vincenty(_c1, _c2, function(dist) {
						console.log("[CHECK] **** distance between latest and this one: "+dist+ "m");
						
						_data.distance = dist;
						
						if (dist <config.filterLog.tresholdMeter){
							console.log("[OK] got valid gps packet: "+JSON.stringify(_data));
							console.log("...going to insert..."+connection_string);
							db.collection("gpslog").insert(_data, function(err , success){
								console.log('Response success '+success);
								console.log('Response error '+err);
							
								if (_data.eventID==config.notifications.fenceOutID){
									console.log("uuuuuuhh got a fenceOUT event: id="+JSON.stringify(_data));
									_sendFenceOutNotification(config.notifications.fenceOut,_data);
								}
								
								io.sockets.emit('gpslog',_data);
							});
								
						}
						else{
							console.log("[ERROR] looks like we have a false packet - IGNORED !!!, distance between last and this: "+dist/1000+" km");
						}
					});
				}
				else console.log("...[ERROR] no _latest found for _data: "+JSON.stringify(_data));
			});
		}
	});
	server.bind(PORT, HOST);
}

/**
 * notifies when a we left our fence
 */ 
function _sendFenceOutNotification(to,gpslog){
	var mailer = require('../services/MailService');

	
	var mail = {};
	mail.to=to;
	mail.subject="[hamburg left homebase] notification !!!";
	mail.text="hej,\nhamburg left her homebase fence zone - hopefully this is not unintentionally ...\n see tracking info under http://traccar.kathan.at/gpslog \ncheerz";
	//mail.html="<html><body><h1>this is the html version</h1><p>and some text</p></body></html>";

	//testmail on startup
	mailer.sendText(mail);
	
}
