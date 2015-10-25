var lat;
var lng;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var apiLocation = "http://dev.virtualearth.net/REST/v1/Elevation/Bounds?bounds=";
var queries = "&rows=32&cols=32&heights=sealevel";
var key = "&key=AgdJmHJNbOApcjOXhgGoeD0OeiaEoxJ-zXbtF60rdVvWnD2GZeH-czRQ9lH03Vil";

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
  document.getElementById("out").innerHTML = "<br><br><h4>Max: </h4>"+round(max*3.28)+" feet<br><h4>Min: </h4>"+round(min*3.28)+" feet<br><br>"
  for(var k = 0; k<elevations.length; k++)
  {
    var color = 255 - ((255/(max-min)) * (elevations[k]-min))>>0;
    ctx.fillStyle = "rgba("+color+", "+color+", "+color+", "+0.7+")";
    ctx.fillRect((1000/64)*(k%64),1000 - 1000/64 - (1000/64 * Math.floor(k/64)),1000/64,1000/64);
  }
}

function initMap() {

  var mapquestApi = "http://www.mapquestapi.com/geocoding/v1/address?key=KM4sDe5QGtHmGxLIm6LoMhYLQ7AkGrGY&location=";

  if(document.getElementById("long").value != "" && document.getElementById("lat").value != ""){
    lat = Number(document.getElementById("lat").value);
    lng = Number(document.getElementById("long").value);
  }
  else if(document.getElementById("location").value != ""){
    $.ajax(
    {
        type: 'GET',
        cache : false,
        url : mapquestApi + document.getElementById("location").value,
        async: false,
        crossDomain : true,
        success: function (data)
        {
            data = data.results[0].locations[0].latLng;

            lat = data.lat;
            lng = data.lng;
        },
        error: function (e)
        {
            console.log("Error! ",e);
        }
    });

  }
  else {
    return;
  }

  var point = new google.maps.LatLng(lat, lng);

  var map = new google.maps.Map(document.getElementById('map'), {
    center: point,
    zoom: 10
  });

  drawElevation();

}

var getBox = function(lat, lng){
  var retData = "nothing";
  west = lng - .2;
  north = lat + .2;
  east = lng + .2;
  south = lat - .2;
  $.ajax(
  {
      type: 'GET',
      cache : false,
      url : apiLocation+ south +","+ west + ","+ north + "," + east + queries +key,
      async: false,
      crossDomain : true,
      success: function (data)
      {
          retData = data.resourceSets[0].resources[0].elevations;
      },
      error: function (e)
      {
          console.log("Error! ",e);
      }
  });
  return retData;
}


var drawElevation = function(){

  var min = 99999;
  var max = 0;
  var elevations = [];
  ctx.clearRect(0, 0, c.width, c.height);

  //call four times
  var a1 = getBox(round(lat - .2), round(lng - .2));
  var a2 = getBox(round(lat + .2), round(lng - .2));
  var a3 = getBox(round(lat - .2), round(lng + .2));
  var a4 = getBox(round(lat + .2), round(lng + .2));

  for(var i = 0; i<32; i++)
  {
    for(var j = 0; j<32; j++)
    {
      elevations.push(a1[i*32 + j]);
    }
    for(var j = 0; j<32; j++)
    {
      elevations.push(a3[i*32 + j]);
    }
  }
  for(var i = 0; i<32; i++)
  {
    for(var j = 0; j<32; j++)
    {
      elevations.push(a2[i*32 + j]);
    }
    for(var j = 0; j<32; j++)
    {
      elevations.push(a4[i*32 + j]);
    }
  }

  for(var i = 0; i<elevations.length; i++)
  {
    if(elevations[i]<min)
    {
      min = elevations[i];
    }
    if(elevations[i]>max)
    {
      max = elevations[i];
    }
  }

  drawPoints(min, max, elevations);
}

var button = document.getElementById("btn");

button.onclick = initMap;
