/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find : function(req,res){
		Driver.find().exec((err,drivers)=>{
			res.view({drivers : drivers});
		});
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
		Device.find(criteria).populate('type').exec((err,tags)=>{
			if(err){return res.ok(retval); }
			
			retval.data = tags;
			retval.draw = req.query.draw;

			Device.count(criteria).exec((err,count)=>{
				if(err){return res.ok(retval); }
				retval.recordsFiltered = count;
				Device.count().exec((err,count)=>{
				if(err){return res.ok(retval); }
					retval.recordsTotal = count;
					return res.ok(retval);
				});
			});
		});
	},
	
};

