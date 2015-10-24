var main = function(){

  var east = document.getElementById("east").value;
  var south = document.getElementById("south").value;
  var west = document.getElementById("west").value;
  var north = document.getElementById("north").value;


  var apiLocation = "http://dev.virtualearth.net/REST/v1/Elevation/Bounds?bounds=";
  var queries = "&rows=32&cols=32&heights=sealevel";

  var key = "&key=AgdJmHJNbOApcjOXhgGoeD0OeiaEoxJ-zXbtF60rdVvWnD2GZeH-czRQ9lH03Vil";


  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0,0,150,75);


  var boudingBox = "http://dev.virtualearth.net/REST/v1/Elevation/Bounds?bounds=43.64,-123.671,44.34,-122.557&rows=100&cols=100&heights=sealevel"



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
                document.getElementById("out").innerHTML += "Elevation is: "+elevations[k]+"<br>";
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
