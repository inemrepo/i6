setTimeout(function(){
    sails.log.info('Service || Initialize Automation service');
    TagService.action.init(function(){
        HistorianService.init();
    });


}, 3000);