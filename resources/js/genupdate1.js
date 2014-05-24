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
    text.attr("class", "update").
        transition().
            delay(325). // Some delay to ensure we see the exit first
            duration(750).
            attr("x", function(d, i) { return i * 32; });
    // Above: Move the updated letters to their new positions

    // ENTER
    // Create new elements as needed
    text.enter().append("text").
        attr("class", "enter").
        text(function(d) { return d; }).// Since the element and datum now remain matched via the key function, it doesn't change on update anymore, so we only need to set it on enter
        attr("dy", ".35em").
        // Place the new letters on the correct position. We don't combine it with the update anymore, since we want the update transition effect
        attr("x", function(d,i) { return i*32; }).
        // Going to make the new letters 'drop in'
        attr("y", -60). // So we start a bit on top
        style("fill-opacity", 1e-6). // And initially transparent
        transition().
            // And we transition to their target location
            delay(975). // Wait until remove and update animation have completed
            duration(750).
            attr("y", 0).
            style("fill-opacity", 1);

    // ENTER + UPDATE
    // Appending to the enter selection expands the update selection to include
    // entering elements; so, operations on the update selection after appending to
    // the enter selection will apply to both entering and updating nodes.
    // No more combination, since we choose 2 visualizations for the update/enter cases
    // text.attr("x", function(d, i) { return i * 32; });
    // Before the key function, the elements content was rewritten, but now we actually move them, since we keep the content stable



    // EXIT
    // Remove old elements as needed.
    text.exit().
        attr("class", "exit").
        transition().
            // Create a drop out, by moving them down on exit until we fully remove them
            duration(750).
            attr("y", 60).
            style("fill-opacity", 1e-6).
            remove();
}

// The initial display
update(alphabet);

// Grab a random sample of letters from the alphabet, in alphabetical order.
setInterval(function() {
    update(shuffle(alphabet).slice(0, Math.floor(Math.random() * 26)).sort());
}, 2000);

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
