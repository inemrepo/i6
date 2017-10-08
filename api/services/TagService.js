module.exports = _tag;
var _tag = {
    action : {},
    tags : {}
};


/**
 * Initialize tags
 */
_tag.action.init = function(cb){
    sails.log.info('[Service] Initialize Tag service');
    Tag.find().populate('device').exec((err,rows)=>{
        if(err){sails.log.error('[Tag Service] Someting wrong when get tag properties');}

        rows.forEach(row=>{
            if(row.name=='action'){
                sails.log.warn('[Tag Service] Tag can\'t use "action" as name, please change!');
            }else{
                _tag.tags[row.name] = row;
            }
        });
        if(typeof(cb)=='function'){cb();}
    });

};

/**
 * Update tags value
 * 
 */
_tag.action.update = function(name, value){
    if(typeof(name)=='string'){
        _tag.tags[name].value = value;
    }else{
        name.forEach(_tag=>{
            _tag.tags[_tag.name] = _tag.value;
        })
    }
    _tag.tags[name].timestamp = new Date();
};
