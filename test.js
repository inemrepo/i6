var params = [{nama : "kelas1", interval : 500},{nama : "kelas2", interval : 1000}];





function printer(pars){
	this.nama = pars.nama;
	this.interval = pars.interval;
	this.c = 0;
	this.mm();
}

printer.prototype.mm = function(){
	var self = this;
	console.log(self.name + ' : ' + self.c);
	self.c++;
	setTimeout(printer.prototype.mm.bind(this), self.interval);
}


var jo = {};
params.forEach(par=>{
	jo[par.name] = new printer(par);
});
