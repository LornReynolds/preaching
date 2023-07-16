// import apiKey from config.js

var apiKey = API_KEY;
var database;
var firebase;
var ref;


var data = {sender: null, timestamp: null, lat: null, lng: null, url: null, marker: null};


      function initAuthentication(onAuthSuccess) {
        firebase.auth().signInAnonymously().catch(function(error) {
          console.log(error.code + ', ' + error.message);
        }, {remember: 'sessionOnly'});

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            data.sender = user.uid;
            onAuthSuccess();
          } else {
            // User is signed out.
          }
        });
      }



// // Wait for the markers to be loaded before initializing the map
//  loadMarkersFromDatabase();

// // Call a function to listen for changes in the database
//  listenForMarkerUpdates();

// // Initialize the map
// initMap();

// // Add the marker to the map
//  marker.setMap(map);

////////////////////////////////////////////////////////////////

// Function to initialize the map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32.9217747, lng: -117.0969422},
    zoom: 13.31,
    disableDefaultUI: true,
    // disableDoubleClickZoom: true,
    gestureHandling: "greedy",
    zoomControl: false,
    mapTypeId: 'hybrid',
    tilt: 0,
//    icon: {
//      url: url,
//      scaledSize: new google.maps.Size(30, 30)
//          }
  });
  
  // Add click event listener to the map
  map.addListener('click', (event) => {
      addMarker(event.latLng);
      console.log('click')
  });
}


////////////////////////////////////////////////////////////////

// // Load markers from the Firebase database
// function loadMarkersFromDatabase() {
//   // const markersRef = database.ref('clicks');

//   markersRef.on('child_added', function(snapshot) {
//       const markerData = snapshot.val();
//       console.log('snapshot: ',snapshot.val());
//       const position = new google.maps.LatLng(markerData.position.lat, markerData.position.lng);
//       const icon = url;
//       firebase.database().update


//       const marker = new google.maps.Marker({
//         position: position,
//         map: map,
//         icon: {
//             url: icon,
//             scaledSize: new google.maps.Size(30, 30)
//         }
//     });

//     marker.id = snapshot.key;
//     markers.push(marker);
// });
// }

    // Place a marker on the map
    function addMarker(point) {
      // Create marker
      var marker = new google.maps.Marker({
        position: point,
        map: map,
        // draggable: true,
        icon: {
          url: window.selected,
          scaledSize: new google.maps.Size(70, 70)
          },
        label: '',
        scale: 2,
        tilt: 0,
      });
      addToFirebase(data);
    }  


    function getTimestamp(addClick) {
      //   // Reference to location for saving the last click time.
        var ref = firebase.database().ref('last_message/' + data.sender);

         ref.onDisconnect().remove();  // Delete reference from firebase on disconnect.

      //   // Set value to timestamp.
        ref.set(firebase.database.ServerValue.TIMESTAMP, function(err) {
          if (err) {  // Write to last message was unsuccessful.
            console.log(err);
          } else {  // Write to last message was successful.
            ref.once('value', function(snap) {
              addClick(snap.val());  // Add click with same timestamp.
            }, function(err) {
              console.warn(err);
            });
          }
        });
      }

    function addToFirebase(data) {
      getTimestamp(function(timestamp) {
        // Add the new timestamp to the record data.
        data.timestamp = timestamp;
        data.url = selected;
        var ref = firebase.database().ref('clicks').push(data, function(err) {
          if (err) {  // Data was not written to firebase.
            console.warn(err);
          }
        });
      });
    }


    // Remove the last placed marker
  function removeMarker() {
    if (markers.length === 2) {
      var marker = markers.pop();
      marker.setMap(null);

      // Remove associated info window
      var infoWindow = infoWindows.pop();
      infoWindow.close();
    }
  }