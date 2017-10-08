module.exports = simulator = {};


simulator.start = function(){
    var tags = Object.keys(TagService.tags);
    setInterval(function(){
        tags.forEach(tag=>{
            if(tag.name !== 'action'){
                TagService.tags[tag].value = Math.random() * 100;
            }
        });        
    }, 1000);
};
