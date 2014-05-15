var margin = { top: 20, right: 30, bottom: 30, left: 40 };
var width = 700 - margin.left - margin.right;
var height = 350 - margin.top - margin.bottom;

// Automatically space our columns, snap to pixel (round) and pad (percentage) between bars
var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
var y = d3.scale.linear().range([height, 0]); // We don't know the size of the domain yet !

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left").ticks(10, "%");


// In the column chart, we are going to fix both the width and height up front
var chart = d3.select(".chart").
    attr("width", width + margin.left + margin.right).
    attr("height", height + margin.top + margin.bottom).
    append("g").
    attr("transform", "translate("+margin.left+", "+margin.top+")");

// Let's load the data from a separate file
d3.tsv("data/bar_part3.tsv", type, function(error, data) {
    // Once the data has arrived, we can compute the data dependent parts
    x.domain(data.map(function(d) { return d.letter; }));
    y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

    // The axes are added AFTER the scales have their domain added
    // otherwise they cannot properly determine their labels
    chart.append("g").
        attr("class", "x axis").
        attr("transform", "translate(0, " + height+ ")").
        call(xAxis);

    chart.append("g").
        attr("class", "y axis").
        call(yAxis).
        append("text").
        attr("transform", "rotate(-90)").
        attr("y", 6).
        attr("dy", ".71em").
        style("text-anchor", "end").
        text("Frequency");

    // Bars only now, since the text labels are now part of the axis
    chart.selectAll(".bar").
        data(data).
        enter().append("rect").
        attr("class", "bar").
        attr("x", function(d) { return x(d.letter); }).
        attr("y", function(d) { return y(d.frequency); }).
        attr("height", function(d) { return height - y(d.frequency); }).
        attr("width", x.rangeBand());
});

// Small conversion function to transform the frequency to a number
function type(d) {
    d.frequency = +d.frequency; // coerce to number
    return d;
}


