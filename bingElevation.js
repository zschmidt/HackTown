var main = function(){

  var lat = document.getElementById("lat").value;
  var long = document.getElementById("long").value;


  var apiLocation = "http://dev.virtualearth.net/REST/v1/Elevation/List?points=";

  var key = "&key=AgdJmHJNbOApcjOXhgGoeD0OeiaEoxJ-zXbtF60rdVvWnD2GZeH-czRQ9lH03Vil";


  $.ajax(
  {
      type: 'GET',
      cache : false,
      url : apiLocation+ lat +","+ long  +key,
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
                document.getElementById("out").innerHTML += "Elevation at "+lat+","+long+" is: "+elevations[k];
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
