/*
	Refer to : https://github.com/plcpeople/nodeS7
*/
var async = require('async');
var utils = require(__dirname + '/../utils.js');
var nodeS7 = require('nodes7');
var plc = require(__dirname + '/devS7.js');

var driver = 'i6-s7IP';


utils.get_devices(driver, (devices)=>{
	var interval = 1000;
	var deviceIx = 1;	
	devices.forEach(device=>{
		setTimeout(function(){
			global.automation.devices[devices.name] = new plc(device);
			global.automation.devices[devices.name].connect();			
		}, interval * deviceIx);
		deviceIx++;
	});
});