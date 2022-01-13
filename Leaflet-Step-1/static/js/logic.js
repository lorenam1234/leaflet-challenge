// Store our API endpoint inside queryUrl
var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL
d3.json(quakeUrl).then(function (getData) {
    createFeatures(getData.features);
});

function createFeatures(earthquakeData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + "Time: " + new Date(feature.properties.time) +
            "</p><p>" + "Magnitude: " + feature.properties.mag);
    }

    function markerSize(magnitude) {
        console.log(magnitude)
        return magnitude * 10000;
    }

    function markerColor(magnitude) {
        if (magnitude > 5) {
            return "#F06B6B"
        }
        else if (magnitude > 4) {
            return "#F0936B"
        }
        else if (magnitude > 3) {
            return "#F3BA4E"
        }
        else if (magnitude > 2) {
            return "#F3DB4C"
        }
        else if (magnitude > 1) {
            return "#E1F34C"
        }
        else {
            return "#B7F34D"
        }
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (earthquakeData, latlng) {
            return L.circle(latlng, {
                radius: markerSize(earthquakeData.properties.mag),
                color: markerColor(earthquakeData.properties.mag)
            });
        },
        onEachFeature: onEachFeature
    });
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Define streetmap and darkmap layers
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    // var earthquakeLayer = L.layerGroup(earthquakeMarker);
    var newLayer = new L.LayerGroup();
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Light Map": lightmap,
    }
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };
    // Create our map, giving it the lightmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
            39.78, -119.71],
        zoom: 5.48,
        layers: [lightmap, earthquakes, newLayer]
    });

    /*Legend specific*/
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += "<h4>Depth (km)</h4>";
        div.innerHTML += '<i style="background: #F06B6B"></i><span>-10 - 10</span><br>';
        div.innerHTML += '<i style="background: #F0936B"></i><span>10 - 30</span><br>';
        div.innerHTML += '<i style="background: #F3BA4E"></i><span>30 - 50</span><br>';
        div.innerHTML += '<i style="background: #F3DB4C"></i><span>50 - 70</span><br>';
        div.innerHTML += '<i style="background: #E1F34C"></i><span>70 - 90</span><br>';
        div.innerHTML += '<i style="background: #B7F34D"></i><span>90+</span><br>'
        return div;
    };

    legend.addTo(myMap);
};