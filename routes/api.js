/**
  /api routes
*/
var mongojs = require("mongojs");
var nodeExcel = require('excel-export');
var express = require('express');
var router = express.Router();
var _ = require('lodash');

var DB="tracker";

var connection_string = '127.0.0.1:27017/'+DB;
var db = mongojs(connection_string, [DB]);

var BASE = "";


/* GET api listing. */
var PATH_ROOT ="/";
var PATH = {
						ROOT : PATH_ROOT,
						REST_GPSLOG : BASE+'/tracker/rest/gpslog',
						
						EXPORT_GPSLOG : BASE+'/tracker/export/xlsx/targets',
					};

router.get(PATH.ROOT, function(req, res, next) {res.locals.API_LIST=PATH;res.locals.REQ_PATH=req.baseUrl;res.render("api")});

router.get(PATH.REST_GPSLOG, function(req, res, next) {findAllByName(req,res,next); });
router.get(PATH.REST_GPSLOG+'/:interval', function(req, res, next) {findByInterval(req,res,next);});



router.get(PATH.EXPORT_GPSLOG, function(req, res, next) {excelGpslog(req,res,next)});

module.exports = router;




/**
 * generic finder
 */
function findAllByName(req, res , next){
	var path = req.path.split("/");
	var collection = _.last(path);
    var _filterName = req.query.n;
	var _filterValue = req.query.v;
	var _filterOperator = req.query.o;
	var _filter = {};
	
	_filter[_filterName]={};
	_filter[_filterName][_filterOperator]=_filterValue;
	
	if (_filterName==undefined) _filter = null;
	
	// e.g http://localhost:3000/api/kanbanv2/rest/boards?filterName=name&filterOperator=$eq&filterValue=studios
	console.log("***** filter: "+JSON.stringify(_filter));
	
    db.collection(collection).find(_filter).sort({id : 1} , function(err , success){
        //console.log("[DEBUG] findAllByName() for: "+_name+", Response success: "+JSON.stringify(success));
        //console.log('Response error '+err);
        if(success){
            console.log("******************* success: "+success);
            
            res.send(success);
            return ;//next();
        }else{
            return next(err);
        }
    });
}


/**
 * find single object by Id
 */
function findByInterval(req, res , next){
    var path = req.path.split("/");
	// format path: /kanbanv2/rest/boards/1
	// take the last from the set with last stripped ;-)
	var collection = _.last(_.initial(path));
	
    db.collection(collection).findOne({id:req.params.id} , function(err , success){
        console.log('Response success '+success);
        console.log('Response error '+err);
        if(success){
            res.send(success);
            return;
        }
        return next(err);
    })
}






/**
 * generate targets excel
 */
function excelGpslog(req, res , next){
	var conf ={};
	
    conf.stylesXmlFile = "views/excel_export/styles.xml";
    conf.cols = [
		{caption:'_id',type:'string',width:20,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'vision',type:'string',width:20,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'cluster',type:'string',width:15,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'theme',type:'string',width:10,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'group',type:'string',width:30,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'target',type:'string',width:30,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'outcome',type:'string',width:30,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'description',type:'string',width:30,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'baseline',type:'string',width:15,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'measure',type:'string',width:15,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'by when',type:'string',width:30,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'link',type:'string',width:15,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'owner',type:'string',width:7,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'responsible',type:'string',width:10,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'comments',type:'string',width:10,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'contributors',type:'string',width:10,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'sponsor',type:'string',width:10,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'start',type:'string',width:10,captionStyleIndex:2,beforeCellWrite:_formatCell},
		{caption:'end',type:'string',width:10,captionStyleIndex:2,beforeCellWrite:_formatCell}
		
	];
    
    _generateAndSendExcel("targets",conf,req,res,next);
    
}



function _stripCrap(object){
	if (typeof object =="string"){ 
		//strip out all HTML tags - http://stackoverflow.com/questions/822452/strip-html-from-text-javascript
		object = object.replace(/(<([^>]+)>)/ig,"");
		object = object.replace(/[^ -~]/g, "");

		//object = object.replace(/(\r\n|\n|\r)/gm,"");
		/*object = object.replace(/(\u001c)/g, "");
		object = object.replace(/(\u001a)/g, "");
		object = object.replace(/(\u001b)/g, "");
		object = object.replace(/(\u001e)/g, "");
		object = object.replace(/(\u001f)/g, "");
		object = object.replace(/(\u0013)/g, "");
		*/
	}
	return object;
}


/** row formatting 
 * 
 */
function _formatCell(row, cellData,eOpt){
             if (eOpt.rowNum%2 ==0)
				eOpt.styleIndex=1;
			 else 
				eOpt.styleIndex=3;
			 
             //console.log(JSON.stringify(row));
             return _stripCrap(cellData);
        }

/**
 * extracts the captions from a conf arrax
 * needed for deterministically create the data for CSV export
 */
function _getCaptionArray(conf){
   var _fields = new Array();
   
   for (c in conf.cols){
	   _fields.push(conf.cols[c].caption);
   }
   
   return _fields;
}

/** 
 * builds array of values for excel export
 */
function _createDataRows(conf,data){
	var _fields = _getCaptionArray(conf);
	var _list = new Array();
	
	for (var d in data){
		var _row = new Array();
		//console.log("JSON: "+JSON.stringify(success[m]));
		for (var f in _fields){
			var _column = _fields[f];
			//console.log("+ column: "+_column);
			if (! data[d][_column]) _row.push("");
			else _row.push(data[d][_column]);
		}
		_list.push(_row);
		//console.log("** row: "+_row);
	}	
	return _list;
}


/** exposes server side config relevant for client 
 *
 */
function getConfig(req,res,next){

	var config = require('config');
	res.send(config);

}
