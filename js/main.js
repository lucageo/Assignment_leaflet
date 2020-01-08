// This Java-Script file contains the script which is responsible for 
// the functionalities and representations of the webmap.

//----------------------------------------
//--- Part 1: Adding a Basemap ----
//----------------------------------------

// L.map instantiates the webmap. The variable 'map' must match the DOM ID of the div element in the HTML document.
// Center and zoom define how the map is displayed when called.  

var map = L.map('map', {
	center: [ 45.463372, 9.186195], 
	zoom: 14,
});

// Basemaps are instantiated with L.tileLayer. Attributation is important to show where the basemap comes from.
// Minzoom and maxzoom are useful to set the minimum and maximum zoom level for the user.  

// Open Street map
var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
var osm = new L.tileLayer(osmUrl, {
	minZoom: 12, 
	maxZoom: 17, 
	attribution: osmAttrib
});	

// Definig two additional Basemaps from MapBox and addig the "Grayscale" basempa as default.
mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox/light-v9'}).addTo(map),
	streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11'});


// Getting Geojson from a github service.	
$.getJSON("https://raw.githubusercontent.com/lucageo/data_fermate/master/tpl_fermate.geojson",function(data){
    var ratIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/lucageo/data_fermate/master/icons8-tour-bus-16.png',
      iconSize: [16,16]
	});
	
	// Creating the variable "Bus" and grabbing geojson data from the function above.
    var bus = L.geoJson(data,{
      pointToLayer: function(feature,latlng){
        var marker = L.marker(latlng,{icon: ratIcon});
        marker.bindPopup('<p><b>Street:</b>'+feature.properties.ubicazione + '</p><hr><p><b>Line:</b>' + feature.properties.linee+'</p>');
        return marker;
      }
	});

	//Creating Clusters From the variable "bus".
    var clusters = L.markerClusterGroup();
    clusters.addLayer(bus);
	map.addLayer(clusters);
	
	// Defining basemaps.
	var baseMaps = {
		"Grayscale": grayscale,
		"Streets": streets,
		"Open Street Map": osm,
		
	};
	// Defining Overlays.
	var overlayMaps = {
		"Milan's Bus Stops": clusters
	};
	// Add Leflet Layer Switcher.
	L.control.layers(baseMaps, overlayMaps).addTo(map);

	L.control.scale().addTo(map);

});








