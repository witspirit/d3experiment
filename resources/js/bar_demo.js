var data = [{year: 2006, books: 54},
    {year: 2007, books: 43},
    {year: 2008, books: 41},
    {year: 2009, books: 44},
    {year: 2010, books: 35}];

var barWidth = 40;
var width = (barWidth + 10) * data.length;
var height = 200;
var padding = 30;

var xScale = d3.scale.linear().domain([0, data.length]).range([0, width]);
var highestValue = d3.max(data, function(datum) { return datum.books; }); // Determine the largest value in the collection
var yScale = d3.scale.linear().domain([0, highestValue]).rangeRound([0, height]);

// Add the SVG canvas to the page
var barDemo = d3.select("#bar-demo").
    append("svg:svg").
    attr("width", width).
    attr("height", height+padding);

function barHeight(datum) {
    return yScale(datum.books);
}

function barLeftEdge(datum, index) {
    return xScale(index);
}

function barRightEdge(datum, index) {
    return barLeftEdge(datum, index) + barWidth;
}

function barTopEdge(datum, index) {
    return height - barHeight(datum);
}

var centerFromRightEdge = -barWidth/2;

// Draws the actual bars
barDemo.selectAll("rect").
    data(data).
    enter().
    append("svg:rect").
    attr("x", barLeftEdge).
    attr("y", barTopEdge).
    attr("height", barHeight).
    attr("width", barWidth).
    attr("fill", "#2d578b");

// Add text anchors to the bars
barDemo.selectAll("text").
    data(data).
    enter().
    append("svg:text").
    attr("x", barRightEdge).
    attr("y", barTopEdge).
    attr("dx", centerFromRightEdge).
    attr("dy", "1.2em").
    attr("text-anchor", "middle").
    text(function (datum, index) { return datum.books; }).
    attr("fill", "white");


// add y-axis text
barDemo.selectAll("text.yAxis").
    data(data).
    enter().
    append("svg:text").
    attr("x", barRightEdge).
    attr("y", height).
    attr("dx", centerFromRightEdge).
    attr("text-anchor", "middle").
    attr("style", "font-size: 12; font-family: Helvetica, sans-serif").
    text(function(datum) { return datum.year; }).
    attr("transform", "translate(0, 18)").
    attr("class", "yAxis");