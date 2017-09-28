'use strict';

var i6tags = [];

$('document').ready(function(){
  console.log('~# i6.socket loaded');

  collectUsedTags();

});


//Collect used tags in view
function collectUsedTags(){
  $('[i6-tag]').each(function(ix,el){
    var tag = $(this).attr('i6-tag').toUpperCase();
    if($.inArray(tag, i6tags)== -1){
      i6tags.push(tag);
    }

  });
}


/*
  For more information about sails socket, please follow :
  http://sailsjs.com/documentation/reference/web-sockets/socket-client
 */

io.socket.on('connect', function(){
  //On socket connected to server, if tags used, join to the some room
  if(i6tags.length>0){
    console.log('JOIN');
    // io.socket.get('/runtime/join',{data : "34"}, function(resData,jwres){});
    io.socket.request({
      method : 'GET',
      url : '/runtime/join',
      data : {payload : i6tags}
    }, function(resData, jwres){

    });
  }


});


//event received
io.socket.on('update', function(payload){
  console.log(payload);
});
