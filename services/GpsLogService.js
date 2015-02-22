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
	var gpslogs =  db.collection('gpslogs');
		gpslogs.find({}, function (err, docs){
			//sort
			var _e =_.sortBy(docs[0].gpslogs, "dateTime")
			callback(_e);
			return;
	});
}

exports.findLogByRange = function(from,to,callback) {
	var gpslogs =  db.collection('gpslogs');
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
	var gpslogs =  db.collection('gpslogs');
	gpslogs.find().sort({$natural:1}).limit(1, function(err , docs){
			var _e =docs[0].gpslogs;
			
			}
	);
	return;
}
