/**
 * DriverController
 *
 * @description :: Server-side logic for managing drivers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	find : function(req,res){
		res.view();
	},

	list : function(req,res){
		var _model = Driver;
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
		_model.find(criteria).exec((err,tags)=>{
			if(err){return res.ok(retval); }
			
			retval.data = tags;
			retval.draw = req.query.draw;

			_model.count(criteria).exec((err,count)=>{
				if(err){return res.ok(retval); }
				retval.recordsFiltered = count;
				_model.count().exec((err,count)=>{
				if(err){return res.ok(retval); }
					retval.recordsTotal = count;
					return res.ok(retval);
				});
			});
		});
	}
	
};

