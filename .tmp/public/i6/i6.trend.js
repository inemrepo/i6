'use strict';

var updateInterval = 1000;
var plot_area = '#i6-trend';

var trend_legend;
var trend_data = [];

var plot_options = {
    xaxis : {
        mode : 'time',
        timezone : 'browser',
        twelveHourClock : true
    },
    // crosshair: {
    //     mode: "xy",
    //     mode : "x",
    //     color : "rgb(0,0,255)"

    // },
    grid: {
        hoverable: true,
        clickable: true,
        autoHighlight: false
    },
    cursors: [
    //    {
    //         name: 'Red cursor',
    //         mode: 'x',
    //         color: 'red',
    //         showIntersections: false,
    //         showLabel: false,
    //         showValues : false,            
    //         symbol: 'triangle',
    //         position: {
    //             relativeX: 0.5,
    //             relativeY: 0.5
    //         }
    //     },
        {
            name: 'x cursor',
            mode: 'x',
            color: 'blue',
            showIntersections: false,
            snapToPlot: 0,
            symbol: 'diamond',
            position: {
                relativeX: 0.5,
                relativeY: 0.5
            }
        },
    //   {
    //         name: 'Green cursor',
    //         mode: 'y',
    //         color: 'green',
    //         showIntersections: false,
    //         symbol: 'cross',
    //         showLabel: true,
    //         showValues: true,
    //         fontSize: '10px',
    //         fontStyle: 'italic',
    //         position: {
    //             relativeX: 0.25,
    //             relativeY: 0.25
    //         }
    //     }
    ],
    
    // zoom: {
    //     interactive: true
    // },
    // pan: {
    //     interactive: true,
    //     enableTouch: true
    // }
};

//Initialize Plot
var plot;
function init_plot(){
    plot = $.plot(plot_area,trend_data, plot_options);
}
//Initialize Legend
function init_legend(data){
    if(!trend_legend){    
        trend_legend = $('table#trend').DataTable({
            data : data,
            lengthMenu : [5,10,25],
            scrollY : "150px",
            scrollCollapse : true,
            paging : false,
            dom : 't',
            responsive : true,
            columns : [
                {
                    mRender: function (data, type, row) {
                        return '<input type="checkbox" class="col-sm-2 select-checkbox"/><span class="col-md-2" style="height : 20px; background-color:rgb(' + row.color + ');"></span>'; 
                    }
                },
                { data : 'label'},
                { data : 'tag'},
                {
                    mRender : function(data,type,row){
                        return '<span id="time_' +row.tag + '"></span>';
                    }
                },
                {
                    mRender : function(data,type,row){
                        return '<span id="value_' +row.tag + '"></span>';
                    }
                },
                {data : 'unit'}

            ]
        });
    }
}

io.socket.on('connect', function(){
    io.socket.get('/hmi/init_trend', function(resData, jwRes){
        var data = [];
        for(var i=0; i<11; i++){
            data.push([moment().subtract(i, 'seconds'), Math.random() * 100]);
        }
        resData.data.forEach(d=>{
            trend_data.push(
                {
                    data : data,// [[moment(),0], [moment().subtract(3, 'minutes'), 0]],
                    label : d.tag,
                    color : "rgb(" + d.color + ")"
                }
            );
        });
        init_plot();
        init_legend(resData.data);
    });
});



// function onViewLoaded(){
//     $('table#trend').DataTable({
//         "lengthMenu": [5, 10, 25, 50, 75, 100],
//         "scrollY": "150px",
//         "scrollCollapse": true,
//         "paging": false,
//         "dom" : "t",
//         "responsive": true
//     });
// }



var _simulationData = [];
var realTime = true;
for(var i=100; i>0;i--){
    _simulationData.push([moment().subtract(i, 'seconds'), Math.random()*100]);
}
function simulationData(){
    if(_simulationData.length>=100){
        _simulationData.splice(0,1);
    }
    _simulationData.push([moment(), Math.random()*100]);
    return _simulationData;
}


/**
 * Init Plot
 */

 var sim = [{
    "label": "Europe (EU27)",
    "data": [[1999, 3.0], [2000, 3.9], [2001, 2.0], [2002, 1.2], [2003, 1.3], [2004, 2.5]],
    "color" : "rgb(255,00,00)"
}];

 

function getPlotData(){
    // var series = plot.getData();
    // var color = [];
    // series.forEach(serie=>{
    //     console.log(serie);
    // });
}

//init_plot();

/*
    Update Plot Data
*/
function update() {
    if(realTime){
        getHistorycalData();
    }

   setTimeout(update, updateInterval);
}

var allTags = [
    'HRSG1_CO_OUT',
    'HRSG1_CO2_OUT',
    'HRSG1_SO2_OUT',
    'HRSG1_NOX_OUT',
    'HRSG1_O2_OUT',
    'HRSG1_OPACITY_OUT',
    'HRSG1_PARTICULATE_OUT',
    'HRSG1_FLOW_GAS_OUT'
];

/**
 * Get data with ajax
 */

function getHistorycalData(){
    
    //getPlotData();
    $.get('/i6taglog/getChart',{
           timeStart : moment().subtract(4, 'minutes').toDate(),
           timeEnd : moment().toDate(),
           tags : allTags,
           limit : 0
       }, function(data){
           data.forEach(d=>{

           })
       //console.log([{data : simulationData(), label : 'Opacity = -0.00'}]);
       plot.setData(data);
       //plot.setData([{data : simulationData(), label : 'Opacity = -0.00'}]);    
       plot.setupGrid();    
       plot.draw();
       if(realTime)setTimeout(getHistorycalData, updateInterval);
   })
}
getHistorycalData()
//update();

// Setup Control Widget
$("#updateInterval").val(updateInterval).change(function () {
    var v = $(this).val();
    if (v && !isNaN(+v)) {
        updateInterval = +v;
        if (updateInterval < 100) {
            updateInterval = 100;
        } else if (updateInterval > 2000) {
            updateInterval = 2000;
        }
        $(this).val("" + updateInterval);
    }
});


$('#trendControl').find('button').on('click', function(e){
    var cmd = $(this).attr('i6-ctrl');
    switch(cmd){
        case 'play' :
            $(this).addClass('btn-primary');
            $('#trendControl').find('[i6-ctrl="pause"]').removeClass('btn-warning');

            realTime = true;
            break;
        case 'pause' :
            $(this).addClass('btn-warning');
            $('#trendControl').find('[i6-ctrl="play"]').removeClass('btn-primary');
            realTime = false;
            break;
    }
});
// Control Widget-----------------



var legends = $("#i6-trend .legendLabel");

legends.each(function () {
    // fix the widths so they don't jump around
    $(this).css('width', $(this).width());
});



var xCursorCoordinate, getCursorDataTimeOut

//Get Cursor Position then update legend data
$(plot_area).bind("cursorupdates", function (event, cursordata) {
    cursordata.forEach(function (cursor) {
        if(cursor.cursor=='x cursor'){
            console.log(cursor);
            xCursorCoordinate = {
                x : cursor.target.position.relativeX,
                y : cursor.target.position.relativeY,
            };
            if(!getCursorDataTimeOut){
                setTimeout(getCursorData, 50);
            }
        }
    });
});




function getCursorData() { 
    getCursorDataTimeOut = null;

    var cursor = xCursorCoordinate;

    //var axes = plot.getAxes();
    //console.log(axes);
    // if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
    //     pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
    //     return;
    // }

    var dataset = plot.getData();
    console.log(dataset);
    dataset.forEach(series=>{
        //console.log(series.data);
        var dataCount = series.data.length;
        var xSpace = 1/dataCount;
        var pointX = dataCount- 1 - ((cursor.x / xSpace)|0);
        console.log('Point X : ' + pointX);
        console.log('#value_' + series.label);
        $('#value_' + series.label).html(series.data[pointX][1]);
        $('#time_' + series.label).html(new Date(series.data[pointX][0]));
    });
    return;

    var i, j, dataset = plot.getData();
    for (i = 0; i < dataset.length; ++i) {

        var series = dataset[i];

        // Find the nearest points, x-wise

        for (j = 0; j < series.data.length; ++j) {
            if (series.data[j][0] > pos.x) {
                break;
            }
        }

        // Now Interpolate

        var y,
            p1 = series.data[j - 1],
            p2 = series.data[j];

        if (p1 == null) {
            y = p2[1];
        } else if (p2 == null) {
            y = p1[1];
        } else {
            y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
        }

        legends.eq(i).text(series.label.replace(/=.*/, "= " + y.toFixed(2)));
    }
}
