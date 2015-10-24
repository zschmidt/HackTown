var apiLocation = "https://maps.googleapis.com/maps/api/elevation/json?locations=";

var key = "&key=AIzaSyB5IiIymO4tkM3j19YqJkWrFJZms13ayDk";


debugger;

$.ajax(
{
    type: 'get',
    cache: false,
    url: apiLocation + '39.7391536,-104.9847034' + key,
    async: false,
    dataType: 'jsonp',
    success: function (data)
    {
        debugger;
        data = JSON.parse(data);
        document.write(data);
        console.log(data);
    },
    error: function (e)
    {
        console.log("Error! ",e);
    }
});