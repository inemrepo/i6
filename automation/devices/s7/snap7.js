var snap7 = require('node-snap7');
 
var s7client = new snap7.S7Client();
s7client.ConnectTo('192.168.1.20', 0, 1, function(err) {
    if(err)
        return console.log(' >> Connection failed. Code #' + err + ' - ' + s7client.ErrorText(err));
 	
 	setInterval(radDB, 500);
});


function radDB(){
	//S7Client.ReadArea(area, dbNumber, start, amount, wordLen[, callback])
	
	s7client.ReadArea(s7client.S7AreaMK,0, 0, 2, s7client.S7WLWord, (err, result)=>{
		console.log(result);
	});


    // Read the first byte from PLC process outputs... 
   /* s7client.DBRead(10, 0, 52, function(err, res) {
        if(err)
            return console.log(' >> ABRead failed. Code #' + err + ' - ' + s7client.ErrorText(err));
 
        // ... and write it to stdout 
        console.log(res)
    });*/
}

setTimeout(function(){
	s7client.PlcStop(function(err){
		console.log(err);
	});
}, 10000);