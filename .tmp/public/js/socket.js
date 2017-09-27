'use strict';

/*
io.socket.get('/realtime/subscribe', function(res){});

io.socket.on('message', function onServerSentEvent (msg) {
  console.log(msg);
  switch(msg.verb) {

    case 'created':
      $scope.messages.push(msg.data);
      $scope.$apply();
      break;

    default: return;
  }
});*/

setTimeout(console.clear,300);

function subscribe(){
  io.socket.get('/tag', function(resData, jwres) {
    if(typeof(resData) == 'object'){      
      resData.forEach(function(data){
        $('#dataPost').append('<tr id="r' + data.id +'"><td class="id">' + data.id + '</td><td class="name">' + data.name + '</td><td class="value">' + data.value + '</td></tr>');
          
      });
      return;
    }
    var data = resData;
    $('#dataPost').append('<tr id="r' + data.id +'"><td class="id">' + data.id + '</td><td class="name">' + data.name + '</td><td class="value">' + data.value + '</td></tr>');
          
  })
}

subscribe();
io.socket.on('tag', function(event){
  console.log(event);
  switch(event.verb){
    case 'created' :
      var data=event.data;
      $('#dataPost').append('<tr id="r' + data.id +'"><td class="id">' + data.id + '</td><td class="name">' + data.name + '</td><td class="value">' + data.value + '</td></tr>');
      break;
    case 'destroyed' :
      $('#r' + event.previous.id).remove();
      break;
    case 'updated' :
      var keys = Object.keys(event.previous);
      keys.forEach(function(key){
        $('#r' + event.previous.id).find('.' + key).html(event.data[key]);
      });
      break;
  }
})

