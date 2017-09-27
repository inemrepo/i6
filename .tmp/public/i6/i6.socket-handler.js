'use strict';
console.log('Hello');

io.socket.get('/driver', function(resData, jwres) {
	console.log(resData);
})
/*
io.socket.on('driver', function(event){
	console.log(event);
})
*/