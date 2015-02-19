 var map;
      function initialize() {
        var mapOptions = {
          center: { lat: 48.192, lng: 16.369},
          zoom: 13
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
      
      
      
      
      
      
      
      var marker = new google.maps.Marker({
		position: new google.maps.LatLng(48.192, 16.369),
		map: map,
		title: 'Hello World!'
	});
	
	
	var logCoordinates = [new google.maps.LatLng(48.192, 16.369),new google.maps.LatLng(48.182, 16.339),new google.maps.LatLng(48.092, 16.069),new google.maps.LatLng(48.192, 16.369)];

	/*for (g in logCoordinates){
		logCoordinates.push(new google.maps.LatLng(gpslog[g].latitude, gpslog[g].longitude));
	}*/

	var logPath = new google.maps.Polyline({
		path: logCoordinates,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 2
		});

	logPath.setMap(map);

      
      
      
      
      
      }
      







google.maps.event.addDomListener(window, 'load', initialize);
