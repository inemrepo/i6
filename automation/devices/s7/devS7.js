var util = require('util');
var nodeS7 = require('nodes7');
var utils = require(__dirname + '/../utils.js');

/**
 * Init PLC Class
 * @param {object} params PLC dvice parameters
 */
function plc(params) {
    nodeS7.call(this, {silent:true});
	this.updateInterval = typeof(params.cycle)=='undefined'? 1000 : params.cycle;
	this.name = params.name;
	this.properties = {
		host : params.host,
		port : params.port,
		rack : params.rack,
		slot : params.slot
	};
	this.enabled = params.enabled;
	//Save tag properties
	this.tags = {};
	params.tags.forEach(tag=>{
		this.tags[tag.name] = tag;
	});

	//var conn = this;
	//setTimeout(conn.connect,1000);
}

//Inherits nodeS7 class
util.inherits(plc, nodeS7);
var me = plc.prototype;

plc.prototype.connect = function(){
	//Start PLC connection	
	if(this.enabled){
		sails.log.info('Connecting to ' + this.name);
		this.initiateConnection(this.properties, this._connectionHandler);
	}else{
		sails.log.info('Device ' + this.name + ' is disabled!');		
	}
}

plc.prototype.disconnect = function(){
	this.dropConnection(function(){

	});
}


me._connectionHandler = function(err){
	if (typeof(err) !== "undefined") {
		sails.log.error('Failed to connect to ' + this.name);
		return;
	}

	sails.log.info(this.name + ' connected');

	var items = ["_COMMERR"];
	var tagsKey = Object.keys(this.tags);

	tagsKey.forEach(key=>{
		items.push(key);
	});

	this.setTranslationCB(function(tag){
		return this.tags[tag].address;
	});

	this.addItems(items);

	
	var conn = this;
	setInterval(function(){
		conn.readAllItems(valueReady);
	}, 500);
}


//Tulis val ke addr PLC
me.writeToDevice = function(addr, val){
	if(this.isoConnectionState==4){
		this.writeItems(addr, val);
	}
}

function valueReady (err,values){
	if (err) {
		utils.log("S7 - SOMETHING WENT WRONG READING VALUES!!!!" + this.name);
	}
	var keys = Object.keys(values);
	keys.forEach(key=>{
		//Save previous value
		var _previous = global.automation.tags[key];

		//Update global variable
		global.automation.tags[key].value = err? 0 : values[key];
		global.automation.tags[key].timestamp = new Date();
		global.automation.tags[key].status = err? "BAD" : "GOOD";

		//update realtime database
		Runtime.update({name : key}, {
			value : values[key],
			quality:err? "BAD" : "GOOD",
			timestamp : new Date()
		}).exec((err,result)=>{
			if(err){
				sails.log.error(err);
			}else{
				//Broadcast on update event
				Runtime.publishUpdate(key, result[0], null,{previous : _previous});
			}
		});

	});
}

module.exports = plc;