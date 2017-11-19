var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

//set up the projection for the map
var albersProjection = d3.geoAlbersUsa()  //tell it which projection to use
    .scale(700)                           //tell it how big the map should be
    .translate([(width/2), (height/2)]);  //set the center of the map to show up in the center of the screen

//set up the path generator function to draw the map outlines
path = d3.geoPath()
    .projection(albersProjection);        //tell it to use the projection that we just made to convert lat/long to pixels

var stateLookup = d3.map();

var sizeScale = d3.scaleLinear().range([0, 50]);

var div = d3.select(".tooltip")
                .append("html")
                .attr("class", "tooltip")

var formatDecimal = d3.format(",.2f");
var formatMoney = function(d) { return "$" + formatDecimal(d); };

queue()
    .defer(d3.json, "./cb_2016_us_state_20m.json")
    .defer(d3.csv, "./daca.csv")
    .await(function(err, mapData, populationData){

      populationData.forEach(function(d){
          stateLookup.set(d.name, d.population);
      });

console.log(mapData.features)
    svg.selectAll("path")               //make empty selection
        .data(mapData.features)          //bind to the features array in the map data
        .enter()
        .append("path")                 //add the paths to the DOM
        .attr("d", path)                //actually draw them
        .attr("class", "feature")
        .attr('fill','#98A2CB')
        .attr("fill-opacity", .7)
        .attr('stroke','black')
        .attr('stroke-width',.2)
        .on("mouseover", function(d){
          d3.select(this)
          .attr("fill-opacity", 1)

          div.transition()
                .duration(200)

                .style("opacity", .9)
                .style("background", "#1fb35d")

                div	.html("<span>" + d.properties.NAME + "</span>" + "<br/>"+"<br/>" + "<strong>" + formatMoney(stateLookup.get(d.properties.NAME)) + "</strong>" )
                                .style("left",(d3.event.pageX) + 10 + "px")
                                .style("top",(d3.event.pageY - 28) + "px")

        })
        .on("mouseout", function(d){
          d3.select(this)
          .attr("fill-opacity", 0.7)
        })






    sizeScale.domain([0, d3.max(populationData.map(function(d){return +d.population}))]);

    var centroids = mapData.features.map(function (feature){
            return {name: feature.properties.NAME, center: path.centroid(feature)};
    })



    ;


    //noPR = centroids.filter(function(d) { return !isNaN(d.center[0]); });

    svg.selectAll('circle')
        .data(centroids)       //bind a single data point, with the long lat of Boston
                                                    //note that long is negative because it is a W long point!
        .enter()
        .append('circle')
        .attr('cx', function (d){
            return d.center[0];
        })
        .attr('cy', function (d){
            return d.center[1];
        })
        .attr('id',function(d){return d.name})
        .attr('r', function(d){
            return sizeScale(stateLookup.get(d.name))
        })
        .attr('fill','red')
        .attr('fill-opacity',.7)
        .on("mouseover", function(d){
          d3.select(this)
          .attr("fill-opacity", 1)
          div.transition()
                .duration(200)
                .style("opacity", .9)

                .style("background", '#1fb35d')

                div	.html("<span>" + formatMoney(stateLookup.get(d.name)) + "</span>"  )
                                .style("left",(d3.event.pageX) + 10 + "px")
                                .style("top",(d3.event.pageY - 28) + "px")

        })
        .on("mouseout", function(d){
          d3.select(this)
          .attr("fill-opacity", 0.7)
          
        })



  });
