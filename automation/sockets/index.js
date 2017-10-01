var viewService = require(__dirname + '/service-view.js');


//Data diload ketika socket client join ke room melalui kontroler Runtime.join
global.automation.viewService = {};

return;

sails.io.sockets.on('connection', function(socket) {
    var serviceID = socket.id;

    viewService.new(serviceID);

    socket.on('disconnect', function() {
        viewService.remove(serviceID);
    });
});
