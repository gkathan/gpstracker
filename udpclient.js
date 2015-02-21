var dgram = require('dgram');

var message = new Buffer("1000000001,20150221072300,16.369861,48.187290,0,190,228,5,2");
var client = dgram.createSocket("udp4");

var port = 5032;

var server = process.argv[2];
// 213.208.138.106

//client.send(message, 0, message.length, 5032, "localhost", function(err) {

client.send(message, 0, message.length, port, server, function(err) {
  console.log("[OK] sent UDP message: "+message+" to: "+server+" on port: "+port);
  
  client.close();
});
