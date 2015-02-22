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

var gpsservice = require('../services/GpsLogService');

gpsservice.findLogByRange(new Date("2015-01-01"), new Date(),function(err,log){
		console.log("**** result:" +log);
	});



router.get("/", function(req, res, next) {
console.log("*************router / gpslogs....");
var gpslog =  db.collection('gpslog');
		gpslog.find().sort({$natural:-1}, function (err, docs){
			
			console.log("*************finding gpslogs....");
			res.locals.gpslog=docs;
			// to make accessible in jade template / script block .. http://stackoverflow.com/questions/6270832/jade-express-iterating-over-object-in-inline-js-code-client-side
			
			res.locals.gpslogjson=JSON.stringify(docs);
			
			
			// to have moment.js accessible in jade template => i have to add it into the locals !!!!
			res.locals.moment = require('moment');
			res.render('gpslog')
	});
	return;
	
});



module.exports = router;




