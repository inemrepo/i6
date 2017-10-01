/**
 * RuntimeController
 *
 * @description :: Server-side logic for managing runtimes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find : function(req,res){
		return res.view();
	},

	join : function(req,res){	
		console.log(req.socket.id);
		if (!req.isSocket) {
			return res.badRequest('Permintaan harus menggunakan socket');
		}
		
		RealtimeService.register(req);


		return res.ok();
	}
};



