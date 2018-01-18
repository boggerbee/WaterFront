var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");
var graphWidth = 500;
var now = new Date();
var endDate = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
now.setDate(now.getDate()-2);
var startDate = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
var startTime = '00:00'; 
var endTime = '23:59'; //now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();


document.getElementById("start_date").value = startDate;
document.getElementById("end_date").value = endDate;
document.getElementById("start_time").value = startTime;
document.getElementById("end_time").value = endTime;

if(window.innerWidth <= 800) {
	graphWidth = 300;
}
var globals = {};

function updateGraphs() {
	startDate = document.getElementById("start_date").value+'T'+document.getElementById("start_time").value+':00+01:00';
	endDate = document.getElementById("end_date").value+'T'+document.getElementById("end_time").value+':00+01:00';
	
	var params = 'id=Almedalen25&s='+encodeURIComponent(startDate)+'&e='+encodeURIComponent(endDate);
	console.log(params);
	
	d3.json('http://data.kreutzer.no/dataserver/api/markers?'+params, function(data) {
		MG.convert.date(data, "date","%d-%m-%Y %H:%M:%S");
		globals.data = data;
		console.log("marker data len: "+data.length);
	});
	d3.json('http://data.kreutzer.no/dataserver/api/level?'+params, function(data) {
		MG.convert.date(data, "date","%d-%m-%Y %H:%M:%S");
		MG.data_graphic({
			//title: "Level plot",
			//description: "Plot of tank level last x days",
			data: data,
			width: graphWidth,
			//interpolate: d3.curveLinear,
			//missing_is_hidden: true,
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
	d3.json('http://data.kreutzer.no/dataserver/api/flow?'+params, function(data) {
		MG.convert.date(data, "date","%d-%m-%Y %H:%M:%S");
		MG.data_graphic({
			//title: "Flow plot",
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