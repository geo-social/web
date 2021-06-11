wordScale = d3.scale.linear().domain([ 0.001, 0.005, 0.05, 0.5 ]).range(
		[ 15, 30, 50, 80 ]).clamp(true);

wordColor = d3.scale.linear().domain([ 15, 30, 50, 80 ]).range(
		[ "blue", "green", "orange", "red" ]);

viz = d3.select("#wordcloud").append("svg").attr("width", 300).attr("height", 300);

d3.json("data/topics.json", function(topic) {

	console.log(topic);
	d3.layout.cloud().size([ 300, 300 ])
	// .words([{"text":"test","size":wordScale(.01)},{"text":"bad","size":wordScale(1)}])
	.words(topic).rotate(function() {
		return ~~(Math.random() * 2) * 5;
	}).fontSize(function(d) {
		return wordScale(d.size);
	}).on("end", draw).start();

	function draw(words) {

		viz = d3.select("#svgTopics");

		viz.append("g").attr("transform", "translate(200,220)").selectAll(
				"text").data(words).enter().append("text").style("font-size",
				function(d) {
					return d.size + "px";
				}).style("fill", function(d) {
			return wordColor(d.size);
		}).style("opacity", .75).attr("text-anchor", "middle").attr(
				"transform",
				function(d) {
					return "translate(" + [ d.x, d.y ] + ")rotate(" + d.rotate
							+ ")";
				}).text(function(d) {
			return d.text;
		});

		// viz.append("text").data([ topic[0] ]).style("font-size", 20)
		// .style("font-weight", 900).attr("x", 100).attr("y", 20)
		// .text(function(d) {
		// return "Elections";
		// })

		// d3.select("#svg"+x).append("svg:text").text("Topic " + x);
		// viz.enter().append("svg:text").text("Topic " + x);

	}

});
