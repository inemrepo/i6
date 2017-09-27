/*
	Refer to : https://github.com/plcpeople/nodeS7
*/
var async = require('async');
var utils = require(__dirname + '/../utils.js');
var nodeS7 = require('nodes7');
var plc = require(__dirname + '/devS7.js');

var driver = 'i6-s7IP';


//require('./snap7.js');
utils.get_devices(driver, (devices)=>{
		devices.forEach(device=>{
			global.automation.devices[devices.name] = new plc(device);
			//global.automation.devices[devices.name].connect();
		})
});