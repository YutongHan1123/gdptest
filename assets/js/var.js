var legendLabels = [{
    label: "2007年",
    class: "lollipop-start dot_chart_legend"
},
{
    label: "2014年",
    class: "lollipop-median dot_chart_legend"
},
{
    label: "2021年",
    class: "lollipop-end dot_chart_legend"
}
];

var legendX = 53,
legendY = 40,
spaceBetween = 80,
titleOffset = -50;

var DURATION = 500;

var margin = {
    top: 50,
    right: 100,
    bottom: 40,
    left: 40
};

var svg = d3.select("#chart");

var width = +document.body.clientWidth;
var height = 800 - margin.top - margin.bottom;

document.querySelector("#chart").setAttribute('width', width);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScaleScatter = d3.scaleLinear()
    .range([0, width - margin.right]);

var xScaleBar = d3.scaleLinear()
    .range([0, width - margin.right]);

var yScaleScatter = d3.scaleLinear()
    .range([height, 0]);

var yScaleBar = d3.scaleBand()
    .range([height, 0])
    .padding(0.2);

var idScale = d3.scaleOrdinal()
    .range([
        // '#6aedc7', //green
        // '#39c2c9', //blue
        // '#ffce00' //yellow
        '#ffa71a', //orange
        // '#f866b9', //pink
        // '#998ce3' //purple
    ]);

var lineGenerator = d3.line();

var axisLinePath = function(d) {
    return lineGenerator([
        [xScaleScatter(d) + 0.5, 0],
        [xScaleScatter(d) + 0.5, height]
    ]);
};

var lollipopLinePath = function(d) {
    if (d.return != "") {
        return lineGenerator([
            [xScaleScatter(d.return), 0],
            [xScaleScatter(d.equity), 0]
        ])
    } else {
        return lineGenerator([
            [xScaleScatter(d.risk), 0],
            [xScaleScatter(d.equity), 0]
        ])
    }
};

// dot plot的legend
var legend = svg.append("g")
.attr("transform", "translate(" + [legendX, legendY] + ")");

// variable for tooltip 
var tooltip = d3.select(".tooltip");

var layer1 = svg.append('g');
var layer2 = svg.append('g');

var scatterWords = "点击最右方圆圈，了解详情"
var barWords = "点击柱形图，了解详情"