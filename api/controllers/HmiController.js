/**
 * HmiController
 *
 * @description :: Server-side logic for managing hmis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	hrsg1 : function(req,res){
        return res.view({title:'HRSG 1'});
    },

    trend :  function(req,res){
        return res.view({title:'Trend', model : TrendService.data});
    },
    
    init_trend : function(req,res){
        if(!req.isSocket){
            return res.ok('<h3>INVALID REQUEST</h3>');
        }
        return res.ok({data : TrendService.data});
    }
};

