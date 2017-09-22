/**
 * TagController
 *
 * @description :: Server-side logic for managing tags
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	online : function(req,res){
		if(typeof(req.query!=='undefined') && typeof(req.query.tag) !== 'undefined'){
			var responseValue = {};
			responseValue[req.query.tag] = global.automation.tags[req.query.tag];			
			return res.ok(responseValue);
		}
		return res.ok(global.automation.tags);
	},

};

