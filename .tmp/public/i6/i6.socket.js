'use strict';

var i6tags = [];

$('document').ready(function(){
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
    // io.socket.get('/runtime/join',{data : "34"}, function(resData,jwres){});
    io.socket.request({
      method : 'GET',
      url : '/runtime/join',
      data : {tags : i6tags}
    }, function(resData, jwres){

    });
  }


});


//event received
io.socket.on('updateTags', function(tags){
  tags.forEach(function(tag){
    var keys = Object.keys(tag);
    keys.forEach(key=>{
      $('[i6-tag="'+ tag.name +'"][i6-prop="'+ key +'"]').html(tag[key]);
      console.log('[i6-tag="'+ tag.name +'",i6-prop="'+ key +'"]');
    });
    console.log(tag.name + ' : ' + tag.value);
    console.log(tag.name + ' : ' + tag.description);
  });
});
