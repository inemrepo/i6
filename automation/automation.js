var path = require('path');


if(typeof(global.automation)=='undefined'){
	global.automation = {};
}


module.exports.automation = {};
sails.log.info('initialize automation services');


var tasks = require(path.join(__dirname,'config.js')).tasks;




//Eksekusi semua tugas otomasi
tasks.forEach(task=>{
	require('./' + task + 's/index.js');
});