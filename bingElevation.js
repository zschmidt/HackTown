var east;
var south;
var west;
var north;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

function avg(a, b)
{
  return (Number(a) + Number(b))/2;
}

function round(a)
{
  return ((1000*a)>>0)/1000;
}

function drawPoints(min, max, elevations)
{
  for(var k = 0; k<elevations.length; k++)
  {
    var color = 255 - ((255/(max-min)) * (elevations[k]-min))>>0;
    ctx.fillStyle = "rgba("+color+", "+color+", "+color+", "+0.7+")";
    ctx.fillRect((1000/32)*(k%32),1000 - 1000/32 - (1000/32 * Math.floor(k/32)),1000/32,1000/32);
  }
}

function initMap() {

  east = round(Number(document.getElementById("long").value) + .4);
  south = round(Number(document.getElementById("lat").value) - .4);
  west = round(Number(document.getElementById("long").value) - .4);
  north = round(Number(document.getElementById("lat").value) + .4);

  var point = new google.maps.LatLng(avg(north, south), avg(east, west));

  var map = new google.maps.Map(document.getElementById('map'), {
    center: point,
    zoom: 10
  });

  drawElevation();

}


var drawElevation = function(){

  var apiLocation = "http://dev.virtualearth.net/REST/v1/Elevation/Bounds?bounds=";
  var queries = "&rows=32&cols=32&heights=sealevel";
  var key = "&key=AgdJmHJNbOApcjOXhgGoeD0OeiaEoxJ-zXbtF60rdVvWnD2GZeH-czRQ9lH03Vil";
  var min = 999;
  var max = 0;
  ctx.clearRect(0, 0, c.width, c.height);

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
                if(elevations[k]<min)
                {
                  min = elevations[k];
                }
                if(elevations[k]>max)
                {
                  max = elevations[k];
                }
              }
            }
          }
          drawPoints(min, max, elevations);
      },
      error: function (e)
      {
          console.log("Error! ",e);
      }
  });
}

var button = document.getElementById("btn");

button.onclick = initMap;
