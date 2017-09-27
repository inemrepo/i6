/**
 * TagController
 *
 * @description :: Server-side logic for managing tags
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find : function(req,res){
		return res.view();
	},

	list : function(req,res){
		//Model.find({ where: { name: 'foo' }, skip: 20, limit: 10, sort: 'name DESC' });
		var criteria = {
			where : {
				or : []
			},
			skip : req.query.start,
			limit : req.query.length,
			sort : req.query.columns[req.query.order[0].column].data + " " + req.query.order[0].dir
		};

		var search = req.query.search.value;
		req.query.columns.forEach(col=>{
			var or = {};
			or[col.data] = {'like' : '%' + search + '%'}
			criteria.where.or.push(or);
		});
		var retval = {data : []}
		Tag.find(criteria).populate('device').exec((err,tags)=>{
			if(err){return res.ok(retval); }
			
			retval.data = tags;
			retval.draw = req.query.draw;

			Tag.count(criteria).exec((err,count)=>{
				if(err){return res.ok(retval); }
				retval.recordsFiltered = count;
				Tag.count().exec((err,count)=>{
				if(err){return res.ok(retval); }
					retval.recordsTotal = count;
					return res.ok(retval);
				});
			});
		});
	},

	detail : function(req,res){
		Tag.findOne({id:req.query.id}).populate('device').exec((err,tag)=>{
			res.view({
				model : tag,
				layout : null
			});
		});
	},

	edit : function(req,res){
		Device.find().exec((err,devices)=>{
			Tag.findOne(req.query.id).exec((err,tag)=>{
				res.view({
					devices : devices,
					model : tag,
					layout: null
				})
			});			
		});
	},
	
	new : function(req,res){		
		Device.find().exec((err, device)=>{
			return res.view({
				devices : device ? device : [],
				layout: null
			});
		});	
	},

	online : function(req,res){
		if(typeof(req.query!=='undefined') && typeof(req.query.tag) !== 'undefined'){
			var responseValue = {};
			responseValue[req.query.tag] = global.automation.tags[req.query.tag];			
			return res.ok(responseValue);
		}
		return res.ok( global.automation.tags);
	},

	writeFloat : function(req,res){
		if(!query_good(req, ['tag', 'value'])){
			return res.ok('Parameter kurang!');
		}
		global.automation.tag.writeToDevice(req.query.tag, req.query.value);
		res.ok('Yes');
	}
};


function isDefined(par){
	return typeof(par)=='undefined'?false : true;
}

function query_good(req, query){
	if(typeof(req.query)=='undefined') return false
	if(typeof(query)=='string'){
		if(typeof(req.query[query])=='undefined') return false;
	}else if(typeof(query)=='object'){
		query.forEach(par=>{
			if(typeof(req.query[par])=='undefined') return false;
		});
	}
	return true;
}
