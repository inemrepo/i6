module.exports = {
    data : [],
    init : function(){
        Trend.find().exec((err,rows)=>{
            var buffer = [];
            rows.forEach(row=>{
                row.unit = TagService.tags[row.tag].eu;
                buffer.push(row);
            });

            this.data = buffer;

            //console.log(this.data);
        });
    }
};