/**
 * I6taglogController
 *
 * @description :: Server-side logic for managing i6taglogs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getChart : function(req,res){
        LoggingService.getChart(req.query.tags, req.query.timeStart, req.query.timeEnd, req.query.limit,dataResult=>{
           return res.ok(dataResult);
        });
    }
};

