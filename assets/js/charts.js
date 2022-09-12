// bar sub title
legend.append("g")
    .attr("class", "title")
    .append("text")
    .attr("x", titleOffset)
    .text("2021年")
    .attr("class", "bar_chart_title")

// add dot legend
legend.selectAll("circle")
    .data(legendLabels)
    .enter().append("circle")
    .attr("cx", function(d, i) {
        return spaceBetween * i - 40;
    })
    .attr("cy", -10)
    .attr("r", 5)
    .attr("class", function(d) {
        return d.class
    })
    .attr('opacity', 0);

// add legend words
legend.append("g")
    .selectAll("text")
    .data(legendLabels)
    .enter().append("text")
    .attr("x", function(d, i) {
        return spaceBetween * i - 30;
    })
    .attr("y", -6)
    .text(function(d) {
        return d.label
    })
    .attr("class", function(d) {
        return d.class
    })
    .attr('opacity', 0)

d3.csv('assets/data/data.csv', function(d) {
    d.risk = +d.risk;
    d.return = +d.return;
    d.equity = +d.equity;
    d.interest = +d.interest;
    return d;
}, function(data) {

    data = data.sort(function(a, b) {
        return a.gdp2021 - b.gdp2021;
    })

    xScaleScatter.domain([0, d3.max(data, function(d) {
        return d.equity;
    })]).nice();
    xScaleBar.domain([0, d3.max(data, function(d) {
        return d.gdp2021;
    })]).nice();
    yScaleScatter.domain([0, d3.max(data, function(d) {
        return d.equity;
    })]).nice();
    yScaleBar.domain(data.map(function(d) {
        return d.id;
    }));

    var xAxis = g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScaleBar).ticks(3));

    xAxis.select(".domain").remove();

    xAxis.selectAll(".tick")
        .attr("y", 20)
        .attr("x", 0);

    var yAxisBar = g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yScaleBar));

    yAxisBar.select(".domain").remove();

    // 加两个圈圈之间的线
    lollipopsGroup = layer1.append("g")
        // .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "lollipops");

    lollipops = lollipopsGroup.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", "lollipop")
        .attr("transform", function(d) {
            return "translate(0," + (yScaleBar(d.id) + (yScaleBar.bandwidth() / 2)) + ")";
        })
        .attr("style", "display: none")

    lollipops.append("path")
        .attr("class", "lollipop-line")
        .attr("d", lollipopLinePath);

    startCircles = lollipops.append("circle")
        .attr("class", "lollipop-start")
        .attr("r", function(d) {
            return d.return == "" ? null : 10;
        })
        .attr("cx", function(d) {
            return d.return == "" ? null : xScaleScatter(d.return);
        })
        .on("mouseover", function(d) {
            tooltipShow(d);
            d3.select(this)
            .attr("fill", "#F8786B");
        })
        .on("mouseout", function(d) {
            tooltip.style("display", "none")
            d3.select(this).transition().duration(250)
            .attr("fill", "#ffa71a")
        });;

    medianCircles = lollipops.append("circle")
        .attr("class", "lollipop-median")
        .attr("r", function(d) {
            if (d.risk == "") {
                return null;
            } else {
                return 10;
            }
        })
        .attr("cx", function(d) {
            if (d.risk == "") {
                return null;
            } else {
                return xScaleScatter(d.risk);
            }
        })

    var bars = layer2.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll('.bar')
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("cursor", "pointer")
        .attr("fill", function (d) { return idScale(d.id); })
        .attr("rx", 20)
        .attr("ry", 20)
        .attr("width", 20)
        .attr("y", function (d) { return yScaleScatter(d.return) - 10; })
        .attr("height", 20)
        .attr("x", function (d) { return xScaleScatter(d.risk) - 10; })
        .on("mouseover", function(d) {
            tooltipShow(d);
            d3.select(this)
            .attr("fill", "#F8786B");
        })
        .on("mouseout", function(d) {
            tooltip.style("display", "none")
            d3.select(this).transition().duration(250)
            .attr("fill", "#ffa71a")
        });


    var previousChartType = "bar";

    drawBar();

    d3.select("#scatter").on("click", function() {
        drawScatter();
    });

    d3.select("#bar").on("click", function() {
        drawBar();
    });

    function drawScatter() {
        d3.select("#summary").text(scatterWords);

        d3.selectAll(".tick").remove();

        data = data.sort(function(a, b) {
            return a.equity-b.equity;
        })

        yScaleBar.domain(data.map(function(d) {
            return d.id;
        }));

        var yAxisBar = g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yScaleBar));

        yAxisBar.select(".domain").remove();
        
        d3.transition()
            .duration(DURATION)
            .selectAll('.bar_chart_title').attr('opacity', 0);

        d3.transition()
            .duration(DURATION)
            .selectAll('.dot_chart_legend').attr('opacity', 1);

        xAxis.transition()
            .duration(DURATION)
            .call(d3.axisBottom(xScaleScatter).ticks(3));

        xAxis.select(".domain").remove();

        // 加两个圈圈之间的线
        lollipopsGroup = layer1.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "lollipops")
        .attr('opacity', 0);

        lollipops = lollipopsGroup.selectAll("g")
        .data(data)
        .enter().append("g")
        .attr("class", "lollipop")
        .attr("transform", function(d) {
            return "translate(0," + (yScaleBar(d.id) + (yScaleBar.bandwidth() / 2)) + ")";
        })

        lollipops.append("path")
        .attr("class", "lollipop-line")
        .attr("d", lollipopLinePath);

        startCircles = lollipops.append("circle")
        .attr("class", "lollipop-start")
        .attr("r", function(d) {
            return d.return == "" ? null : 10;
        })
        .attr("cx", function(d) {
            return d.return == "" ? null : xScaleScatter(d.return);
        });

        medianCircles = lollipops.append("circle")
        .attr("class", "lollipop-median")
        .attr("r", function(d) {
            if (d.risk == "") {
                return null;
            } else {
                return 10;
            }
        })
        .attr("cx", function(d) {
            if (d.risk == "") {
                return null;
            } else {
                return xScaleScatter(d.risk);
            }
        });

        d3.transition()
            .duration(3 * DURATION)
            .selectAll('.lollipops').attr('opacity', 1);


        bars.transition()
            .duration(previousChartType === "bar" ? DURATION : 0)
            .delay(DURATION/4)
            .style("opacity", 1)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("width", 20)
            .attr("x", function(d) {
                return xScaleScatter(d.equity) - 10;
            })
            .attr("height", 20)
            .attr("y", function(d) {
                return yScaleBar(d.id) + yScaleBar.bandwidth() / 2;
            })
            .transition()
            .duration(previousChartType === "bar" ? DURATION : 0)
            .attr("y", function(d) {
                d3.select(this).raise().raise().raise().raise().raise(); 
                return yScaleBar(d.id);
            });

        previousChartType = "scatter";
    }

    function drawBar() {
        d3.select("#summary").text(barWords);

        d3.selectAll(".tick").remove();

        data = data.sort(function(a, b) {
            return a.gdp2021-b.gdp2021;
        })

        yScaleBar.domain(data.map(function(d) {
            return d.id;
        }));

        var yAxisBar = g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yScaleBar));

        yAxisBar.select(".domain").remove();

        d3.transition()
            .duration(DURATION).delay(DURATION)
            .selectAll('.lollipop').attr("style", "display: none");
        
        d3.transition().delay(DURATION)
            .duration(DURATION)
            .selectAll('.bar_chart_title').attr('opacity', 1);

        d3.transition()
            .duration(DURATION).delay(DURATION)
            .selectAll('.dot_chart_legend').attr('opacity', 0);

        xAxis.transition()
            .duration(DURATION)
            .delay(3 * DURATION)
            .call(d3.axisBottom(xScaleBar).ticks(3));

        xAxis.select(".domain").remove();

        // yAxisScatter.transition()
        //     .duration(DURATION)
        //     .attr('opacity', 0);

        yAxisBar.transition()
            .duration(DURATION)
            .attr('opacity', 1);

        bars.transition()
            .duration(previousChartType === "scatter" ? DURATION : 0)
            .attr("y", function(d) {
                return yScaleBar(d.id) + yScaleBar.bandwidth() / 2 - 10;
            })
            .transition()
            .duration(previousChartType === "scatter" ? DURATION : 0)
            .attr("y", function(d) {
                return yScaleBar(d.id);
            })
            .attr("height", yScaleBar.bandwidth())
            .attr("rx", 0)
            .attr("ry", 0)
            .attr("x", function(d) {
                return xScaleBar(0);
            })
            .attr("width", function(d) {
                return xScaleBar(d.gdp2021);
            })
            .transition()
            .duration(previousChartType === "scatter" ? DURATION : 0)
            .style("opacity", 1)
            // .on("mouseout", tooltipHide);

        previousChartType = "bar";
    }

    function tooltipShow(d) {
        num = previousChartType == "bar" ? d.gdp2021 : d.equity;
        num = parseFloat(num).toFixed(2)
        num = previousChartType == "bar" ? num + "万亿元" : num + "万元"
        tooltip.html("GDP<br>" + num);

        var x = d3.event.pageX;
        if(x > width-50) x=width-50;
        var y = d3.event.pageY;
        $(".tooltip").css("left", x)
        .css("top",y)
        .css("display", "inline-block")
        .css("opacity", "0.9")
        .show();
    }

      
});

// window.addEventListener('resize', function() {
//     resize_ele.resize();
// });