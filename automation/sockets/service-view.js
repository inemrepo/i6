module.exports.new = function(id){
    interval = global.automation.viewService[id].data.interval || 1000;
    global.automation.viewService[id].timer = setInterval(function(){
        console.log(global.automation.viewData[id].data);
    },interval);
}


module.exports.remove = function(id){
    clearInterval(global.automation.viewService[id]);
    delete global.automation.viewService[id];
    console.log('service removed : ' + id);
}