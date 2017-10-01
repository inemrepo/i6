/*global jQuery, $*/
/*jshint browser: true*/

$(function () {
    'use strict';
    var plot;
    var offset = 0.0;
    var sin = [],
        cos = [];

    function updateData() {
        sin = [];
        cos = [];
        offset += 0.025;
        for (var i = 0; i < 8; i += 0.01) {
            sin.push([i, 1 + Math.sin(i + offset)]);
            cos.push([i, 1 + Math.cos(i + offset)]);
        }
    }

    function updateChart() {
        setTimeout(updateChart, 16);

        if ($('#checkbox').prop('checked')) {
            updateData();

            plot.setData([
                {
                    data: sin,
                    label: "sin(x)"
                },
                {
                    data: cos,
                    label: "cos(x)"
                }

            ]);

            plot.setupGrid();
            plot.draw();
        }
    }

    updateData();
    plot = $.plot("#placeholder", [
        {
            data: sin,
            label: "sin(x)"
        },
        {
            data: cos,
            label: "cos(x)"
        }
    ], {
        series: {
            lines: {
                show: true
            }
        },
        cursors: [
            {
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
            },
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
            {
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
            }
        ],
        grid: {
            hoverable: true,
            clickable: true,
            autoHighlight: false
        },
        yaxis: {
            min: -1.2,
            max: 1.2,
            autoscale: 'exact'
        },
        zoom: {
            interactive: true
        },
        pan: {
            interactive: true,
            enableTouch: true
        }
    });

    $("#placeholder").bind("cursorupdates", function (event, cursordata) {
        $('#hoverdata').empty();
        var ul1 = $('#hoverdata').append('<UL style="padding-left: 30px;">').find("UL");
        cursordata.forEach(function (cursor) {
            ul1.append("<LI>" + cursor.cursor + "</LI>");
            var ul2 = ul1.append('<UL style="padding-left: 30px;">').find("UL").last();
            cursor.points.forEach(function (point) {
                var x, y;
                if (cursor.target.mode === 'xy') {
                    x = point.x.toFixed(4);
                    y = point.y.toFixed(4);
                } else if (cursor.target.mode === 'x') {
                    x = cursor.x.toFixed(4);
                    y = point.y.toFixed(4);
                }
                 else if (cursor.target.mode === 'y') {
                    x = point.x.toFixed(4);
                    y = cursor.y.toFixed(4);
                }
                ul2.append("<LI> x:" + x + " y: " + y + "</LI>");
            });
        });
    });

    updateChart();
});