	var globals = {};
	var smoothie = new SmoothieChart(); /*{
	  grid: { strokeStyle:'rgb(255, 255, 255)', fillStyle:'rgb(60, 0, 0)',
			  lineWidth: 1, millisPerLine: 500, verticalSections: 4, },
	  labels: { fillStyle:'rgb(60, 0, 0)' }}); */
	var flowLine = new TimeSeries();

	window.fbAsyncInit = function() {
	  FB.init({
		appId      : '212617012591381',
		cookie     : true,  // enable cookies to allow the server to access 
							// the session
		xfbml      : true,  // parse social plugins on this page
		version    : 'v2.8' // use graph api version 2.8
	  });

	  FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	  });
	};
	
	$("#live-data").click(function(event) {
		console.log("click");
		event.stopImmediatePropagation();
	});

	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	function statusChangeCallback(response) {
		console.log(response);
		if (response.status === 'connected') {
		  // Noop
		} else {
		  // redirect..
			window.location.replace("http://data.kreutzer.no");
		}
	}

	function checkLoginState() {
		FB.getLoginStatus(function(response) {
		  statusChangeCallback(response);
		});
	}  
	 function WebSocketInit() {
		if ("WebSocket" in window) {
		   // Let us open a web socket
		   globals.ws = new WebSocket("ws://data.kreutzer.no/dataserver/websocket");
			
		   globals.ws.onopen = function() {
				Materialize.toast("Tilkoblet!",4000);
		   };
			
		   globals.ws.onmessage = function (evt) { 
			  if (evt.data == "WHOAREYOU") {
				globals.ws.send("GUI"); // register as gui client
				globals.ws.send("getConfig");
				globals.ws.send("getState");
			  } else if (evt.data != "ACK") {
				var msg = evt.data+"<br/>"; 
				try {
					var obj = JSON.parse(evt.data); 
					if ('config' in obj) {
						document.getElementById("ws_msg").innerHTML += "Config received for "+obj.config.id+"<br/>"
						
						fillMode = obj.config.fillMode;
						document.getElementById(fillMode.toLowerCase()).checked = true;
						fullMode = obj.config.fullMode;
						document.getElementById(fullMode.toLowerCase()).checked = true;
						document.getElementById("totalCount").innerHTML = obj.config.totalFlow;
						//document.getElementById("live-data").checked = obj.config.liveFlow;
					 //document.getElementById("ws_msg").innerHTML += msg;
					} else if ('state' in obj){
						//document.getElementById("ws_msg").innerHTML += "State received.<br/>"
						if (obj.state.pump == "ON") {
							document.getElementById("pump").checked = true;
						} else {
							document.getElementById("pump").checked = false;
						}
						if (obj.state.valve == "OPEN") {
							document.getElementById("valve").checked = true;
						} else {
							document.getElementById("valve").checked = false;
						}
					 //document.getElementById("ws_msg").innerHTML += msg;
					} else if ('flow' in obj){
						document.getElementById("totalCount").innerHTML = obj.flow.total;
						document.getElementById("currentCount").innerHTML = obj.flow.current;
						flowLine.append(new Date().getTime(), obj.flow.current);
					 //document.getElementById("ws_msg").innerHTML += msg;
					}
				} catch(e) { // in case parse fails, not JSON 
					document.getElementById("ws_msg").innerHTML += msg;
				}
			  }
		   };
			
		   globals.ws.onclose = function() { 
			// websocket is closed.
			document.getElementById("ws_msg").innerHTML = "Connection is closed..."; 
			var $toastContent = $('<span>Frakoblet.</span>').add($('<button onclick="{WebSocketInit();removeToast();}" class="btn-flat toast-action">Koble til</button>'));
			Materialize.toast($toastContent);
		   };
		} else {
		   // The browser doesn't support WebSocket
		   alert("WebSocket NOT supported by your Browser!");
		}
	}
	 
	function removeToast() {
	   var toastElement = $('.toast').first()[0];
	   var toastInstance = toastElement.M_Toast;
	   toastInstance.remove();
	}
	 
	function getCurrentConfig() {
		globals.ws.send("getConfig");
	}
	 
	function onPumpChange(obj) {
	  if($(obj).is(":checked")){
		globals.ws.send("startPump");
	  } else {
		globals.ws.send("stopPump");
	  }
	}	 
	function onValveChange(obj) {
	  if($(obj).is(":checked")){
		globals.ws.send("openValve");
	  } else {
		globals.ws.send("closeValve");
	  }
	}	 
	function onFillChange(obj) {
	  if($(obj).attr("id") == "off"){
		globals.ws.send("setFillModeOFF");
	  } 
	  if($(obj).attr("id") == "fast"){
		globals.ws.send("setFillModeFAST");
	  } 
	  if($(obj).attr("id") == "slow"){
		globals.ws.send("setFillModeSLOW");
	  } 
	  globals.ws.send("getState"); // to update the pump and valve 
	}	 
	function onFullChange(obj) {
	  if($(obj).attr("id") == "switch"){
		globals.ws.send("setFullModeSWITCH");
	  } 
	  if($(obj).attr("id") == "level"){
		globals.ws.send("setFullModeLEVEL");
	  } 
	  globals.ws.send("getState"); // to update the pump and valve 
	}	 
	function onLiveChange(event,obj) {
	  if($(obj).is(":checked")){
	 //if ($(obj).checked) {
		SmoothieInit();
		globals.ws.send("liveOn");
	  } else {
		globals.ws.send("liveOff");
	  }
		console.log("click");

	  event.stopImmediatePropagation();
	}	 
	function SmoothieInit() {
		smoothie.streamTo(document.getElementById("liveChart"), 1000);
		/*setInterval(function() {
		  flowLine.append(new Date().getTime(), Math.random());
		}, 1000);*/
		smoothie.addTimeSeries(flowLine,{ strokeStyle:'rgb(66, 165, 245)', fillStyle:'rgba(66, 165, 245, 0.35)', lineWidth:2 }); //42a5f5
	} 
