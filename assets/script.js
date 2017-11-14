function initMap() {
    $.getJSON("assets/myData.json", function (data) {
        myData = data;
        console.log(myData);
        
        var selectStart = document.getElementById("start");
        for(var i = 0; i < myData.length; i ++) {
            var pubName = myData[i].name;
            var location = myData[i].lat + ", " + myData[i].long;
            var el = document.createElement("option");
            el.textContent = pubName;
            el.value = location;
            selectStart.appendChild(el);
        }
        
        var selectWaypoint = document.getElementById("waypoints");
        for(var i = 0; i < myData.length; i ++) {
            var pubName = myData[i].name;
            var location = myData[i].lat + ", " + myData[i].long;
            var el = document.createElement("option");
            el.textContent = pubName;
            el.value = location;
            selectWaypoint.appendChild(el);
        }
        
        var selectEnd = document.getElementById("end");
        for(var i = 0; i < myData.length; i ++) {
            var pubName = myData[i].name;
            var location = myData[i].lat + ", " + myData[i].long;
            var el = document.createElement("option");
            el.textContent = pubName;
            el.value = location;
            selectEnd.appendChild(el);
        }
    });
    
    
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: {
            lat: 41.85,
            lng: -87.65
        }
    });
    directionsDisplay.setMap(map);

    document.getElementById('submit').addEventListener('click', function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    var waypts = [];
    var checkboxArray = document.getElementById('waypoints');
    for (var i = 0; i < checkboxArray.length; i++) {
        if (checkboxArray.options[i].selected) {
            waypts.push({
                location: checkboxArray[i].value,
                stopover: true
            });
        }
    }

    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: 'WALKING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById('directions-panel');
            summaryPanel.innerHTML = '';
            // For each route, display summary information.
            for (var i = 0; i < route.legs.length; i++) {
                var routeSegment = i + 1;
                summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                    '</b><br>';
                summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
            }
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}
