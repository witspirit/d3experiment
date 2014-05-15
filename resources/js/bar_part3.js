var width = 700;
var height = 350;

var y = d3.scale.linear().range([height, 0]); // We don't know the size of the domain yet !

// In the column chart, we are going to fix both the width and height up front
var chart = d3.select(".chart").
    attr("width", width).
    attr("height", height);

// Let's load the data from a separate file
d3.csv("data/bar_part2.csv", type, function(error, data) {
    // Once the data has arrived, we can compute the data dependent parts
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    var barWidth = width / data.length;

    var bar = chart.selectAll("g").
        data(data).
        enter().append("g").
        attr("transform", function(d,i) { return "translate("+i*barWidth+", 0)"; });

    bar.append("rect").
        attr("y", function(d) { return y(d.value); }).
        attr("height", function(d) { return height - y(d.value); }).
        attr("width", barWidth-1);

    bar.append("text").
        attr("x", barWidth / 2).
        attr("y", function(d) { return y(d.value) + 3; }).
        attr("dy", "0.75em").
        text(function(d) { return d.value; });
});

// Small conversion function to transform to number if possible
function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}


