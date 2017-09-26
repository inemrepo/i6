/*
	Refer to : https://github.com/plcpeople/nodeS7
*/
var async = require('async');
var utils = require(__dirname + '/../utils.js');
var nodeS7 = require('nodes7');
var plc = require('./devS7.js');
//var pmlc = require('./node.js');

utils.get_devices('s7', (err,result)=>{
		if(err){
			return;
		}
		result.forEach(res=>{
			global.automation.devices[res.name] = new plc(res);
			global.automation.devices[res.name].connect();
		})
});