var tags = {};
//baca atribut tags dari database
Tag.find().populate('device').exec((err,results)=>{

	//Jika terjadi error ketika membaca database tag
	if(err){
		sails.log.error('tags - Something wrong when get tags properties.')
		return;
	}

	results.forEach(res=>{
		var name = res.name;
		tags[name] = res;
		var device = tags[name].device.name;
		//Compress memory use
		delete tags[name].id;
		//delete tags[name].name;
		delete tags[name].createdAt;
		delete tags[name].updatedAt;
		delete tags[name].device;

		tags[name].device = device;

		//Update runtime database
		Runtime.destroy().exec((err,res)=>{
			if(err){
				console.log(err);
			}else{
				Runtime.create(tags[name], function(err,res){
					if(err){
						console.log(err);
					}else{
						
					}
				});
			}
		});
	});
	global.automation.tags = tags;

});