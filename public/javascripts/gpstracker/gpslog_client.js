/**
 * 
 * 
 */
//google.maps.event.addDomListener(window, 'load', initialize);

//var map;

/**
 * init map
function initialize() {
	var mapOptions = {
		center: { lng: 16.369861, lat: 48.187290},
			zoom: 16
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(48.187290, 16.369861),
		map: map,
		title: 'Holla'
	});

}


*/



