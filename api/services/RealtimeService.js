module.exports.register = function(req){
    var socket = req.socket;
    var interval = req.body.interval || 1000;

    if(typeof(global.automation.viewService)=='undefined'){global.automation.viewService={};}
    updateTags(socket, req.body.tags);
    global.automation.viewService[socket.id] = setInterval(function(){
        //console.log(req.body.tags);
        updateTags(socket, req.body.tags);
    }, interval);

    socket.on('disconnect', function(){
        unregister(socket.id);
    });
};

module.exports.unregister = function(id){
    unregister(id);
};

function unregister(id){
    console.log('Unregistering..');
    clearInterval(global.automation.viewService[id]);
    delete global.automation.viewService[id];  
}

function updateTags(socket, tags){
    var data = [];
    tags.forEach(tag=>{
        data.push(global.automation.tags[tag]);
    });

    sails.sockets.broadcast(socket.id,'updateTags', data );
}