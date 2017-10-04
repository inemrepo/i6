'use strict';

var updateInterval = 1000;


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
var plot = $.plot('#i6-trend',
    [],
    {
        xaxis : {
            mode : 'time',
            timezone : 'browser',
            twelveHourClock : true
        },
        crosshair: {
            mode: "xy",
            mode : "x"
        },
        grid: {
            hoverable: true,
            clickable: true,
            autoHighlight: false
        },
        cursors: [
     /*        {
                name: 'Red cursor',
                mode: 'x',
                color: 'red',
                showIntersections: false,
                showLabel: true,
                symbol: 'triangle',
                position: {
                    relativeX: 0.75,
                    relativeY: 0.5
                }
            }, */
            {
                name: 'Blue cursor',
                mode: 'xy',
                color: 'blue',
                showIntersections: false,
                snapToPlot: -1,
                symbol: 'diamond',
                position: {
                    relativeX: 0.5,
                    relativeY: 0.5
                }
            },
      /*       {
                name: 'Green cursor',
                mode: 'y',
                color: 'green',
                showIntersections: false,
                symbol: 'cross',
                showLabel: true,
                showValues: true,
                fontSize: '10px',
                fontStyle: 'italic',
                position: {
                    relativeX: 0.25,
                    relativeY: 0.25
                }
            } */
        ],
        
        zoom: {
            interactive: true
        },
        pan: {
            interactive: true,
            enableTouch: true
        }
    }
);

function getPlotData(){
    var series = plot.getData();
    series.forEach(serie=>{
        console.log(serie);
    });
}


/*
    Update Plot Data
*/
function update() {
    if(realTime){
        getHistorycalData();
    }

   // setTimeout(update, updateInterval);
}


/**
 * Get data with ajax
 */

function getHistorycalData(){
    
    getPlotData();
    $.get('/i6taglog/getChart',{
           timeStart : moment().subtract(4, 'minutes').toDate(),
           timeEnd : moment().toDate(),
           tags : ['HRSG1_SO2_OUT', 'HRSG1_OPACITY_OUT'],
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

var updateLegendTimeout = null;
var latestPosition = null;

function updateLegend() {

    updateLegendTimeout = null;

    var pos = latestPosition;

    var axes = plot.getAxes();
    if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
        pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
        return;
    }

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
        //console.log(legends.eq(i).text());
    }
}

$("#i6-trend").bind("plothover",  function (event, pos, item) {
    latestPosition = pos;
    if (!updateLegendTimeout) {
        updateLegendTimeout = setTimeout(updateLegend, 50);
    }
}).bind("plotclick", function (event, pos, item) {
    plot.lockCrosshair(pos);
});