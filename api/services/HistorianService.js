module.exports = _historian = {};
_historian.collectors = {};

/**
 * Initialize collectors
 */
_historian.init = function (cb){
    sails.log.info('Service || Initialize Historian service');
    Historian.find({limit:0}).exec((err,rows)=>{
        if(err){sails.log.error('Historian Service || Something wrong when read istorian configuration')}
        if(rows.length<1){sails.log.info('')}
        rows.forEach(row=>{
            _historian.collectors[row.name] = new collector(row);
        });
        if(typeof(cb)=='function'){cb();}        
    });
}


/**
 * 
 * @param {*} args collector parameter.( name, interval, enable, description, tags[] )
 */
function collector(args){
    this.name = args.name;
    this.interval = args.interval;
    this.enabled  = args.enabled;
    this.description = args.description;
    this.tags = args.tags;
    this.counter = 0;
    this.start();
}

collector.prototype.start = function(){
    if(this.enabled){
        this.cycle();
    }
};

collector.prototype.stop = function(){
    if(typeof(this.task)!=='undefined'){
        clearTimeout(this.task);
    }
};

collector.prototype.cycle = function(){
    if(this.enabled){
        this.counter++;
        console.log('collect : ' + this.counter);
        this.collect();
        this.task = setTimeout(collector.prototype.cycle.bind(this), this.interval);
    }
};

collector.prototype.collect =function(){
    this.tags.forEach(tag=>{
        if(typeof(TagService[tag].value)!=='undefined'){
            var _value = TagService[tag].value
            var logThis = true;
            
            if(typeof(TagService[tag].lastLogged)!=='undefined'){
                logThis = TagService[tag].lastLogged == _value ? false || !this.compress : true;
            }

            if(logThis){
                //write data to Historian database                
                Historian_data.create({
                    tag : tag,
                    value : _value
                }).exec((err,res)=>{
                    TagService[tag].lastLogged = _value;
                });
            }
        }
    });
};
