function init() {
    //svg weight
    var w = 600;
    //svg height
    var h = 500;
    var padding = 60;

    //variable for store csv data
    var dataset;

    //creating the SVG
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var xScale = d3.scaleTime()
            .domain([0,0])
            .range([padding, w - padding]);

    //scaling the yScale using scaleLinear
    var yScale = d3.scaleLinear()
        .domain([0,0])
        .range([h - padding, padding]);

    //initialaize x Axis
    var xAxis = d3.axisBottom().scale(xScale);
    svg.append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .attr("class","Xaxis")

    //initialaize y Axis
    var yAxis = d3.axisLeft().scale(yScale);
    svg.append("g")
        .attr("transform", "translate(" + padding + ",0)")
        .attr("class","Yaxis")


    //readcsv file data
    function read_file(ageC, gender, color) {d3.csv("Full_Data_Set.csv", function (d) {
        if ((d.AGE == ageC) && (d.SEX == gender)) {
            return {
                OBS_VALUE: parseFloat(d.OBS_VALUE),
                TIME_PERIOD: new Date(+d.TIME_PERIOD, 1)
            }
        };
    }).then(function(data) {
        dataset = data;
        //displaying data in console
        console.table(dataset, ["AGE", "SEX", "OBS_VALUE", "TIME_PERIOD"]);
        update_data(dataset, color)
    })};

    function read_file_comparison(ageC) {d3.csv("Full_Data_Set.csv", function (d) {
        if ((d.AGE == ageC)) {
            return {
                OBS_VALUE: parseFloat(d.OBS_VALUE),
                TIME_PERIOD: new Date(+d.TIME_PERIOD, 1),
                SEX: d.SEX
            }
        };
    }).then(function (data) {
        dataset = data;
        console.table(dataset, ["AGE", "SEX", "OBS_VALUE", "TIME_PERIOD"]);
        comparison(dataset)
    })};

    function update_data(data, color) {
        xScale.domain([
                //setting minimum and maximum dates to create the scale
                d3.min(data, function (d) { return d.TIME_PERIOD; }),
                d3.max(data, function (d) { return d.TIME_PERIOD; })
            ]);
        yScale.domain([
                d3.min(data, function (d) { return d.OBS_VALUE; }),
                d3.max(data, function (d) { return d.OBS_VALUE;})
        ]);

        var area = d3.area()
            .x(function (d) {
                return xScale(d.TIME_PERIOD);
            })
            //base line for area shape
            .y0(function (d) {
                return yScale.range()[0];
            })
            .y1(function (d) {
                return yScale(d.OBS_VALUE)
            });

        var ar = svg.selectAll(".areaChart")
        .data([data], function(d) { return d.OBS_VALUE; });

        ar
            .enter()
            .append("path")
            .attr("class", "areaChart")
            .merge(ar)
            .transition()
            .duration(1000)
            .attr("d", area)
            .attr("fill", color);

        svg.selectAll(".Xaxis")
            .transition()
            .duration(1000)
            .call(xAxis);

        svg.selectAll(".Yaxis")
            .transition()
            .duration(1000)
            .call(yAxis);

        //adding cirlcels
        var crc = svg.selectAll("circle")
        .data(data);

        crc
            .enter()
            .append("circle")
            .merge(crc)
            .transition()
            .duration(1000)
            //setting circle x position according to the longitudes and latitudes
            .attr("cx", function (d) {
                return xScale(d.TIME_PERIOD);
            })
            //setting circle y position according to the longitudes and latitudes
            .attr("cy", function (d) {
                return yScale(d.OBS_VALUE);
            })
            //setting circle styles
            .attr("r", 5)
            .style("fill", "green")
            .style("stroke", "gray")
            .style("stroke-width", 0.25)
            .style("opacity", 0.75)

        svg.selectAll("circle")
            .on("mouseover", function (event, d) {
                //getting x and y position of mouse
                var xPosition = parseFloat(d3.select(this).attr("cx"));
                var yPosition = parseFloat(d3.select(this).attr("cy")) - 14;

                //append text into the position
                svg.append("text")
                    .attr("id", "tooltip")
                    .attr("x", xPosition)
                    .attr("y", yPosition)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "13px")
                    .attr("font-weight", "bold")
                    .attr("font-family", "Calibre")
                    .text(d.OBS_VALUE);
                //change the color when mouse is on the bar
                d3.select(this)
                    .transition()
                    .duration(250)
                    .attr("r", 10)
                    .style("fill", "orange")
                })
            .on("mouseout", function(d){
                d3.select("#tooltip").remove();
                d3.select(this)
                    .transition()
                    .duration(250)
                    .attr("r", 5)
                    .style("fill", "green")
            })

    }

    function comparison(data) {
        xScale.domain([
                //setting minimum and maximum dates to create the scale
                d3.min(data, function (d) { return d.TIME_PERIOD; }),
                d3.max(data, function (d) { return d.TIME_PERIOD; })
            ]);
        yScale.domain([
                d3.min(data, function (d) { return d.OBS_VALUE; }),
                d3.max(data, function (d) { return d.OBS_VALUE;})
        ]);

        svg.selectAll(".Xaxis")
            .transition()
            .duration(1000)
            .call(xAxis);

        svg.selectAll(".Yaxis")
            .transition()
            .duration(1000)
            .call(yAxis);

        var lineChart2 =  svg.selectAll(".LineChart2")
            .data([data.filter(function(d) { return d.SEX === "M"; })], function(d) {
        return d.TIME_PERIOD; });

        lineChart2
            .enter()
            .append("path")
            .attr("class", "LineChart2")
            .merge(lineChart2)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function(d) {
                    return xScale(d.TIME_PERIOD);})
                .y(function(d) {
                    return yScale(d.OBS_VALUE);}))
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2.5);

        var lineChart1 =  svg.selectAll(".LineChart1")
            .data([data.filter(function(d) { return d.SEX === "F"; })], function(d) {
        return d.TIME_PERIOD; });

        lineChart1
            .enter()
            .append("path")
            .attr("class", "LineChart1")
            .merge(lineChart1)
            .transition()
            .duration(1000)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d.TIME_PERIOD);})
                .y(function(d) { return yScale(d.OBS_VALUE); }))
            .attr("fill", "none")
            .attr("stroke", "indianred")
            .attr("stroke-width", 2.5);

            //adding cirlcels
        var crc = svg.selectAll("circle")
        .data(data);

            crc
            .enter()
            .append("circle").attr("class", "circ")
            .merge(crc)
            .transition()
            .duration(1000)
            //setting circle x position according to the longitudes and latitudes
            .attr("cx", function (d) {
                return xScale(d.TIME_PERIOD);
            })
            //setting circle y position according to the longitudes and latitudes
            .attr("cy", function (d) {
                return yScale(d.OBS_VALUE);
            })
            //setting circle styles
            .attr("r", 5)
            .style("fill", "green")
            .style("stroke", "gray")
            .style("stroke-width", 0.25)
            .style("opacity", 0.75)

        svg.selectAll(".circ")
            .on("mouseover", function (event, d) {
                //getting x and y position of mouse
                var xPosition = parseFloat(d3.select(this).attr("cx"));
                var yPosition = parseFloat(d3.select(this).attr("cy")) - 14;

                //append text into the position
                svg.append("text")
                    .attr("id", "tooltip")
                    .attr("x", xPosition)
                    .attr("y", yPosition)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "13px")
                    .attr("font-weight", "bold")
                    .attr("font-family", "Calibre")
                    .text(d.OBS_VALUE);
                //change the color when mouse is on the bar
                d3.select(this)
                    .transition()
                    .duration(250)
                    .attr("r", 10)
                    .style("fill", "orange")
                })
            .on("mouseout", function(d){
                d3.select("#tooltip").remove();
                d3.select(this)
                    .transition()
                    .duration(250)
                    .attr("r", 5)
                    .style("fill", "green")
            })

        document.addEventListener("DOMContentLoaded", function() {
        const data = [
            { type: 'Female', color: 'red' },
            { type: 'Male', color: 'green' }
        ];

        const container = d3.select("#comparison_info");

        const bullets = container.selectAll(".bullet")
            .data(data)
            .enter()
            .append("div")
            .attr("class", "bullet");

        bullets.append("div")
            .style("background-color", d => d.color);

        bullets.append("span")
            .text(d => d.type);
        });
    }

    //check whether the line chart is appeared or not
    var lineChartAppeared = (!d3.select(".LineChart1.LineChart2").empty());
    //when button female clicked show the female chart

    /*
    d3.select("#female")
        .on("click", function () {
            if (lineChartAppeared) {
                svg.selectAll(".LineChart1.LineChart2")
                    .transition()
                    .duration(500) // Specify the duration of the transition in milliseconds
                    .style("opacity", 0) // Fade out the chart
                    .remove()
                    .on("end", function () {
                        // Call the function after the transition is complete
                        read_file("Y0", "F", "indianred");
                    });
            } else {
                read_file("Y0", "F", "indianred");
            }
        })

    //remove comparison
    function remove_chart() {
        return svg.selectAll(".areaChart")
            .transition()
            .duration(500) // Specify the duration of the transition in milliseconds
            .style("opacity", 0) // Fade out the chart
            .remove()
    }

    //remove comparison
    function remove_comparison() {
        return svg.selectAll(".areaChart")
            .transition()
            .duration(500) // Specify the duration of the transition in milliseconds
            .style("opacity", 0) // Fade out the chart
            .remove()
    }

    //when button male clicked show the male chart
    d3.select("#male")
        .on("click", function () {
            read_file("Y80", "M", "steelblue");
    })

    //when button both clicked show the male chart
    d3.select("#both")
        .on("click", function () {
            remove_chart().on("end", function() {
                // Call the function after the transition is complete
                read_file_comparison("Y60");
            });

    })*/
    read_file("Y0", "F", "indianred");
    displayFigCaption("Female Life Expectancy at Birth");

    function remove_comparison() {
         svg.selectAll(".LineChart1")
            .transition()
            .duration(500) // Specify the duration of the transition in milliseconds
            .style("opacity", 0) // Fade out the chart
            .remove()
        svg.selectAll(".LineChart2")
            .transition()
            .duration(500) // Specify the duration of the transition in milliseconds
            .style("opacity", 0) // Fade out the chart
            .remove()
        svg.selectAll(".circ")
        .remove()
    }

    function displayFigCaption(captionText) {
        // Select the displayData element and append a fig caption
        const displayData = d3.select("#displayData");
        displayData.selectAll("figcaption").remove(); // Remove any existing fig captions
        displayData.append("figcaption")
            .text(captionText);
    }

    //this function will remove the chart
    function remove_chart() {
        return svg.selectAll(".areaChart")
            .transition()
            .duration(500) // Specify the duration of the transition in milliseconds
            .style("opacity", 0) // Fade out the chart
            .remove()
    }
     d3.select("#both")
        .on("click", function () {
            remove_chart().on("end", function() {
                // Call the function after the transition is complete
                read_file_comparison("Y60");
                displayFigCaption("Comparison Life Expectancy at Age 60");
            });

    })

    d3.select("#male").on("click", function() {
            remove_comparison();
            read_file("Y0", "M", "steelblue");
            displayFigCaption("Male Life Expectancy at Birth");
        });
    d3.select("#female").on("click", function() {
        remove_comparison()
        read_file("Y0", "F", "indianred");
        displayFigCaption("Female Life Expectancy at Birth");
    });

    d3.select("#options").on("change", function() {
        var selectedOption = d3.select(this).property("value");
        if (selectedOption == "options1") {
            remove_comparison();
            read_file("Y0", "F", "indianred");
            displayFigCaption("Female Life Expectancy at Birth");
            d3.select("#male")
                .on("click", function () {
                    remove_comparison();
                read_file("Y0", "M", "steelblue");
                displayFigCaption("Male Life Expectancy at Birth");
            })
            d3.select("#female")
                .on("click", function () {
                    remove_comparison();
                read_file("Y0", "F", "indianred");
                displayFigCaption("Female Life Expectancy at Birth");
            })
            d3.select("#both")
            .on("click", function () {
            remove_chart().on("end", function() {
                // Call the function after the transition is complete
                read_file_comparison("Y0");
                displayFigCaption("Comparison Life Expectancy at Birth");
            });

    })

        } else if (selectedOption == "options2") {
            remove_comparison();
            read_file("Y40", "F", "indianred");
            displayFigCaption("Female Life Expectancy at Age 40");
            d3.select("#male")
                .on("click", function () {
                    remove_comparison();
                read_file("Y40", "M", "steelblue");
                displayFigCaption("Male Life Expectancy at Age 40");
            })
            d3.select("#female")
                .on("click", function () {
                    remove_comparison();
                read_file("Y40", "F", "indianred");
                displayFigCaption("Female Life Expectancy at Age 40");
            })
            d3.select("#both")
            .on("click", function () {
            remove_chart().on("end", function() {
                // Call the function after the transition is complete
                read_file_comparison("Y40")
                displayFigCaption("Comparison Life Expectancy at Age 40");
            });

    })
        } else if (selectedOption == "options3") {
            remove_comparison();
            read_file("Y60", "F", "indianred");
            displayFigCaption("Female Life Expectancy at Age 60");
            d3.select("#male")
                .on("click", function () {
                    remove_comparison();
                read_file("Y60", "M", "steelblue");
                displayFigCaption("Male Life Expectancy at Age 60");
            })
            d3.select("#female")
                .on("click", function () {
                    remove_comparison();
                read_file("Y60", "F", "indianred");
                displayFigCaption("Female Life Expectancy at Age 60");
            })
            d3.select("#both")
            .on("click", function () {
            remove_chart().on("end", function() {
                // Call the function after the transition is complete
                read_file_comparison("Y60");
                displayFigCaption("Comparison Life Expectancy at Age 60");
            });

    })
        } else if (selectedOption == "options4") {
            remove_comparison();
            read_file("Y65", "F", "indianred");
            displayFigCaption("Female Life Expectancy at Age 65");
            d3.select("#male")
                .on("click", function () {
                    remove_comparison();
                read_file("Y65", "M", "steelblue");
                displayFigCaption("Male Life Expectancy at Age 65");
            })
            d3.select("#female")
                .on("click", function () {
                    remove_comparison();
                read_file("Y65", "F", "indianred");
                displayFigCaption("Female Life Expectancy at Age 65");
            })
            d3.select("#both")
            .on("click", function () {
            remove_chart().on("end", function() {
                // Call the function after the transition is complete
                read_file_comparison("Y65");
                displayFigCaption("Comparison Life Expectancy at Age 65");
            });

    })
        }  else if (selectedOption == "options5") {
            remove_comparison();
            read_file("Y80", "F", "indianred");
            displayFigCaption("Female Life Expectancy at Age 80");
            d3.select("#male")
                .on("click", function () {
                    remove_comparison();
                read_file("Y80", "M", "steelblue");
                displayFigCaption("Male Life Expectancy at Age 80");
            })
            d3.select("#female")
                .on("click", function () {
                    remove_comparison();
                read_file("Y80", "F", "indianred");
                displayFigCaption("Female Life Expectancy at Age 80");
            })
            d3.select("#both")
            .on("click", function () {
            remove_chart().on("end", function() {
                // Call the function after the transition is complete
                read_file_comparison("Y80");
                displayFigCaption("Comparison Life Expectancy at Age 80");
            });

    })
        }
    })

    /*d3.select("#options").on("change", function() {
        var selectedOption = d3.select(this).property("value")
    d3.select("#male")
        .on("click", function () {
            if (selectedOption === 'options1') {
                read_file("Y0", "M", "steelblue");
            } else if (selectedOption === 'options2') {
                read_file("Y40", "M", "steelblue");
            }else if (selectedOption === 'options3') {
                read_file("Y60", "M", "steelblue");
            }else if (selectedOption === 'options4') {
                read_file("Y65", "M", "steelblue");
            }else if (selectedOption === 'options5') {
                read_file("Y80", "M", "steelblue");
              }
        })
        d3.select("#female")
        .on("click", function () {
            if (selectedOption === 'options1') {
                read_file("Y0", "F", "indianred");
            } else if (selectedOption === 'options2') {
                read_file("Y40", "F", "indianred");
            }else if (selectedOption === 'options3') {
                read_file("Y60", "F", "indianred");
            }else if (selectedOption === 'options4') {
                read_file("Y65", "F", "indianred");
            }else if (selectedOption === 'options5') {
                read_file("Y80", "F", "indianred");
              }
        })
    })*/
}

window.onload = init

