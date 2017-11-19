var height = 400;
var width = 500;

var padding = { "top": 125,
                "right": 100,
                "bottom": 0,
                "left": 50 };

var nestedData2;


var svg = d3.select("#svg3")
              .append("svg")
              .attr("height", height)
              .attr("width", width)
              .attr("class", "disvg")
              .append("g")
              .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

var selectedTeam;
var scaleZ;
var scaleQ;

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


d3.csv("players.csv", function(error, data) {
    if (error) { throw error };

    data.forEach(function(d){
      d.threep = +d.threep;
      d.threes = +d.threes;

    });

    var dataIn = data.filter( function(d) {
                     return d.threes >= 20
    });

    nestedData2 = d3.nest()
        .key(function(d){ return d.Team })
        .entries(dataIn)

;

    console.log(nestedData2);

    optionMenu();

    chartTitle();

    xLabel();
    yLabel();

    var firstElement = d3.select("option").property("value");

     selectedTeam = updateData(firstElement);

    scaleZ = d3.scaleLinear()
                 .domain([20, 70])
                 .range([0, 300])


   scaleQ = d3.scaleLinear()
                .domain([0.50,0])
                .range([0, 200])



    xAxis(scaleZ);
    yAxis(scaleQ);


    drawPoints2(selectedTeam);

});

function optionMenu() {

  var menu = d3.select(".menu-container")
                 .append("select")
                 .attr("name", "dropdown-menu")
                 .attr("class", "dropdownmenu")
                 .on("change", option);

      menu.selectAll("option")
           .data(nestedData2)
           .enter()
           .append("option")
           .text(function(d) { return d.key })
           .attr("value", function(d) { return d.key });
};




function colorFill(d) { if (d.Team == "Raptors") {
                                  return "#FF2819"

                      } else if (d.Team== "Celtics") {
                                  return "darkgreen"
                                }
                        else {
                                  return "darkorange"
                        }
                     };

function drawPoints2(dataPoints) {

        var selection = svg.selectAll("circle")
            .data(dataPoints)

       selection.transition()
                .duration(500)
                .ease(d3.easeSin)
                .attr("cx", function(d) {
                  return scaleZ(d.threes)
                })
                .attr("cy", function(d) {
                  return scaleQ(d.threep)
                })
                .attr("r", 7)
                .attr("fill", colorFill)

        selection.enter().append("circle")
                  .attr("cx", function(d) {
                    return scaleZ(d.threes)
                  })
                  .attr("cy", function(d) {
                    return scaleQ(d.threep)
                  })

                  .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9)
                .style("background", "darkorange")

            div	.html("<span>" + d.Player + "</span>" + "<br/>"+"<br/>"  + "3pt FGA%: <strong>" + d.threes+"</strong><br/>"  +"3pt FG%: <strong>"  + d.threep+ "</strong"  )
                .style("left",(d3.event.pageX) + 10 + "px")
                .style("top",(d3.event.pageY - 28) + "px")

            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(1000)
                .style("opacity", 0)
                .style("background", "orange");
        })

                  .attr("r", 0)
                    .transition()
                    .duration(500)
                    .ease(d3.easeSin)
                  .attr("r", 7)
                  .attr("fill", colorFill)



        selection.exit()
                    .transition()
                    .duration(200)
                    .ease(d3.easeSin)
                  .attr("r", 0)
                 .remove();

};


function chartTitle() {
          svg.append("text")
               .attr("x", 50)
               .attr("y", -50)
               .attr("font-size", 14)
               .text("3-Point Field Goal Attempts, 2016");
};


function xLabel() {
          svg.append("text")
              .attr("x", 150)
              .attr("y", 240)
              .attr("font-size", 13)
              .attr("text-anchor", "middle")
              .text("3pt FGA%");
};

function yLabel() {
          svg.append("text")
               .attr("transform", "rotate(270)")
               .attr("x", -100)
               .attr("y", -60)
               .attr("font-size", 13)
               .attr("text-anchor", "middle")
               .text("3pt Shooting %");
};


function xAxis(scale) {
          svg.append("g")
              .attr("transform", "translate(0, 200)" )
              .attr("class", "xAxis")
              .call(d3.axisBottom(scale));
};

function yAxis(scale) {
          svg.append("g")
              .attr("transform", "translate(0,0)")
              .attr("class", "yAxis")
              .call(d3.axisLeft(scale));
};

function updateData(newSelection) {

    return nestedData2.filter(function(d){ return d.key == newSelection })[0].values
};

function option() {
  selectValue = d3.select(this).property("value")
  newData = updateData(selectValue);





  drawPoints2(newData);

};
