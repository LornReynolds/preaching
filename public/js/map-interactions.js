
// import { initAuthentication } from "./firebase-operations";

// Radio buttons for selecting map icon color
let radioBtns = document.querySelectorAll ("input[name='color']");
let result = document.getElementById("result");

let findSelected = () => {
    var selected = document.querySelector("input[name='color']:checked").value;
    result.textContent = `${selected}`;
    // console.log('selected: ', result.textContent);
    window.selected = result.textContent;
}

radioBtns.forEach(radioBtn => {
    radioBtn.addEventListener("change", findSelected);
});

// var choice = result.textContent;
findSelected();    

// Add a reference to the Google Maps API script with the callback to initMap method
function loadMapScript() {
  var script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization&callback=initMap`
  script.defer = true;
  script.async = true;
  document.body.appendChild(script);
}

loadMapScript()

// Initialize Google Map
function initMap() {
  // Create map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.9265058, lng: -117.0870638},
    zoom: 13,
    disableDefaultUI: true,
    // disableDoubleClickZoom: true,
    gestureHandling: "greedy",
    zoomControl: false,
    mapTypeId: 'hybrid',
    tilt: 0,
  });

  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.style.fontSize = "45px"
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
        //  infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(23)
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });

  // Create geocoder
  geocoder = new google.maps.Geocoder();

// Add touch listener for removing markers
//           TOUCH EVENTS          //

document.addEventListener("touchstart", e => {
if (e.targetTouches.length >= 3) {
  var marker = markers.pop();
  marker.setMap(null);

  // Remove associated info window
  var infoWindow = infoWindows.pop();
  infoWindow.close();
}
})

document.addEventListener("touchmove", e => {
;[...e.changedTouches].forEach(touch => {
  console.log('touchmove')
})
})

document.addEventListener("touchend", e => {
  ;[...e.changedTouches].forEach(touch => {
  //        const dot = map.getElementById(touch.identifier);
  //        dot.remove()
  })
})


document.addEventListener("touchcancel", e => {
;[...e.changedTouches].forEach(touch => {
  var marker = markers.pop();
  marker.setMap(null);
})
})

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  // Geocode the given latLng to get the address
  function geocodeLatLng(latLng, callback) {
    geocoder.geocode({ 'location': latLng }, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          callback(results[0].formatted_address);
        } else {
          callback('Address not found');
        }
      } else {
        callback('Geocoder failed due to: ' + status);
      }
    });
  }

  // Listen for clicks and add the location of the click to firebase.
  map.addListener('click', function(e) {
    data.lat = e.latLng.lat();
    data.lng = e.latLng.lng();
    data.icon = window.selected;
  //  placeMarker(e.latLng);
    addToFirebase(data);
    // console.log('data: ', data);
    url = window.selected;
  });

  // Create a heatmap.
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: [],
    map: map,
    radius: 5,
  });

  initAuthentication(initFirebase.bind(undefined, heatmap), data);
}


// Place a marker on the map
function placeMarker(point) {
    // Create marker
    var marker = new google.maps.Marker({
        position: point,
        map: map,
        draggable: false,
        icon: {
        url: selected,
        scaledSize: new google.maps.Size(70, 70),
                },
        scale: 2,
        tilt: 0,
    }); 
    url = selected;
    // console.log('url: ', url);
    marker.setIcon();
    // }  

    // Add marker to the markers array
    markers.push(marker);
}


// Right-Click listener for removing markers
// Currently temporary and markers appears upon refresh
// Removes last marker, not marker at location
// document.addEventListener("contextmenu", (e) => {
//   console.log("e: ", e);
//   console.log("markers: ", markers);
  // var marker = markers.pop();
  // console.log("marker: ", marker)
  // if (marker) {
  //     marker.setMap(null);
  // }
  // // Remove associated info window
  // var infoWindow = infoWindows.pop();
  // infoWindow.close();
// })