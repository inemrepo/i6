var tags = {};
//baca atribut tags dari database
Tag.find().exec((err,results)=>{

	//Jika terjadi error ketika membaca database tag
	if(err){
		sails.log.error('tags - Something wrong when get tags properties.')
		return;
	}

	var rt = [];
	results.forEach(res=>{
		var name = res.name;
		tags[name] = res;

		//Compress memory use
		delete tags[name].name;
		delete tags[name].createdAt;
		delete tags[name].updatedAt;
		rt.push({name : res.name});
		Runtime.destroy().exec();
		Runtime.create(rt).exec();
	});
	global.automation.tags = tags;

});