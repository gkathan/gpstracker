/**
 
*/
var mongojs = require("mongojs");
var _=require('lodash');
var geo = require('node-geo-distance');

var DB="tracker";

var connection_string = '127.0.0.1:27017/'+DB;
var db = mongojs(connection_string, [DB]);


console.log(".....migrate shit..:");
findAll(function(logs){
	console.log("logs.length: "+logs.length);	
	for (var l in logs){
		console.log("log: "+JSON.stringify(logs[l]));
		
		if (logs[parseInt(l)-1] != undefined){
			console.log("*** l: "+l+" -- no distance found... need to calculate..");
			var _c1={"latitude":parseFloat(logs[l].latitude),"longitude":parseFloat(logs[l].longitude)};
			console.log("_c1: "+JSON.stringify(_c1));
			console.log("logs[l-1] "+logs[parseInt(l)-1]);
			var _c0={"latitude":parseFloat(logs[parseInt(l)-1].latitude),"longitude":parseFloat(logs[parseInt(l)-1].longitude)};
			console.log("_c0: "+JSON.stringify(_c0));
			geo.vincenty(_c1, _c0, function(dist) {
				console.log("[CHECK] **** distance between _c1 and _c0: "+dist+ "m");
				
				logs[l].distance =dist;
			});
			
		}
		
	}
	console.log("logs.length: "+logs.length);	
	for (var l in logs){
		console.log("date: "+logs[l].dateTime+" _id:"+logs[l]._id+" coord: "+logs[l].longitude+" - "+logs[l].latitude+" distance: "+logs[l].distance);
		// and write the logs
		db.collection('gpslog').save(logs[l]);
	}
	
});

/**
 * find all GpsLogs
 */
function findAll(callback) {
	console.log("...findAll()");
	var gpslogs =  db.collection('gpslog');
		gpslogs.find({},{sort:{$natural:1}}, function (err, docs){
			//sort
			//var _e =_.sortBy(docs[0].gpslogs, "dateTime")
			console.log("...callback: _e"+docs);
			callback(docs);
			//return;
	});
}

function findByRange(from,to,callback) {
	var gpslogs =  db.collection('gpslog');
		gpslogs.find({dateTime:{
			 $gt:from,
			 $lt:to
			 
			 }
			 }, function (err, docs){
			//sort
			//var _e =_.sortBy(docs[0].gpslogs, "dateTime")
			callback("test","hello world!");
			return;
	});
}



/**
 * get latest position
 */
function findLatest(callback) {
	db.collection('gpslog').findOne({}, {sort:{$natural:-1}}, function(err , _latest){
			console.log("_latest: "+JSON.stringify(_latest));
			callback(err,_latest);
			}
	);
	return;
}

