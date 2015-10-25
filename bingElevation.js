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
