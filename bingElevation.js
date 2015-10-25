var lat;
var lng;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var apiLocation = "http://dev.virtualearth.net/REST/v1/Elevation/Bounds?bounds=";
var queries = "&rows=32&cols=32&heights=sealevel";
var key = "&key=AgdJmHJNbOApcjOXhgGoeD0OeiaEoxJ-zXbtF60rdVvWnD2GZeH-czRQ9lH03Vil";
var min = 99999;
var max = -9999;
var derivative = false;

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
    ctx.fillStyle = "rgba("+color+", "+color+", "+color+", "+0.3+")";
    //ctx.fillRect((1000/64)*(k%64),1000 - 1000/64 - (1000/64 * Math.floor(k/64)),1000/64,1000/64);
    ctx.beginPath();
    ctx.arc((1000/64)*(k%64),1000 - 1000/64 - (1000/64 * Math.floor(k/64)),1000/64, 0, 2 * Math.PI, false);
    ctx.fill();
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

function interleave(a1, a2, a3, a4)
{
  var elevations = [];
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
  return elevations;
}

function findMinMax(arr)
{
  for(var i = 0; i<arr.length; i++)
  {
    if(arr[i]<min)
    {
      min = arr[i];
    }
    if(arr[i]>max)
    {
      max = arr[i];
    }
  }
}

function x(a, y)
{
  if(a == undefined)
    return y;
  else {
    return Math.abs(a-y);
  }
}

function arrDerivative(arr){
  var retArr = [];
  arr[-1] = [];
  arr[64] = [];
  for(var j = -1; j < 65; ++j){
      arr[-1][j] = undefined;
      arr[64][j] = undefined;
  }

  for(var i=0; i<64; i++)
  {
    for(var j=0; j<64; j++)
    {


      retArr.push(Math.max(x(arr[i+1][j], arr[i][j]),
                            x(arr[i+1][j+1], arr[i][j]),
                            x(arr[i+1][j-1], arr[i][j]),
                            x(arr[i][j+1], arr[i][j]),
                            x(arr[i][j-1], arr[i][j]),
                            x(arr[i-1][j], arr[i][j]),
                            x(arr[i-1][j+1], arr[i][j]),
                            x(arr[i-1][j-1], arr[i][j])));
    }
  }
  return retArr;
}

var drawElevation = function(){
  min = 99999;
  max = -9999;

  ctx.clearRect(0, 0, c.width, c.height);


  var elevations = interleave (getBox(round(lat - .2), round(lng - .2)),
    getBox(round(lat + .2), round(lng - .2)),
    getBox(round(lat - .2), round(lng + .2)),
    getBox(round(lat + .2), round(lng + .2)));


  if(derivative)
  {
    var z = [];
    for(var i = 0; i<64; i++)
    {
      z[i] = [];
    }
    for(var i = 0; i<4096; i++)
    {
      z[(i/64)>>0][i%64] = elevations[i];
    }
    elevations = arrDerivative(z);
  }

  findMinMax(elevations);

  drawPoints(min, max, elevations);
}

var dervButton = document.getElementById("dervBtn");
var normButton = document.getElementById("normBtn");

dervButton.onclick = function(){
  derivative = true;
  initMap();
}
normButton.onclick = function(){
  derivative = false;
  initMap();
}
