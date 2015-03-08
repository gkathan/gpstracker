/**
 * GpsLog encapsulated fucntionality
 */

var config = require('config');
var mongojs = require("mongojs");

var _ = require('lodash');

var DB="tracker";

var connection_string = '127.0.0.1:27017/'+DB;
var db = mongojs(connection_string, [DB]);

/**
 * find all GpsLogs
 */
exports.findLog = function(callback) {
	var gpslogs =  db.collection('gpslog');
		gpslogs.find({}, function (err, docs){
			//sort
			var _e =_.sortBy(docs[0].gpslogs, "dateTime")
			callback(_e);
			return;
	});
}

exports.findLogByRange = function(from,to,callback) {
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
exports.findLatest = function(callback) {
	db.collection('gpslog').findOne({}, {sort:{$natural:-1}}, function(err , _latest){
			callback(_latest);
			}
	);
	return;
}
