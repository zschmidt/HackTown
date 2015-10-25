var widthHeight = document.getElementById("myCanvas").clientWidth;
var lat;
var lng;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var derivative = false;

function avg(a, b)
{
  return (Number(a) + Number(b))/2;
}

function round(a)
{
  return ((1000*a)>>0)/1000;
}

function findMinMax(arr, minMax)
{
  for(var i = 0; i<arr.length; i++)
  {
    arr[i] = round(arr[i]*3.28);
    if(arr[i]<minMax.min)
    {
      minMax.min = arr[i];
    }
    if(arr[i]>minMax.max)
    {
      minMax.max = arr[i];
    }
  }
  document.getElementById("out").innerHTML = "<br><br><h4>Max: </h4>"+minMax.max+" feet<br><h4>Min: </h4>"+minMax.min+" feet<br><br>";
}

function initMap() {
  var mapquestApi = "http://www.mapquestapi.com/geocoding/v1/address?key=KM4sDe5QGtHmGxLIm6LoMhYLQ7AkGrGY&location=";

  if(document.getElementById("long").value != "" && document.getElementById("lat").value != ""){
    lat = Number(document.getElementById("lat").value);
    lng = Number(document.getElementById("long").value);
  }
  else if(document.getElementById("location").value != ""){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open(
        "GET", 
        mapquestApi + document.getElementById("location").value, 
        false 
      ); // false for synchronous request
    xmlHttp.send(null);
    //xmlHttp.responseText; 
    lat = JSON.parse(xmlHttp.responseText);
    lat = lat.results[0].locations[0].latLng;
    lng = lat.lng;
    lat = lat.lat; // gross :)

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

var drawElevation = function(){
  var minMax = {};
  minMax.min = 99999;
  minMax.max = -9999;

  ctx.clearRect(0, 0, c.width, c.height);

  var elevations = interleave(
    getBox(round(lat - .2), round(lng - .2)),
    getBox(round(lat - .2), round(lng + .2)),
    getBox(round(lat + .2), round(lng - .2)),
    getBox(round(lat + .2), round(lng + .2))
  );


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

  findMinMax(elevations, minMax);

  drawPoints(minMax.min, minMax.max, elevations);
}

var getBox = function(lat, lng){
  var apiLocation = "http://dev.virtualearth.net/REST/v1/Elevation/Bounds?bounds=";
  var queries = "&rows=32&cols=32&heights=sealevel";
  var key = "&key=AgdJmHJNbOApcjOXhgGoeD0OeiaEoxJ-zXbtF60rdVvWnD2GZeH-czRQ9lH03Vil";
  var retData = "nothing";
  west = lng - .2;
  north = lat + .2;
  east = lng + .2;
  south = lat - .2;

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open(
      "GET", 
      apiLocation+ south +","+ west + ","+ north + "," + east + queries +key, 
      false 
    ); // false for synchronous request
  xmlHttp.send(null);
  retData = JSON.parse(xmlHttp.responseText);
  retData = retData.resourceSets[0].resources[0].elevations;

  return retData;
}

function drawPoints(min, max, elevations)
{
  for(var k = 0; k<elevations.length; k++)
  {
    if(elevations[k] !=min && elevations[k] <= 0)
    {
      //debugger;
    }
    //Issue: This works... poorly... with negative elevations
    var color = elevations[k] == min ? 0 : 255 - ((255/(max-Math.abs(min))) * (elevations[k]-min))>>0;
    ctx.fillStyle = "rgba("+color+", "+color+", "+color+", "+0.3+")";
    //ctx.fillRect((widthHeight/64)*(k%64),widthHeight - widthHeight/64 - (widthHeight/64 * Math.floor(k/64)),widthHeight/64,widthHeight/64);
    ctx.beginPath();
    ctx.arc((widthHeight/64)*(k%64),widthHeight - widthHeight/64 - (widthHeight/64 * Math.floor(k/64)),widthHeight/64, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}


function interleave(a1, a2, a3, a4)
{
  var elevations = [];
  for(var i=0; i<32; i++)
  {
    elevations = elevations.concat(a1.splice(0, 32));
    elevations = elevations.concat(a2.splice(0, 32));
  }
  for(var i=0; i<32; i++)
  {
    elevations = elevations.concat(a3.splice(0, 32));
    elevations = elevations.concat(a4.splice(0, 32));
  }
  return elevations;
}

function arrDerivative(arr){
  function x(a, y)
  {
    if(a == undefined)
      return y;
    else {
      return Math.abs(a-y);
    }
  }
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
