function init() {
    //svg weight
    var w = 600;
    //svg height
    var h = 500;
    var padding = 60;

    //variable for store csv data
    var dataset;
    //getting csv data into the dataset variable
    d3.csv("new.csv", function(d) {
        return {
            VAR: d.VAR,
            Value: parseFloat(d.Value),
            Year: new Date(+d.Year, 1),
            UNIT:d.UNIT
        };
    }).then(function(data) {
        dataset = data;
        //display data in console
        console.table(dataset, ["VAR", "Year", "Value", "UNIT"]);
        //calling the line linechart function
        lineChart(dataset);
    });

    //function for filter female data
    /*function filterFemale(variable) {
        if ((variable.VAR == 'EVIEFE00') && (variable.UNIT == 'EVIDUREV')) {
                    female_data = variable.Value
                    return female_data;
                }
    }*/


    //main function for drawing the linechart
    function lineChart(data) {
        //scaling the xScale using scaleTime
        var xScale = d3.scaleTime()
            .domain([
                //setting minimum and maximum dates to create the scale
                d3.min(data, function (d) {
                    return d.Year;
                }),
                d3.max(data, function (d) {
                    return d.Year;
                })
            ])
            .range([padding, w - padding]);

        //scaling the yScale using scaleLinear
        var yScale = d3.scaleLinear()
            .domain([d3.min(data, function (d) {
                return d.Value;
            }),
                d3.max(data, function (d) {
                return d.Value;
            })])
            .range([h - padding, padding]);

        //generating area according to the csv
        var area = d3.area()
            .x(function (d) {
                return xScale(d.Year);
            })
            //base line for area shape
            .y0(function (d) {
                return yScale.range()[0];
            })
            .y1(function (d) {
                return yScale(d.Value)
            });

        //creating the SVG
        var svg = d3.select("#chart")
            .append("svg")
            .attr("width", w)
            .attr("height", h);


        //appending area to the SVG
        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area)

        //adding x Axis to the line chart
        svg.append("g")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(d3.axisBottom(xScale));

        //adding y Axis to the line chart
        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .call(d3.axisLeft(yScale));

        //adding line at the 500,000 position in Yaxis
        svg.append("line")
            .attr("class", "line halfMilMark")
            .attr("x1", padding)  //starting point in X
            .attr("y1", yScale(500000)) //starting point in Y
            .attr("x2", w - padding)  //ending point in X
            .attr("y2", yScale(500000));  //ending point in Y
        //adding text at the 500,000 position in Yaxis
        svg.append("text")
            .attr("class", "halfMilLabel")
            .attr("x", padding + 10)   //x position
            .attr("y", yScale(500000) - 7)  //y position
            .text("Half a million unemployed");
    }
}

window.onload = init

