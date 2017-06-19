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
	  // Logged into your app and Facebook.
		FB.api('/me', function(response) {
			console.log('Successful login for: ' + response.name);
			document.getElementById('login_name').style.display = 'block';
			document.getElementById('mnu_config1').style.display = 'block';
			document.getElementById('mnu_config2').style.display = 'block';
			document.getElementById('login_name').innerHTML = 'Logged in as '+response.name;
			document.getElementById('fb-login').style.display = 'none';
		});
	  
	} else {
	  // The person is not logged into your app or we are unable to tell.
		document.getElementById('fb-login').style.display = 'block';
		document.getElementById('login_name').style.display = 'none';
	}
}

function checkLoginState() {
	FB.getLoginStatus(function(response) {
	  statusChangeCallback(response);
	});
}
