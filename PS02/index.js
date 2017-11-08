var svg = d3.select('svg');

/* Your code goes here */

var svg = d3.select('svg');

d3.csv('./data.csv', function (d){

  console.log(d);

  svg.selectAll('circle')
    .data(d)
    .enter()
    .append('circle')
    .attr("cx", function(d){
      console.log(d.x)
    return d.x;
    })
    .attr("cy", function(d){
      return d.y;

    })

    .attr('r', function(d){
      return d.r;

    })

    .attr("fill", function() { return "hsl(" + Math.random() * 360 + ", 100%, 50%)"

    })


      .attr('fill', function(d){
        return randomColor();
})
})
