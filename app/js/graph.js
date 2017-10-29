var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");
var graphWidth = 500;
var hrsBack = 24;

document.getElementById("hrs").value = hrsBack;

if(window.innerWidth <= 800) {
	graphWidth = 300;
}
var globals = {};

function updateGraphs() {
	hrsBack = document.getElementById("hrs").value;
	
	d3.json('http://data.kreutzer.no/dataserver/api/graphmarkers?id=Almedalen25&hrs='+hrsBack, function(data) {
		data.forEach(function (d) {
		var str = d.date; 
		if (str != null) {
			d.date = parseTime(str.substring(0, str.length - 9));
		}
		});	
		globals.data = data;
	});
	d3.json('http://data.kreutzer.no/dataserver/api/graphlevel?id=Almedalen25&hrs='+hrsBack, function(data) {
		data.forEach(function (d) {
		var str = d.date; 
		if (str != null) {
			d.date = parseTime(str.substring(0, str.length - 9));
		}
		});	

		MG.data_graphic({
			title: "Level plot",
			//description: "Plot of tank level last x days",
			data: data,
			width: graphWidth,
			height: 200,
			right: 40,
			markers: globals.data,
			min_y_from_data: true,
			xax_count: 4,
			linked: true,
			format: 'percentage',
			target: '#levelgraph'
		});
	});
	d3.json('http://data.kreutzer.no/dataserver/api/graphflow?id=Almedalen25&hrs='+hrsBack, function(data) {
		data.forEach(function (d) {
		var str = d.date; 
		if (str != null) {
			d.date = parseTime(str.substring(0, str.length - 9));
		}
		});	

		MG.data_graphic({
			title: "Flow plot",
			data: data,
			width: graphWidth,
			height: 200,
			right: 40,
			xax_count: 4,
			linked: true,
			area: false,
			//y_label: 'litres/min',
			target: '#flowgraph'
		});
	});
}