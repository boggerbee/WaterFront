var parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");
var graphWidth = 500;

setGraphInterval(12);

if(window.innerWidth <= 800) {
	graphWidth = 300;
}
var globals = {};

function setGraphInterval(interval) {
	var msecPerMinute = 1000 * 60;  
	var msecPerHour = msecPerMinute * 60;  
	var now = new Date();
	var nowMsec = now.getTime(); 
	var startMsec = nowMsec - (interval*msecPerHour);
	var startDate = new Date();
	startDate.setTime(startMsec);

	document.getElementById("start_date").value = startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+startDate.getDate();
	document.getElementById("start_time").value = startDate.getHours()+':'+startDate.getMinutes();
	document.getElementById("end_date").value = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
	document.getElementById("end_time").value = now.getHours()+':'+now.getMinutes();

	updateGraphs();
}

function updateGraphs() {
	var startDate = document.getElementById("start_date").value+'T'+document.getElementById("start_time").value+':00+01:00';
	var endDate = document.getElementById("end_date").value+'T'+document.getElementById("end_time").value+':00+01:00';
	
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