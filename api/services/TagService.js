module.exports = tag = {};
var action = tag.action = {};

/**
 * Initialize tags
 */
action.init = function(cb){
    sails.log.info('Service || Initialize Tag service');
    Tag.find().populate('device').exec((err,rows)=>{
        if(err){sails.log.error('Tag Service || Someting wrong when get tag properties');}

        rows.forEach(row=>{
            if(row.name=='action'){
                sails.log.warn('Tag Service || Tag can\'t use "action" as name, please change!');
            }else{
                tag[row.name] = row;
            }
        });
        if(typeof(cb)=='function'){cb();}
    });

};

/**
 * Update tags value
 * 
 */
action.update = function(name, value){
    if(typeof(name)=='string'){
        if(name!=="action"){
            tag[name].value = value;
        }
    }else{
        name.forEach(_tag=>{
            tag[_tag.name] = _tag.value;
        })
    }
    tag[name].timestamp = new Date();
};
