var width = 420;
var barHeight = 20;

var x = d3.scale.linear().range([0, width]); // We don't know the size of the domain yet !

var chart = d3.select(".chart").
    attr("width", width); // Likewise, we cannot yet determine the full height

// Let's load the data from a separate file
d3.csv("data/bar_part2.csv", type, function(error, data) {
    // Once the data has arrived, we can compute the data dependent parts
    x.domain([0, d3.max(data, function(d) { return d.value; })]);

    chart.attr("height", barHeight * data.length);

    var bar = chart.selectAll("g").
        data(data).
        enter().append("g").
        attr("transform", function(d,i) { return "translate(0, "+i*barHeight+")"; });

    bar.append("rect").
        attr("width", function(d) { return x(d.value); }).
        attr("height", barHeight-1);

    bar.append("text").
        attr("x", function(d) { return x(d.value) - 3; }).
        attr("y", barHeight / 2).
        attr("dy", "0.35em").
        text(function(d) { return d.value; });
});

// Small conversion function to transform to number if possible
function type(d) {
    d.value = +d.value; // coerce to number
    return d;
}


