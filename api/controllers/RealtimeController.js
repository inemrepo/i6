/**
 * RealtimeController
 *
 * @description :: Server-side logic for managing realtimes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index : function (req,res) {
		return res.view();
	},


	subscribe: function (req, res) {
		if (!req.isSocket) {
			return res.badRequest('Only a client socket can subscribe to Louies.  You, sir or madame, appear to be an HTTP request.');
		}

		/*// Let's say our client socket has a problem with people named "louie".

		// First we'll find all users named "louie" (or "louis" even-- we should be thorough)
		User.find({ or: [{name: 'louie'},{name: 'louis'}] }).exec(function(err, usersNamedLouie){
		if (err) {
		return res.serverError(err);
		}

		// Now we'll use the ids we found to subscribe our client socket to each of these records.*/
		Post.subscribe(req);

		// Now any time a user named "louie" or "louis" is modified or destroyed, our client socket
		// will receive a notification (as long as it stays connected anyways).

		// All done!  We could send down some data, but instead we send an empty response.
		// (although we're ok telling this vengeful client socket when our users get
		//  destroyed, it seems ill-advised to send him our Louies' sensitive user data.
		//  We don't want to help this guy to hunt them down in real life.)
		return res.ok();
		//});
	}


};

