/**
 * HmiController
 *
 * @description :: Server-side logic for managing hmis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	hrsg1 : function(req,res){
        res.view({title:'HRSG 1'});
    },

    trend :  function(req,res){
        res.view({title:'Trend'});
    }
};

