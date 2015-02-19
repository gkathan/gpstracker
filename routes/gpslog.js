/**
  /org routes
*/
var mongojs = require("mongojs");
var nodeExcel = require('excel-export');
var express = require('express');
var router = express.Router();
var _ = require('lodash');

var DB="tracker";

var connection_string = '127.0.0.1:27017/'+DB;
var db = mongojs(connection_string, [DB]);





router.get("/", function(req, res, next) {
console.log("*************router / gpslogs....");
var gpslog =  db.collection('gpslog');
		gpslog.find().sort({$natural:-1}, function (err, docs){
			
			console.log("*************finding gpslogs....");
			res.locals.gpslog=docs;
			res.render('gpslog')
	});
	return;
	
});



module.exports = router;




