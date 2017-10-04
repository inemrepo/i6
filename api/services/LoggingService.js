module.exports.log = function(tag, value){
    var data = {tag:tag, value : value};
    I6taglog.create(data).exec((err,results)=>{});
    //I6taglog.publishUpdate(data);
};

module.exports.getChart = function (tags, timeStart, timeEnd, limit,cb){
    var criteria = {
        limit : limit || 1000,
        where : {  
            createdAt : {
                '>=' : timeStart || sails.moment().subtract(1, 'minutes').toDate(),
                '<=' : timeEnd || sails.moment().toDate()
            }
        }
    };
    //limit = limit || 1000;
    if(typeof(tags)!=='undefined'){
        if(typeof(tags)=='string'){
            if(tags !=='*'){
                criteria.where.tag = tags;
            }
        }else{
            criteria.where.tag = [];
            tags.forEach(tag=>{
                criteria.where.tag.push(tag);
            });
        }
    }

    I6taglog.find(criteria).exec((err,rows)=>{
        var chartData = {};
        rows.forEach(row=>{
            if(typeof(chartData[row.tag])== 'undefined'){
                chartData[row.tag]= {
                    label : row.tag,
                    data : []
                }
            }
            chartData[row.tag].data.push([new Date(row.createdAt).getTime(), row.value]);
        });
        var keys = Object.keys(chartData);
        var responseData = [];
        keys.forEach(key=>{
            responseData.push(chartData[key]);
        });
        if(typeof(cb)=='function'){cb(responseData)}   
        console.log(JSON.stringify(criteria));
    
    })
};

module.exports.getAvg = function(where,cb){
    where = where || {};
}

setInterval(function(){
    LoggingService.log('HRSG1_CO2_OUT', (Math.random() * 20) + 15);
    LoggingService.log('HRSG1_CO_OUT', (Math.random() * 20) + 30);
    LoggingService.log('HRSG1_O2_OUT', (Math.random() * 20) + 44);
    LoggingService.log('HRSG1_FlOW_GAS_OUT', (Math.random() * 40));
    LoggingService.log('HRSG1_NOX_OUT', (Math.random() * 40) + 10);
    LoggingService.log('HRSG1_OPACITY_OUT', (Math.random() * 100));
    LoggingService.log('HRSG1_SO2_OUT', (Math.random() * 14)+20);
    LoggingService.log('HRSG1_PARTICULATE_OUT', (Math.random() * 30)+20);
}, 1000);
