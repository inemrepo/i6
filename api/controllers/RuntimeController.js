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
		if (!req.isSocket) {
			return res.badRequest('Permintaan harus menggunakan socket');
		}

		var room = sails.sockets.getId(req);
		//sails.sockets.join(req, room);
		console.log(req.body);
		setInterval(function(){
			sails.sockets.broadcast(room,'update', 'Hello');
			console.log(sails.sockets.rooms());
		}, 3000);

		return res.ok();
	}
};

