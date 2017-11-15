var used = [];
var marker = [];
var infowindows = [];
var contents = [];
var startPub, endPub;

function initMap() {
    $.getJSON("https://api.myjson.com/bins/72w7n", function (data) {
        myData = data;
        console.log(myData);
        
        // Fill 'Start Point' dropdown with pub names
        var selectStart = document.getElementById("start");
        for (var i = 0; i < myData.length; i++) {
            var pubName = myData[i].name;
            var location = myData[i].lat + ", " + myData[i].long;
            var el = document.createElement("option");
            el.text = pubName;
            el.value = i;
            selectStart.appendChild(el);
        }
        
        //
        var selectEnd = document.getElementById("end");
        for (var i = 0; i < myData.length; i++) {
            var pubName = myData[i].name;
            var location = myData[i].lat + ", " + myData[i].long;
            var el = document.createElement("option");
            el.textContent = pubName;
            el.value = i;
            selectEnd.appendChild(el);
        }

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer;
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: {
                lat: myData[10].lat,
                lng: myData[10].long
            } // Centres on The Roundabout pub, which is as close as Plymouth has to a central pub
        });
        directionsDisplay.setMap(map);
        
        // On click event
        document.getElementById('submit').addEventListener('click', function () {        
            $("#pub_list").html("");
            calculateAndDisplayRoute(directionsService, directionsDisplay);
        });

        function calculateAndDisplayRoute(directionsService, directionsDisplay) {            
            var waypts = [];
            var numberOfPubs = parseInt(document.getElementById('numberPubs').value);
            for (var i = 0; i < numberOfPubs; i++) {
                var randomPub = Math.floor(Math.random() * myData.length);

                if (randomPub != used[i - 1] && randomPub != used[i - 2] && randomPub != used[i - 3] && randomPub != used[i - 4] && randomPub != used[i - 5] && randomPub != used[i - 6] && randomPub != used[i - 7] && randomPub != used[i - 8] && randomPub != used[i - 9] && randomPub != used[i - 10]) {
                    used[i] = randomPub;
                    var pubLocation = myData[randomPub].lat + ", " + myData[randomPub].long;
                    waypts.push({
                        location: pubLocation,
                        stopover: true
                    })
                }
                
                $('#pub_list').append('<li><div class="container"><h2>' + ((i+1) + 1) + '. ' + myData[randomPub].name + ' <span class="rating">' + 'Our Rating: ' + myData[randomPub].rating + '</span></h2><p>' + myData[randomPub].description + '</p></div></li>'); // adds pub names and descriptions to the pub_list div
            }
            
            // Define start pub and add create list item
            startPub = myData[document.getElementById('start').value];
            console.log("Starting Pub: " + startPub.name);
            $('#start-point-list').append('<li><div class="container"><h2>1. ' + startPub.name + ' <span class="rating">' + 'Our Rating: ' + startPub.rating + '</span></h2><p>' + startPub.description + '</p></div></li>');
            
            // Define end pub and add create list item
            endPub = myData[document.getElementById('end').value];
            console.log("Ending: " + endPub.name);
            $('#end-point-list').append('<li><div class="container"><h2>' + (numberOfPubs + 2) + '. ' + endPub.name + ' <span class="rating">' + 'Our Rating: ' + endPub.rating + '</span></h2><p>' + endPub.description + '</p></div></li>');
            
            directionsService.route({
                origin: startPub.lat + ", " + startPub.long,
                destination: endPub.lat + ", " + endPub.long,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: 'WALKING'
            }, function (response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                    var route = response.routes[0];
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }

    });
}
