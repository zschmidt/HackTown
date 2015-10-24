var fullURL = "http://dev.virtualearth.net/REST/v1/Elevation/List?points=39.7391536,-104.9847034&key=AgdJmHJNbOApcjOXhgGoeD0OeiaEoxJ-zXbtF60rdVvWnD2GZeH-czRQ9lH03Vil"


var apiLocation = "http://dev.virtualearth.net/REST/v1/Elevation/List?points=";

var key = "&key=AgdJmHJNbOApcjOXhgGoeD0OeiaEoxJ-zXbtF60rdVvWnD2GZeH-czRQ9lH03Vil";


$.ajax(
{
    type: 'GET',
    url : apiLocation + '39.7391536,-104.9847034' + key,
    dataType:'jsonp',
    cache : true,
    crossDomain : true,
    success: function (data)
    {
        debugger;
        console.log(data);
    },
    error: function (e)
    {
        console.log("Error! ",e);
    }
});

