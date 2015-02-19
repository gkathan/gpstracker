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
exports.findGpsLogs = function(callback) {
	var gpslogs =  db.collection('gpslogs');
		gpslogs.find({}, function (err, docs){
			//sort
			var _e =_.sortBy(docs[0].gpslogs, "dateTime")
			callback(_e);
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
	});
	return;
}
