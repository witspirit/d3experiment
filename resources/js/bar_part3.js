var width = 700;
var height = 350;

// Automatically space our columns, snap to pixel (round) and pad (percentage) between bars
var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

var y = d3.scale.linear().range([height, 0]); // We don't know the size of the domain yet !

// In the column chart, we are going to fix both the width and height up front
var chart = d3.select(".chart").
    attr("width", width).
    attr("height", height);

// Let's load the data from a separate file
d3.csv("data/bar_part2.csv", type, function(error, data) {
    // Once the data has arrived, we can compute the data dependent parts
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    var bar = chart.selectAll("g").
        data(data).
        enter().append("g").
        attr("transform", function(d,i) { return "translate("+x(d.name)+", 0)"; });

    bar.append("rect").
        attr("y", function(d) { return y(d.value); }).
        attr("height", function(d) { return height - y(d.value); }).
        attr("width", x.rangeBand());

    bar.append("text").
        attr("x", x.rangeBand() / 2).
        attr("y", function(d) { return y(d.value) + 3; }).
        attr("dy", "0.75em").
        text(function(d) { return d.value; });
});

// Small conversion function to transform to number if possible
function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}


