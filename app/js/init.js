(function($){
  $(function(){

    $('.button-collapse').sideNav();
	updateGraphs();
	
	$('.datepicker').pickadate({
		format: 'yyyy-mm-dd',
		selectMonths: true, // Creates a dropdown to control month
		selectYears: 2, // Creates a dropdown of 15 years to control year,
		today: 'Today',
		clear: 'Clear',
		close: 'Ok',
		closeOnSelect: true // Close upon selecting a date,
	});
	
	$('.timepicker').pickatime({
//		timeFormat: 'HH:mm:ss',
		default: 'now', 	// Set default time: 'now', '1:30AM', '16:30'
		fromnow: 0,       	// set default time to * milliseconds from now (using with default = 'now')
		twelvehour: false, 	// Use AM/PM or 24-hour format
		donetext: 'OK', 	// text for done-button
		cleartext: 'Clear', // text for clear-button
		canceltext: 'Cancel', // Text for cancel-button
		autoclose: false, 	// automatic close timepicker
		ampmclickable: true, // make AM PM clickable
		aftershow: function(){} //Function for after opening timepicker
	  });
  
  }); // end of document ready
})(jQuery); // end of jQuery name space