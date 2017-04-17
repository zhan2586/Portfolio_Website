// JavaScript Document
var diameter = 500, //max size of the bubbles
    color = d3.scale.category20(); //color category

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.0);
    
var svg = d3.select("#bubble-chart")
    .append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

var tooltip = d3.select('#content').append("div")
	  .style("position", "absolute")
	  .style("z-index", "10")
    .style("color", "white")
	  .style("visibility", "hidden")
    .style("border", "1px solid white")
    .style("fill", "black")
    .text("tooltip");


d3.csv("files/data.csv", function(error, data){

    //convert numerical values from strings to numbers
    data = data.map(function(d){ d.value = +d["Amount"]; return d; });

    //bubbles needs very specific format, convert data to this.
    var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

    //setup the chart
    var bubbles = svg.append("g")
        .attr("transform", "translate(0,0)")
        .selectAll(".bubble")
        .data(nodes)
        .enter();

    //create the bubbles
    bubbles.append("circle")
        .attr("r", function(d){ return d.r; })
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .style("fill","gray")
        .on("mouseover", function(d) {
              d3.select(this).style("fill", color(d.value));
              tooltip.transition()
                .duration(200)
                .style("visibility", "visible")
                .style("background-color",this.style.fill);
                tooltip.html("$" + d.value);

	      })
	      .on("mousemove", function() {
	          return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
	      })
	      .on("mouseout", function(){
	      	tooltip.transition()
                .duration(200)
                .style("visibility", "hidden");
            });

    //format the text for each bubble
    bubbles.append("text")
        .attr("x", function(d){ return d.x; })
        .attr("y", function(d){ return d.y + 5; })
        .attr("text-anchor", "middle")
        .text(function(d){ return d["Country"]; })
        .style({
            "fill":"white",
            "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
            "font-size": "12px"
        })
        .style("cursor","default")
        .on("mouseover", function(d) {
              tooltip.transition()
                .duration(200)
                .style("visibility", "visible");
                tooltip.html("$" + d.value);
          }).on("mousemove", function() {
              return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
          })
          .on("mouseout", function(){
            tooltip.transition()
                .duration(200)
                .style("visibility", "hidden");});
})
