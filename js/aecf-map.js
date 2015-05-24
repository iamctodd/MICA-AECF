var width = 960,
    height = 600;

console.log(d3.select("#map-chart"));

var svg = d3.select("#map-chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.albersUsa()
    .scale(900)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);


var color = d3.scale.quantize()
   .range(["rgb(240,230,200)","rgb(240,215,140)","rgb(240,205,80)","rgb(220,175,45)","rgb(200,155,5)"]);  
 
var zoom = d3.behavior.zoom()
    .translate(projection.translate())
    .scale(projection.scale())
    .scaleExtent([height, 8 * height])
    .on("zoom", zoomed);

var g = svg.append("g")
    .call(zoom);

g.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

d3.csv("/sandbox/data/sdr091b.csv", function(data) {
    console.log(data);
    color.domain([
            d3.min(data, function(d) { return +d.DRPWH; }),
            d3.max(data, function(d) { return +d.DRPWH; })
    ]);


    d3.json("/sandbox/data/us-states.json", function(json) {
        console.log(json);

        //Merge the ag. data and GeoJSON
        //Loop through once for each ag. data value
        for (var i = 0; i < data.length; i++) {

            //Grab state name
            var dataState = data[i].STATENAME;
            //console.log(dataState);

            //Grab data value, and convert from string to float
            var dataValue = parseFloat(data[i].DRPWH);
            //console.log(dataValue);

            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {
                //console.log(json.features)

                var jsonState = json.features[j].properties.name;
                //console.log(json.features[j].properties);

                if (dataState == jsonState) {
                    //console.log("match")

                    //Copy the data value into the JSON
                    json.features[j].properties.value = dataValue;

                    //Stop looking through the JSON
                    break;

                }

            }
        }

        for (var i = 0; i < data.length; i++) {
            g.append("g")
                .attr("id","states")
            .selectAll("path")
               .data(json.features)
               .enter()
               .append("path")
               .attr("d", path)
               .style("fill", function(d) {
                    //Get data value
                    var value = d.properties.value;

                    if (value) {
                        // console.log(value)
                            //If value exists…
                            return color(value);
                    } else {
                            //If value is undefined…
                            return "#EEE";
                    }
               });
       }
    })
}) 

function clicked(d) {
  var centroid = path.centroid(d),
      translate = projection.translate();

  projection.translate([
    translate[0] - centroid[0] + width / 2,
    translate[1] - centroid[1] + height / 2
  ]);

  zoom.translate(projection.translate());

  g.selectAll("path").transition()
      .duration(700)
      .attr("d", path);
}

function zoomed() {
  projection.translate(d3.event.translate).scale(d3.event.scale);
  g.selectAll("path").attr("d", path);
}
