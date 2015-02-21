var express = require('express');
var router = express.Router();
var config = require('config');


/* GET home page. */
router.get('/', function(req, res) {
  res.locals.title='GPSLogger';
  res.locals.ip=config.serverIP;
  res.locals.wsPort=config.wsPort;
  res.render('index');
});

module.exports = router;
