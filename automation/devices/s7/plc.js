
var utils = require(__dirname + '/../utils.js');
var nodeS7 = require('nodes7');


module.exports = plc;

function plc(params){
	this.updateInterval = typeof(params.cycle)=='undefined'? 1000 : params.cycle;
	this.name = params.name;
	this.properties = {
		host : params.host,
		port : params.port,
		rack : params.rack,
		slot : params.slot
	};
	this.tags = {};
	this.connection = new nodeS7();
}


plc.prototype.connect = function(){
	this.connection.initiateConnection(this.properties, this._connectionHandler);
	//plc.initiateConnection({port: dev.port, host: dev.host, rack: dev.rack, slot: dev.slot}, connected);
};

plc.prototype.disconnect = function(){
	this.connection.dropConnection(function(){

	});
}


plc.prototype._connectionHandler = function(err){
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

		utils.log("PLC nyambung", "info");
		//console.log(this);
		this.setTranslationCB(function(tag){
			return this.tags[tag];}
		);

		this.addItems(items);

		var conn = this;
		//setInterval(function(){
			this.readAllItems(valueReady);
		//}, 1000);
	});
}

function valueReady (err,values){
	if (err) { utils.log("SOMETHING WENT WRONG READING VALUES!!!!"); return;}
	console.log(values);
}


