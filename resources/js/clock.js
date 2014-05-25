var fields = function() {
    var currentTime = new Date();
    var second = currentTime.getSeconds();
    var minute = currentTime.getMinutes();
    var hour = currentTime.getHours() + minute/60;

    return data = [
        {
            "unit" : "seconds",
            "numeric" : second
        }, {
            "unit" : "minutes",
            "numeric" : minute
        }, {
            "unit" : "hours",
            "numeric" : hour
        }
    ];
};

var width = 400;
var height = 200;
var offsetX = 150;
var offsetY = 100;

var pi = Math.PI;

var scaleSecs = d3.scale.linear().domain([0, 59 + 999/1000]).range([0, 2*pi]);
var scaleMins = d3.scale.linear().domain([0, 59 + 59/60]).range([0, 2*pi]);
var scaleHours = d3.scale.linear().domain([0, 11+59/60]).range([0, 2*pi]);

var clock = d3.select("#clock").attr("width", width).attr("height", height).
        append("g").
        attr("transform", "translate("+offsetX + ", "+offsetY+")");

// Clock frame
clock.append("circle").
    attr("r", 80).attr("fill", "none").
    attr("class", "clock outercircle").
    attr("stroke", "black").
    attr("stroke-width", 2);

// Clock center
clock.append("circle").
    attr("r", 4).
    attr("fill", "black").
    attr("class", "clock innercircle");


var secondAngle = function(d) { return scaleSecs(d.numeric); };
var minuteAngle = function(d) { return scaleMins(d.numeric); };
var hourAngle = function(d) { return scaleHours(d.numeric % 12); };

var secondArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(70)
    .startAngle(secondAngle)
    .endAngle(secondAngle);

var minuteArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(70)
    .startAngle(minuteAngle)
    .endAngle(minuteAngle);

var hourArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(50)
    .startAngle(hourAngle)
    .endAngle(hourAngle);



var renderHands = function(data) {
    var handles = clock.selectAll(".clockhand")
        .data(data, function(d) { return d.unit; });

    handles.enter()
        .append("path")
        .attr("class", "clockhand")
        .attr("stroke", "black")
        .attr("stroke-width", function(d) {
            if (d.unit === "seconds") {
                return 2;
            } else if (d.unit === "minutes") {
                return 3;
            } else if (d.unit === "hours") {
                return 3;
            }
        })
        .attr("fill", "none");

    handles
        .attr("d", function(d) {
            if (d.unit === "seconds") {
                return secondArc(d);
            } else if (d.unit === "minutes") {
                return minuteArc(d);
            } else if (d.unit === "hours") {
                return hourArc(d);
            }
        })
};

setInterval(function() {
    return renderHands(fields());
}, 1000);
