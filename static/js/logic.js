// Creating map object
var myMap = L.map("mapid", {
    center: [36.77, -119.4179],
    zoom: 11
  });
  
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  // Grabbing our GeoJSON data..
d3.json(link,function(data) { 
  
    // Create a geoJSON layer with the retrieved data
    L.geoJson(data, {
      pointToLayer:function(feature,latlng){
        return L.circleMarker(latlng, {
          radius:useRadius(feature.properties.mag),
          fillOpacity:1,
          weight:1,
          color:"black",
          fillColor:useColor(feature.properties.mag)
          
        })


       },

     
      // Passing in our style object
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h1>" + feature.properties.mag + "</h1> <hr> <h2>" + feature.properties.place + "</h2>");
      },
 }).addTo(myMap);
    var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];
    // loop through density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + useColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
  });


  //Create color range for the circle diameter 
  function useColor(d){
    return d > 5 ? "#a54500":
    d  > 4 ? "#cc5500":
    d > 3 ? "#ff6f08":
    d > 2 ? "#ff9143":
    d > 1 ? "#ffb37e":
             "#ffcca5";
  }

  //Change the maginutde of the earthquake by a factor of 25,000 for the radius of the circle. 
  function useRadius(value){
    return value*5
  }
  