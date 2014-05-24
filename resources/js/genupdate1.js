var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

var width = 960;
var height = 500;

var svg = d3.select(".alphabet").attr("width", width).attr("height", height).
            append("g").
                attr("transform", "translate(32, "+(height/2) + ")");

function update(data) {
    // DATA JOIN
    // Join new data with old element, if any
    // Data now joined based on key function
    var text = svg.selectAll("text").data(data, function(d) { return d; });

    // UPDATE
    // Update old elements as needed
    text.attr("class", "update");

    // ENTER
    // Create new elements as needed
    text.enter().append("text").
        attr("class", "enter").
        text(function(d) { return d; }).// Since the element and datum now remain matched via the key function, it doesn't change on update anymore, so we only need to set it on enter
        attr("dy", ".35em");

    // ENTER + UPDATE
    // Appending to the enter selection expands the update selection to include
    // entering elements; so, operations on the update selection after appending to
    // the enter selection will apply to both entering and updating nodes.
    text.attr("x", function(d, i) { return i * 32; });
    // Before the key function, the elements content was rewritten, but now we actually move them, since we keep the content stable

    // EXIT
    // Remove old elements as needed.
    text.exit().remove();
}

// The initial display
update(alphabet);

// Grab a random sample of letters from the alphabet, in alphabetical order.
setInterval(function() {
    update(shuffle(alphabet).slice(0, Math.floor(Math.random() * 26)).sort());
}, 1500);

// Shuffles the input array.
function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);

        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}
