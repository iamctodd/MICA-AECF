var width = 600,
    height = 400,
    centered;


var svg = d3.select("#map-chart").append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geo.albersUsa()
    .scale(800)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);


var color = d3.scale.quantize()
   .range(["rgb(240,230,200)","rgb(240,215,140)","rgb(240,205,80)","rgb(220,175,45)","rgb(200,155,5)"]);  

var g = svg.append("g")
    // .call(zoom);

g.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height);

d3.json("data/stateScores.json", function(error,data) {
    
    // console.log(data);
    


    d3.json("data/us-states.json", function(json) {
        // console.log(json);
        // console.log(data);

        var opp_scores = [];

        $.each(data, function(key,val){
            
            var state = val.title,
                value = val.opp_score;                

            opp_scores.push(value);


            for (var j = 0; j < json.features.length; j++) {
                // console.log(json.features)

                var jsonState = json.features[j].properties.name;
                //console.log(json.features[j].properties);

                if (state == jsonState) {
                    //console.log("match")

                    //Copy the data value into the JSON
                    json.features[j].properties.value = value;

                    //Stop looking through the JSON
                    break;

                }

            }

        });
        
        // console.log(opp_scores);
        color.domain([
            d3.min(opp_scores),
            d3.max(opp_scores)
        ]); 
        
            g.append("g")
                .attr("id","states")
            .selectAll("path")
               .data(json.features)
               .enter()
               .append("path")
               .attr("d", path)
               .attr("id",function(d,i){ return d.properties.name; })
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
               })
               .on("click",clicked);
        })
}) 

function clicked(d) {
    // console.log(d.properties.name);
    state = d.properties.name
      var x, y, k;

      if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
      } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
      }

      g.selectAll("path")
          .classed("active", centered && function(d) { return d === centered; });

      g.transition()
          .duration(750)
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
          .style("stroke-width", 1.5 / k + "px");

    smallMults(state);
}


/*function zoomed() {
  projection.translate(d3.event.translate).scale(d3.event.scale);
  g.selectAll("path").attr("d", path);
}*/
