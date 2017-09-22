var automation = global.automation;
automation.tags = {};
var tags = automation.tags;

//baca atribut tags dari database
sails.models.tag.find().exec((err,results)=>{

	//Jika terjadi error ketika membaca database tag
	if(err){
		sails.log.error('tags - Something wrong when get tags properties.')
		return;
	}

	results.forEach(res=>{
		var name = res.name;
		tags[name] = res;

		//Compress memory use
		delete tags[name].name;
		delete tags[name].createdAt;
		delete tags[name].updatedAt;
	});
});