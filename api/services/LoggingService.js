module.exports.log = function(tag, value){
    I6taglog.create({tag: tag, value : value}).exec((err,results)=>{});
};

module.exports.getAvg = function(where,cb){
    where = where || {};

}