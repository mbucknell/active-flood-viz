document.addEventListener("DOMContentLoaded", function(event) { 

	"use strict";

	// Collect and set hydrograph aspect ratio data
	var hydrograph = document.getElementById('hydrograph');
	hydrograph.style.height = FV.hydrometa['height'];
	hydrograph.style.width = FV.hydrometa['width'];

	// D3 data import
	d3.json('../static/data/hydrograph_data.json', function(data) {

		nv.addGraph( function() {
			
			var getX = function(d) { return d.time_mili };
			var getY = function(d) { return d.value };
			var getMax = function(d) { return d.max };

			var min = d3.min(data, function(d) { return d3.min(d.values)})
			var max = d3.max(data, function(d) { return d3.max(d.values)})
			
			var chart = nv.models.cumulativeLineChart()
					.x( getX )  // this value is stored in milliseconds since epoch (converted in data_format.py with datetime)
					.y( getY ) 
					.color(d3.scale.category10().range())
					.useInteractiveGuideline(true)
					.yDomain([min, max])
					.margin({left: 120, top: 60})
					.showControls(false);

			chart.xAxis
					.axisLabel(" Date (M-D-Y)")
					.axisLabelDistance(10)
					.ticks(5)
					.tickFormat(function(d){return d3.time.format('%m-%d-%y')(new Date(d))});

			chart.yAxis
					.axisLabel('Discharge (cubic feet per second)')
					.axisLabelDistance(40)
					.ticks(5)
					.tickFormat(function(d) { return d3.format(",")(d) + " cfps"});
			
			d3.select('#hydrograph svg')
					.datum(data)
					.call(chart);

			nv.utils.windowResize(chart.update);
			return chart;
	
		});
	
	});

});

