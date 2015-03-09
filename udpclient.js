var dgram = require('dgram');
var moment = require('moment');

var message = new Buffer("1000000001,20150308131200,16.23961,48.183290,0,190,228,5,99");
var client = dgram.createSocket("udp4");

var port = 5032;

var server = process.argv[2];
// 213.208.138.106





var messages =[];
var _now = new Date();

var _startLon = 16.372961;
var _startLat = 48.181290;

/*
for (var i=0;i<100;i++){
	var _lon = _startLon+(i*0.001);
	var _lat = _startLat+(i*0.001);
	
	var b = new Buffer("1000000001,20150222131200,"+_lon+","+_lat+",0,190,228,5,2");
	messages.push(b);
}
*/

client.send(message, 0, message.length, 5032, server, function(err) {
client.close();

});

/*
for (var m in messages){
	setTimeout(sendUDP(messages[m]),5000);
	
}


function sendUDP(message){
	client.send(message, 0, message.length, port, server, function(err) {
	  console.log("[OK] sent UDP message: "+message+" to: "+server+" on port: "+port);
	  
	  client.close();
	});
}
*/
