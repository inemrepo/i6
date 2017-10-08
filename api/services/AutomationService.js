var async = require('async');

setTimeout(function(){
    sails.log.info('Service || Initialize Automation service');
    startAutomation();
    // TagService.action.init(function(){
    //     HistorianService.init();
    // });
}, 3000);

function startAutomation(){return;
    async.series([
        TagService.action.init,
        SimulatorService.start,
        HistorianService.init,
        TrendService.init

    ], function(){

    });
}