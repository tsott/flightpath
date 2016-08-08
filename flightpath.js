// Animation / interval Vars
var animLoop = false,
    animIndex = 0,
    planePath = false,
    trailPath = false;

// Reference of city lat / long points

var places = {
    "warsaw": [52.2330, 20.9211],
    "paris": [48.8589, 2.3522],
    "toronto": [43.6532, -79.3831],
    "niagara": [43.0895, -79.0849],
    "montreal": [45.5016, -73.5672],
    "drummondville": [45.8802, -72.4842],
    "quebec": [46.8138, -71.2079],
    "newyork": [40.7127, -74.0059],
    "washington": [38.9071, -77.0368],
    "atlanta": [33.7489, -84.3879],
    "waynesville": [35.4887, -82.9887],
    "amsterdam": [52.3702, 4.8951]
};

// Set up a google maps object with disabled user interaction (no zoom, no pan etc.)

function loadMap() {
    var options = {
        draggable: false,
        panControl: false,
        streetViewControl: false,
        scrollwheel: false,
        scaleControl: false,
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        zoom: 4,
        center: new google.maps.LatLng(52.2330, 20.9211),
        styles: [{
            "featureType": "administrative",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "water",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "landscape",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.highway",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road.local",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "water",
            "stylers": [{
                "color": "#84afa3"
            }, {
                "lightness": 52
            }]
        }, {
            "stylers": [{
                "saturation": -17
            }, {
                "gamma": 0.36
            }]
        }, {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{
                "color": "#3f518c"
            }]
        }]
    };
    mapObject = new google.maps.Map(document.getElementById('mapCanvas'), options);
}

// Symbols use an SVG path

var planeSymbol = {
    path: 'M22.1,15.1c0,0-1.4-1.3-3-3l0-1.9c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.7c-0.5-0.5-1.1-1.1-1.6-1.6l0-1.5c0-0.2-0.2-0.4-0.4-0.4l-0.4,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.3c-1-0.9-1.8-1.7-2-1.9c-0.3-0.2-0.5-0.3-0.6-0.4l-0.3-3.8c0-0.2-0.3-0.9-1.1-0.9c-0.8,0-1.1,0.8-1.1,0.9L9.7,6.1C9.5,6.2,9.4,6.3,9.2,6.4c-0.3,0.2-1,0.9-2,1.9l0-0.3c0-0.2-0.2-0.4-0.4-0.4l-0.4,0C6.2,7.5,6,7.7,6,7.9l0,1.5c-0.5,0.5-1.1,1-1.6,1.6l0-0.7c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,1.9c-1.7,1.6-3,3-3,3c0,0.1,0,1.2,0,1.2s0.2,0.4,0.5,0.4s4.6-4.4,7.8-4.7c0.7,0,1.1-0.1,1.4,0l0.3,5.8l-2.5,2.2c0,0-0.2,1.1,0,1.1c0.2,0.1,0.6,0,0.7-0.2c0.1-0.2,0.6-0.2,1.4-0.4c0.2,0,0.4-0.1,0.5-0.2c0.1,0.2,0.2,0.4,0.7,0.4c0.5,0,0.6-0.2,0.7-0.4c0.1,0.1,0.3,0.1,0.5,0.2c0.8,0.2,1.3,0.2,1.4,0.4c0.1,0.2,0.6,0.3,0.7,0.2c0.2-0.1,0-1.1,0-1.1l-2.5-2.2l0.3-5.7c0.3-0.3,0.7-0.1,1.6-0.1c3.3,0.3,7.6,4.7,7.8,4.7c0.3,0,0.5-0.4,0.5-0.4S22,15.3,22.1,15.1z',
    fillColor: '#000',
    fillOpacity: 1.5,
    scale: 1,
    anchor: new google.maps.Point(11, 11),
    strokeWeight: 0,
};

var busSymbol  = {
	path:'M1,64C1,44,1,24,1,4c2,0,3.9,1.3,6.2,0.3C10.9,2.6,14.9,1.6,19,1c1,0,2,0,3,0c2.1,4.6-0.5,11.2,6,14c0,1,0,2,0,3  c-4.7,2.6-5.4,6.7-4.9,11.6c0.3,2.9,0.3,6,0,8.9c-0.5,4.8,0,9,4.9,11.5c0,1.3,0,2.7,0,4c-4.6,1.4-5.4,4.8-4.9,8.9  c0.3,2.1-0.1,4.2-1.1,6.1c-3.3,0-6.7,0-10,0C8.8,66.3,3.8,67.6,1,64z M12.6,8.1c-0.7-0.6,1.8-4.3-1.5-3.7C8.3,5,3.8,4.7,3.9,10.1  c0.1,3.6,2,3.3,4.4,3.5C11.9,13.9,13.7,12.8,12.6,8.1z M12.8,40.2c0.9-5.9-4-5.2-6.9-5.9c-3.1-0.7-1.6,2.4-1.9,3.8  c-1,5.6,3.9,5,6.8,5.6C14,44.4,12.3,41.3,12.8,40.2z M12.8,50.3c0.8-6-4.1-5.2-6.9-5.8c-3-0.7-1.6,2.4-1.8,3.9  c-0.9,5.6,3.9,4.9,6.8,5.5C14,54.5,12.3,51.3,12.8,50.3z M12.7,30.5c1.1-6.3-3.9-5.5-6.7-6.2C2.8,23.5,4.3,26.6,4,28  c-1,5.6,3.9,4.9,6.8,5.6C14,34.4,12.3,31.3,12.7,30.5z M4.3,57.4c-1.5,6.4,3.1,5.9,6.2,6.7c3.3,0.8,2.3-1.9,2.4-3.5  c0.2-3.8-2.6-6.1-7-6.1C2.8,54.5,4.5,56.8,4.3,57.4z M12.6,20.8c0.7-3.9,0.1-6-3.8-5.6c-2.3,0.3-5-0.8-5,3.4  c0.1,5.3,4.5,4.1,7.2,4.9C13.7,24.3,12.4,21.3,12.6,20.8z',
	fillColor: '#000',
	fillOpacity: 1.5,
	scale: 0.4,
	anchor: new google.maps.Point(11, 11),
	strokeWeight: 0,
};

var trainSymbol ={
	path: 'M57,424c-1.6,0-3.6-0.2-3.3,2.3c0.6,3.7-1.4,4-4.4,4c-8.6-0.1-17.3-0.2-25.9,0c-3.6,0.1-4.4-1.2-4.4-4.6  c0.1-42.1,0.1-84.2,0-126.2c0-3.6,0.7-5.1,4.6-4.9c8.6,0.3,17.3,0.2,25.9,0c2.8,0,4.6,0.4,4.1,3.8c-0.4,2.5,1.6,2.9,3.3,3.6  c0,2.7,0,5.3,0,8c-3.1,0.7-3.9,2.8-3.7,5.8c0.1,2.6,1.5,3.3,3.7,3.2c0,3,0,6,0,9c-2.1,0.5-3.4,1.3-3.3,3.9c0.1,20.4,0.1,40.8,0,61.2  c0,2.6,1,3.6,3.3,3.9c0,3,0,6,0,9c-2.5,0.3-3.7,1.4-3.8,4.2c-0.1,2.9,1.2,4.2,3.8,4.8C57,418,57,421,57,424z M27.3,327  c0,8.5,0,17,0,25.5c0,1.9-0.1,3.6,2.7,3.6c2.9,0,2.6-1.8,2.6-3.7c0-16.7,0-33.3,0-50c0-1.9,0.1-3.6-2.7-3.6c-2.9,0-2.6,1.8-2.6,3.7  C27.3,310.7,27.3,318.8,27.3,327z M27.3,386.6c0,8,0,15.9,0,23.9c0,1.9-0.2,3.6,2.7,3.6c2.8,0,2.7-1.7,2.7-3.6c0-15.8,0-31.5,0-47.3  c0-1.9,0.2-3.7-2.7-3.7c-2.8,0-2.7,1.8-2.7,3.7C27.3,371,27.3,378.8,27.3,386.6z M35.6,301.1c0,0-0.1,0-0.1,0c0,36.9,0,73.7,0,110.6  c0,0,0.1,0,0.1,0C35.6,374.8,35.6,338,35.6,301.1z M32.7,421.5c0.2-1.9,0-3.2-2.5-3.2c-2.6-0.1-3,1.2-2.9,3.3  c0.1,1.8,0.1,3.1,2.5,3.2C32.4,424.8,33,423.6,32.7,421.5z M57,287c-1.5,0.4-3.5,1.1-3.3,2.5c0.8,5.8-3.1,4.6-6.3,4.7  c-7.8,0-15.6-0.1-23.5,0.1c-3.5,0.1-5-0.7-5-4.7c0.1-42.3,0.1-84.5,0-126.8c0-3.4,1.2-4.2,4.4-4.1c8.8,0.2,17.6,0.1,26.5,0  c2.5,0,4.4,0.2,3.9,3.4c-0.4,2.6,1.1,3.1,3.3,2.9c0,3,0,6,0,9c-2.4,0.5-3.8,1.6-3.8,4.5c0,2.9,1.2,4.1,3.8,4.5c0,3,0,6,0,9  c-3-0.1-3.3,1.5-3.3,4.1c0.1,20.1,0.1,40.3,0,60.4c0,2.7,0.9,4,3.4,4.4c0,3,0,6,0,9c-3.3-0.4-3.7,1.6-3.8,4.3c-0.1,2.8,1,4,3.8,3.7  C57,281,57,284,57,287z M27.3,190.5c0,8.7,0,17.3,0,26c0,1.8-0.1,3.2,2.5,3.3c2.6,0.1,3-1.2,3-3.3c0-16.8,0-33.6,0-50.5  c0-1.9,0.1-3.6-2.8-3.6c-2.9,0-2.7,1.8-2.7,3.6C27.3,174.2,27.3,182.3,27.3,190.5z M32.7,251c0-8,0-15.9,0-23.9c0-2,0.4-4-2.9-3.9  c-3,0.1-2.6,1.9-2.6,3.7c0,15.8,0,31.5,0,47.3c0,2.5,0.6,3.6,3.3,3.6c3,0,2.1-2,2.1-3.4C32.7,266.6,32.7,258.8,32.7,251z   M35.6,164.1c0,0-0.1,0-0.1,0c0,37.2,0,74.4,0,111.6c0,0,0.1,0,0.1,0C35.6,238.5,35.6,201.3,35.6,164.1z M32.7,285.6  c0.1-1.8,0.2-3.4-2.4-3.3c-2,0-3.2,0.4-3,2.7c0.1,1.7-0.1,3.4,2.4,3.4C31.7,288.4,32.9,287.8,32.7,285.6z M57,151  c-2.2-0.3-3.6,0.3-3.2,2.8c0.4,3.1-1,4.1-4,4c-9-0.1-18-0.1-27,0c-2.7,0-3.8-0.9-3.8-3.8c0.1-30-0.1-60,0.2-89.9  c0.1-11.1,5.3-20.7,10.9-30c2.5-4.2,4.6-8.7,8.7-11.9c6.4-5.1,11.8-3.9,13.9,3.9c1,3.6,2.6,1.8,4.3,1.8c0,10.7,0,21.3,0,32  c-3.2,0.6-4,2.6-3.8,5.6c0.1,2.7,1.6,3.3,3.8,3.4c0,3,0,6,0,9c-2.7,0.2-3.3,1.7-3.3,4.3c0.1,12.7,0.2,25.5,0,38.2  c0,2.7,0.9,3.5,3.3,3.4c0,3,0,6,0,9c-2.6,0.4-3.8,1.6-3.8,4.5c0,2.9,1.3,4,3.8,4.5C57,145,57,148,57,151z M32.7,119.5  c0-6.6,0-13.3,0-19.9c0-2,0.4-4.1-2.8-4c-3.3,0.1-2.6,2.4-2.6,4.2c0,13.1,0,26.2,0,39.3c0,1.8-0.4,3.6,2.6,3.7  c3.2,0.1,2.9-1.8,2.9-3.9C32.7,132.5,32.7,126,32.7,119.5z M32.7,56.5c-0.4-0.1-0.8-0.3-1.3-0.4c-0.6,3-4.2,4-4.2,7.5  c0.1,8.5,0,16.9,0,25.4c0,1.9,0.2,3.2,2.6,3.2c2.2,0,2.9-0.9,2.9-3C32.7,78.3,32.7,67.4,32.7,56.5z M35.7,30.1  c-0.1,0-0.1,0.1-0.2,0.1c0,36.9,0,73.7,0,110.6c0.1,0,0.1,0,0.2,0C35.7,103.9,35.7,67,35.7,30.1z M32.7,150.2  c0.1-1.7,0.2-3.2-2.3-3.3c-2.4-0.1-3.2,0.8-3.1,3.1c0.1,1.9,0.3,3.1,2.7,3.1C32,153.1,33,152.4,32.7,150.2z',
	fillColor: '#000',
	fillOpacity: 1.5,
	scale: 0.2,
	anchor: new google.maps.Point(11, 11),
	strokeWeight: 0,
};

var ico = planeSymbol;

function animate(startPoint, endPoint) {
    // Convert the points arrays into Lat / Lng objects
    var sP = new google.maps.LatLng(startPoint[0], startPoint[1]);
    var eP = new google.maps.LatLng(endPoint[0], endPoint[1]);

    // Create a polyline for the planes path

    planePath = new google.maps.Polyline({
        path: [sP, eP],
        strokeColor: '#0f0',
        strokeWeight: 0,
        icons: [{
            icon: ico,
            offset: '0%'
        }],
        map: mapObject,
        geodesic: true
    });

    trailPath = new google.maps.Polyline({
        path: [sP, sP],
        strokeColor: '#2eacd0',
        strokeWeight: 2,
        map: mapObject,
        geodesic: true
    });

    // Start the animation loop
    animLoop = window.requestAnimationFrame(function() {
        tick(sP, eP);
    });
}

/*
	Runs each animation "tick"
*/

function tick(startPoint, endPoint) {
    animIndex += 0.2;

    // Draw trail
    var nextPoint = google.maps.geometry.spherical.interpolate(startPoint, endPoint, animIndex / 100);
    trailPath.setPath([startPoint, nextPoint]);

    // Move the plane
    planePath.icons[0].offset = Math.min(animIndex, 100) + '%';
    planePath.setPath(planePath.getPath());

    // Ensure the plane is in the center of the screen
    mapObject.panTo(nextPoint);

    // We've reached the end, clear animLoop
    if (animIndex >= 100) {
        window.cancelAnimationFrame(animLoop);
        animIndex = 0;
        removeLine();
        setTimeout(function() {

        }, 700);
    } else {
        animLoop = window.requestAnimationFrame(function() {
            tick(startPoint, endPoint);
        });
    }
}

// Remove trail 
function removeLine() {
    if (trailPath){
        trailPath.setMap(null);
	}
}
 // Remove airplane symbol, trail and reset everything for the next animation
function removeAnim() {
    removeLine();
    if (trailPath){
        planePath.setMap(null);
	}
    window.cancelAnimationFrame(animLoop);
    animIndex = 0;
}

function animation(i) {
    switch (i) {
        case 0:
            window.animate(places.warsaw, places.paris);
            break;
        case 1:
			ico = planeSymbol;
            animate(places.paris, places.toronto);
            break;
        case 2:
			ico = busSymbol;
            animate(places.toronto, places.niagara);
            break;
        case 3:
            animate(places.niagara, places.montreal);
            break;
        case 4:
            animate(places.montreal, places.drummondville);
            break;
        case 5:
            animate(places.drummondville, places.quebec);
            break;
        case 6:
            animate(places.quebec, places.drummondville);
            break;
        case 7:
			ico = busSymbol;
            animate(places.drummondville, places.montreal);
            break;
        case 8:
			ico = trainSymbol;
            animate(places.montreal, places.newyork);
            break;
        case 9:
			ico = busSymbol;
            animate(places.newyork, places.washington);
            break;
        case 10:
			ico = planeSymbol;
            animate(places.washington, places.atlanta);
            break;
        case 11:
            ico = busSymbol;
            animate(places.atlanta, places.waynesville);
            break;
        case 12:
            animate(places.waynesville, places.atlanta);
            break;
        case 13:
			ico = planeSymbol;
            animate(places.atlanta, places.amsterdam);
            break;
		case 14:
			animate(places.amsterdam, places.warsaw);
			break;
    }
}

$(document).ready(function() {
    var i = 0;
    $('.tile').each(function eachElement() {
        // cache the jQuery object
        var $this = $(this);
        var position = $this.position();
        $this.scrollspy({
            min: position.top,
            max: position.top + $this.height(),
            onLeaveBottom: function onEnter(element /*, position*/ ) {
                removeAnim();
                animation(i);
                i++;
            },
            onLeaveTop: function onLeave(element /*, position*/ ) {
                i--;
                removeAnim();
                animation(i);
                if (i < 0) i = 0;
            }
        });
    })
})


