module.exports = {

	log : function(data,type){
		type = typeof(type)!=='undefined'?type : 'error';
		if(typeof(sails) !== 'undefined'){
			sails.log[type](data);
			return;
		}
		console.log('$' + type  + ' : ');
		console.log(data);
	},

	/**
	 * @param  {[type]}
	 * @param  {Function}
	 * @return {[type]}
	 */
	get_devices : function(type,cb){
		sails.models.device.find({type:type}).exec((err,result)=>{
			if(err){
				sails.log.error('auth.device - something wrong when retrieve device data');
				cb(err, result);
			}
			cb(null, result);

		});
	},


	/**
	 * @param  {string} dev nama device yang merupakan sumber data
	 * @return {array object} merupakan tag yang sumber datanya dari dev
	 */
	get_device_tags : function(dev, cb){
		sails.models.tag.find({device:dev}).exec((err,result)=>{
			if(err){
				sails.log.error('aut.device - error when looking tag for device ' + dev);
				cb(err);
			}
			cb(null,result);
		});
	}
};
