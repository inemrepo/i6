var util = require('util');
var nodeS7 = require('nodes7');
var utils = require(__dirname + '/../utils.js');


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
	this.tags = {};
}

//Inherits nodeS7 class
util.inherits(plc, nodeS7);
var me = plc.prototype;



me.connect = function(){
	this.initiateConnection(this.properties, this._connectionHandler);
	//plc.initiateConnection({port: dev.port, host: dev.host, rack: dev.rack, slot: dev.slot}, connected);
};

plc.prototype.disconnect = function(){
	this.dropConnection(function(){

	});
}


me._connectionHandler = function(err){
	if (typeof(err) !== "undefined") {
		utils.log(err);
		return;
	}

	utils.get_device_tags(this.name, (err,result)=>{
		if(err){
			return;
		}
		var items = ["_COMMERR"];
		result.forEach(res=>{
			this.tags[res.name] = res.address;
			items.push(res.name);
		});

		this.setTranslationCB(function(tag){
			return this.tags[tag];}
		);

		this.addItems(items);

		var conn = this;
		var i = 1;
		setInterval(function(){
			i = i<128?i*2 : 1;
			conn.writeItems("Q1", i);
			conn.readAllItems(valueReady);
		}, 200);
	});
}

function valueReady (err,values){
	if (err) { utils.log("S7 - SOMETHING WENT WRONG READING VALUES!!!!" + this.name);}
	var keys = Object.keys(values);
	keys.forEach(key=>{
		var _tag = global.automation.tags[key];
		var _prev = global.automation.tags[key];
		_tag.value = err? 0 : values[key];
		_tag.lastUpdate = new Date();
		_tag.status = err? "BAD" : "GOOD";
		Tag.update({name : key}, {value : _tag.value, status: _tag.status}, function(err, updated){
			if(err){console.log(err); return;}
			Tag.publishUpdate( _tag.id, updated[0], null, {previous :_prev });
			//console.log(updated);
		});
	});
}

module.exports = plc;