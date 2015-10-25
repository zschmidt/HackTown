function initMap() {
  var chicago = new google.maps.LatLng(41.850, -87.650);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: chicago,
    zoom: 3
  });

  var coordInfoWindow = new google.maps.InfoWindow();
  coordInfoWindow.setContent(createInfoWindowContent(chicago, map.getZoom()));
  coordInfoWindow.setPosition(chicago);
  coordInfoWindow.open(map);

  map.addListener('zoom_changed', function() {
    coordInfoWindow.setContent(createInfoWindowContent(chicago, map.getZoom()));
    coordInfoWindow.open(map);
  });
}

var TILE_SIZE = 256;

function createInfoWindowContent(latLng, zoom) {
  var scale = 1 << zoom;

  var worldCoordinate = project(latLng);

  var pixelCoordinate = new google.maps.Point(
      Math.floor(worldCoordinate.x * scale),
      Math.floor(worldCoordinate.y * scale));

  var tileCoordinate = new google.maps.Point(
      Math.floor(worldCoordinate.x * scale / TILE_SIZE),
      Math.floor(worldCoordinate.y * scale / TILE_SIZE));

  return [
    'Chicago, IL',
    'LatLng: ' + latLng,
    'Zoom level: ' + zoom,
    'World Coordinate: ' + worldCoordinate,
    'Pixel Coordinate: ' + pixelCoordinate,
    'Tile Coordinate: ' + tileCoordinate
  ].join('<br>');
}

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng) {
  var siny = Math.sin(latLng.lat() * Math.PI / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return new google.maps.Point(
      TILE_SIZE * (0.5 + latLng.lng() / 360),
      TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
}





var main = function(){

  var east = document.getElementById("east").value;
  var south = document.getElementById("south").value;
  var west = document.getElementById("west").value;
  var north = document.getElementById("north").value;


  var apiLocation = "http://dev.virtualearth.net/REST/v1/Elevation/Bounds?bounds=";
  var queries = "&rows=32&cols=32&heights=sealevel";

  var key = "&key=AgdJmHJNbOApcjOXhgGoeD0OeiaEoxJ-zXbtF60rdVvWnD2GZeH-czRQ9lH03Vil";

  var min = 999;
  var max = 0;


  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");




  $.ajax(
  {
      type: 'GET',
      cache : false,
      url : apiLocation+ south +","+ west + ","+ north + "," + east + queries +key,
      async: false,
      crossDomain : true,
      success: function (data)
      {
          data = data.resourceSets;
          for(var i = 0; i<data.length; i++)
          {
            var resource = data[i].resources;
            for(var j = 0; j<resource.length; j++)
            {
              var elevations = resource[j].elevations;
              for(var k = 0; k<elevations.length; k++)
              {
                //document.getElementById("out").innerHTML += "Elevation is: "+elevations[k]+"<br>";
                if(elevations[k]<min)
                {
                  min = elevations[k];
                  //document.getElementById("out").innerHTML += "New min: "+elevations[k]+"<br>";
                }
                if(elevations[k]>max)
                {
                  max = elevations[k];
                  //document.getElementById("out").innerHTML += "New max: "+elevations[k]+"<br>";
                }
                var color = 255 - (.19 * (elevations[k]-26))>>0;
                ctx.fillStyle = "rgba("+color+", "+color+", "+color+", "+0.7+")";
                ctx.fillRect((1000/32)*(k%32),1000 - 1000/32 - (1000/32 * Math.floor(k/32)),1000/32,1000/32);
              }
            }

          }
          console.log(data);
      },
      error: function (e)
      {
          console.log("Error! ",e);
      }
  });
}


var button = document.getElementById("btn");

button.onclick = main;
