homeLoc = { lat: 51.297978,
            lng: 4.475911};

var width = 700;
var height = 525;
var padding = 50;

// the vertical axis is a time scale that runs from 00:00 - 23:59
// the horizontal axis is a time scale that runs from the 2014-01-01 to 2014-12-31

var y = d3.time.scale().domain([new Date(2014, 0, 1), new Date(2014, 0, 1, 23, 59)]).range([0, height]);
var x = d3.time.scale().domain([new Date(2014, 0, 1), new Date(2014, 11, 31)]).range([0, width]);

var monthNames = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Generate data set, basically for every day of the year we want a data item
var data = [];
var startDate = new Date(2014, 0, 1);
var day = 24*60*60*1000;
for (var i=0; i < 365; i++) {
    var date = new Date(startDate.getTime()+i*day);
    var dateTimes = SunCalc.getTimes(date, homeLoc.lat, homeLoc.lng);

    var dataPoint = {
        date: date,
        sunrise : [dateTimes.sunrise.getHours(), dateTimes.sunrise.getMinutes()],
        sunset : [dateTimes.sunset.getHours(), dateTimes.sunset.getMinutes()]
    };

    data.push(dataPoint);
}
console.log(data);

function yAxisLabel(hour) {
    // Not my finest piece of code, but gets the job done without importing another lib (or duplicating it here)
    var base = hour.toString()+":00";
    if (hour < 10) {
        return "0"+base;
    } else {
        return base;
    }
}

// The labels along the x axis will be positioned on the 15th of the month
function midMonthDates() {
    return d3.range(0, 12).map(function(i) { return new Date(2014, i, 15) });
}

var dayLength = d3.select("#daytime-demo").
    append("svg:svg").
    attr("width", width + padding * 2).
    attr("height", height + padding*2);

// create a group to hold the axis-related elements
var axisGroup = dayLength.append("svg:g").
    attr("transform", "translate("+padding+","+padding+")");

// draw the x and y tick marks. Since they are behind the visualization, they
// can be drawn all the way across it. Because the group has been
// translated, they stick out the left side by going negative.

// Round and add 0.5 to fix anti-aliasing effects (see http://www.recursion.org/d3-for-mere-mortals/)
function fixAntiAliasing(position) {
    return d3.round(position+0.5);
}

axisGroup.selectAll(".yTicks").
    data(d3.range(1, 24)).
    enter().append("svg:line").
    attr("x1", -5).
    attr("y1", function(d) { return fixAntiAliasing(y(new Date(2014, 0, 1, d))); }).
    attr("x2", width+5).
    attr("y2", function(d) { return fixAntiAliasing(y(new Date(2014, 0, 1, d))); }).
    attr("stroke", "lightgray").
    attr("class", "yTicks");

axisGroup.selectAll(".xTicks").
    data(midMonthDates).
    enter().append("svg:line").
    attr("x1", x).
    attr("y1", -5).
    attr("x2", x).
    attr("y2", height+5).
    attr("stroke", "lightgray").
    attr("class", "xTicks");

// Since we need to create the same label layout above/below
// and left/right, we extract some helper function that captures
// the common part.

function xAxis(selector, yPosition, cssClass) {
    axisGroup.selectAll(selector).
        data(midMonthDates).
        enter().append("svg:text").
        text(function (d, i) { return monthNames[i]; }).
        attr("x", x).
        attr("y", yPosition).
        attr("text-anchor", "middle").
        attr("class", cssClass);
}

xAxis("text.xAxisTop", -8, "axis xAxisTop");
xAxis("text.xAxisBottom", height+15, "xAxisBottom");

function yAxis(selector, xPosition, cssClass, anchor) {
    axisGroup.selectAll(selector).
        data(d3.range(1,24)).
        enter().append("svg:text").
        text(yAxisLabel).
        attr("x", xPosition).
        attr("y", function(d) { return y(new Date(2014, 0, 1, d)); }).
        attr("dy", "3").
        attr("class", cssClass).
        attr("text-anchor", anchor);
}

yAxis("text.yAxisLeft", -7, "yAxisLeft", "end");
yAxis("text.yAxisRight", width+7, "yAxisRight", "start");

// create a group for the sunrise and sunset paths

var lineGroup = dayLength.append("svg:g").
    attr("transform", "translate("+padding+", "+padding+")");

// draw the background. The part of this that remains uncovered will
// represent the daylight hours.

lineGroup.append("svg:rect").
    attr("x", 0).
    attr("y", 0).
    attr("height", height).
    attr("width", width).
    attr("fill", "lightyellow");

// The meat of the visualization is surprisingly simple. sunriseLine
// and sunsetLine are areas (closed svg:path elements) that use the date
// for the x coordinate and sunrise and sunset (respectively) for the y
// coordinate. The sunrise shape is anchored at the top of the chart, and
// sunset area is anchored at the bottom of the chart.

var sunriseLine = d3.svg.area().
    x(function(d) { return x(d.date); }).
    y1(function(d) { return y(new Date(2014, 0, 1, d.sunrise[0], d.sunrise[1])); }).
    interpolate("linear");

lineGroup.append("svg:path").
    attr("d", sunriseLine(data)).
    attr("fill", "steelblue");

var sunsetLine = d3.svg.area().
    x(function(d) { return x(d.date); }).
    y0(height).
    y1(function(d) { return y(new Date(2014, 0, 1, d.sunset[0], d.sunset[1])); }).
    interpolate("linear");

lineGroup.append("svg:path").
    attr("d", sunsetLine(data)).
    attr("fill", "steelblue");

// finally, draw a line representing 12:00 across the entire
// visualization

lineGroup.append("svg:line").
    attr("x1", 0).
    attr("y1", fixAntiAliasing(y(new Date(2014, 0, 1, 12)))).
    attr("x2", width).
    attr("y2", fixAntiAliasing(y(new Date(2014, 0, 1, 12)))).
    attr("stroke", "lightgray");

// A line for the current date

var currentDate = new Date();
lineGroup.append("svg:line").
    attr("x1", x(currentDate)).
    attr("y1", 0).
    attr("x2", x(currentDate)).
    attr("y2", height).
    attr("stroke", "lightgray");