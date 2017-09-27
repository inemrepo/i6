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
	get_devices : function(driver,cb){
		Driver.findOne({code:driver}).exec((err,result)=>{
			if(err){return};
			if(typeof(result)!=='undefined'){
				Device.find({type : result.id}).populate('tags').exec((err,res)=>{
					if(!err && res.length > 0){
						cb(res);
					}
				});
			}
		});
	},



	/**
	 * @param  {string} dev nama device yang merupakan sumber data
	 * @return {array object} merupakan tag yang sumber datanya dari dev
	 */
	get_device_tags : function(dev, cb){
		Tag.find({device:dev}).exec((err,result)=>{
			if(err){
				sails.log.error('aut.device - error when looking tag for device ' + dev);
				return;
			}
			cb(result);
		});
	}
};
