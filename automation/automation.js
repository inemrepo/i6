var path = require('path');

if(typeof(global.automation)=='undefined'){
	global.automation = {};
}


module.exports.automation = {};
sails.log.info('initialize automation services');


var tasks = require(path.join(__dirname,'tasks.js')).tasks;

//Eksekusi semua tugas otomasi
tasks.forEach(task=>{
	global.automation[task + 's'] = {};
	require('./' + task + 's/index.js');
});

setInterval(function(){
	sails.sockets.blast('alarm', {id : 1, msg : global.automation.tags});
}, 3000);
