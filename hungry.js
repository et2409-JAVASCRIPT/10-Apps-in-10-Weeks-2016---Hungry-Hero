var map;

$(document).ready(
        function()
        {
            if(navigator.geolocation) 
            {
                navigator.geolocation.getCurrentPosition(success, fail);
            }
        }
    );
    
    function success(position)
    {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        getPlaces(lat,long);
    }
    
    function fail(error)
    {
        console.log(error.message);
    }
    
    function getPlaces(lat,long)
    {
        var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
        url += lat + "," + long;
        url += "&radius=500&types=food&key=AIzaSyA0KmKrw6L_BlvWvP7sz1iGHu1cyIZGRQU";
        var resultList="";
        $.ajax({url: url,
                 success: function(result)   { 
                     var places = result.results;
                     
                     $(places).each(function(x){
                        var iconURL = places[x].icon;
                        var vicinity = places[x].vicinity;
                        var name = places[x].name;
                        var open;                       
                        try{
                            open = places[x].opening_hours.open_now;
                        } catch(e)
                        {
                            open = "unknown";
                        }
                       // console.log(name + " " + vicinity + " " + open + " " + iconURL);
                        var itemHTML = wrapItem(name, vicinity, iconURL, open);
                        resultList += itemHTML;
                        $('#resultList').html(resultList);
                        
                     }
                     )
                     $('#resultList').listview().listview();
                 },
                 error:  function(error) { 
                     console.log("Error"); 
                 }        
               });
        makeMap(lat,long);
    }
    
    function makeMap(lat,long)
    {
        var service;
        var infowindow;
        var location = new google.maps.LatLng(lat,long);
        
        map = new google.maps.Map(document.getElementById('map'), {
            center: location,
            zoom: 15
        });

        var request = {
            location: location,
            radius: '500',
            types: ['food']
        };
        
        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, function(results,status){
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    var place = results[i];
                    createMarker(place);
            }
            }});
    
    }
    
    function createMarker(result)
    {
        console.log(result);
            var lat = result.geometry.location.lat();
            var long = result.geometry.location.lng();
            var pos = {lat: lat, lng: long};
            console.log(result.name);
            
            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                title: result.name
            });
    }


    function wrapItem(n,v,i,o)
    {
        if(o==true){
        var out ="<li>";
        out += "<img src='" + i + "'/>";
        out += "<h2>" + n + "</h2>";
        out += "<p>" + v + "</p>";
        out += "<p><span class='open'>OPEN NOW</span></p>" 
        out += "</li>";
        return out;
       } else
       {
        var out ="<li>";
        out += "<img src='" + i + "'/>";
        out += "<h2>" + n + "</h2>";
        out += "<p>" + v + "</p>";
        out += "</li>";
        return out;
       }
    }