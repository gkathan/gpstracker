/**
  /org routes
*/
var mongojs = require("mongojs");
var nodeExcel = require('excel-export');
var express = require('express');
var router = express.Router();
var config = require('config');
var _ = require('lodash');


var gpsservice = require('../services/GpsLogService');

gpsservice.findLogByRange(new Date("2015-01-01"), new Date(),function(err,log){
		console.log("**** result:" +log);
	});

router.get("/", function(req, res, next) {
	console.log("*************router / gpslogs....");
	// to have moment.js accessible in jade template => i have to add it into the locals !!!!
	res.locals.moment = require('moment');
	res.locals.ip=config.serverIP;
	res.locals.wsPort=config.wsPort;
	res.locals.fenceRadius=config.fence.radius;
	res.locals.fenceLat=config.fence.lat;
	res.locals.fenceLng=config.fence.lng;
	
	

	res.render('gpslog')
	
	return;
	
});

module.exports = router;




