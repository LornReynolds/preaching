// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "gopreach-a7264.firebaseapp.com",
    databaseURL: "https://gopreach-default-rtdb.firebaseio.com",
    projectId: "gopreach",
    storageBucket: "gopreach.appspot.com",
    messagingSenderId: "580349965059",
    appId: "1:580349965059:web:fa37a39239e5add4f02f36",
    measurementId: "G-7EGHMNXZ2L"
  };
  
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database
var database = firebase.database();

var data = {sender: null, timestamp: null, lat: null, lng: null, url: null, marker: null};

/**
 * Set up a Firebase with deletion on clicks older than expiryMs
 * @param {!google.maps.visualization.HeatmapLayer} heatmap The heatmap to
 */
function initFirebase(heatmap) {

  // current time.
  var startTime = new Date().getTime();

  // Reference to the clicks in Firebase.
  var clicks = firebase.database().ref('clicks');

  // Listen for clicks and add them to the heatmap.
  clicks.orderByChild('timestamp').on('child_added',
    function(snapshot) {

      // Get that click from firebase.
      var newPosition = snapshot.val();
      var point = new google.maps.LatLng(newPosition.lat, newPosition.lng);
      var elapsedMs = Date.now() - newPosition.timestamp;
      var icon = snapshot.val();
      var url = snapshot.val();
      // console.log('var url: ', url)
      // console.log("point:", point)
      // Add the point to the heatmap.
      heatmap.getData().push(point);
      //heatmap.getData().push(icon)

      var marker = new google.maps.Marker({
        position: point,
        map: map,
        icon: {
          url: url.icon,
          scaledSize: new google.maps.Size(70, 70),
          draggable: true,
              },
        label: '',
        scale: 1
      });
      

              // Create info window
              var infoWindow = new google.maps.InfoWindow();
              infoWindows.push(infoWindow);

              // Add click listener for opening info window
              var clk = 0
              marker.addListener('click', function() {

                if (clk == 0) {
                  console.log(clk);
                openInfoWindow(marker, infoWindow);
                  clk++;
                  console.log (clk)
                } else {
                  infoWindow.close(marker, infoWindow);
                  console.log(clk);
                  clk = 0
                }
              });
      
                // Add marker to the markers array
                markers.push(marker);


            // Open the info window for the marker
        function openInfoWindow(marker, infoWindow) {

          // Geocode the marker's position to get the address
          geocodeLatLng(marker.getPosition(), function(address) {
            infoWindow.setContent(address);
            infoWindow.open(map, marker);
          });

        
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
      }
    }
  );
}


/**
* Starting point for running the program. Authenticates the user.
* @param {function()} onAuthSuccess - Called when authentication succeeds.
*/
function initAuthentication(onAuthSuccess) {
  firebase.auth().signInAnonymously().catch(function(error) {
    console.log(error.code + ', ' + error.message);
  }, {remember: 'sessionOnly'});

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // console.log("data: ", data)
      data.sender = user.uid;
      onAuthSuccess();
    } else {
      // User is signed out.
    }
  });
}


/**
 * Adds a click to firebase.
 * @param {Object} data The data to be added to firebase.
 *     It contains the lat, lng, sender and timestamp.
 */
function addToFirebase(data) {
  getTimestamp(function(timestamp) {
    // Add the new timestamp to the record data.
    data.timestamp = timestamp;
    data.icon = window.selected;
    data.url = window.selected;
//          data.marker = window.selected;
    var ref = firebase.database().ref('clicks').push(data, function(err) {
      if (err) {  // Data was not written to firebase.
        console.warn(err);
      }
    });
  });
}


/**
 * Updates the last_message/ path with the current timestamp.
 * @param {function(Date)} addClick After the last message timestamp has been updated,
 *     this function is called with the current timestamp to add the
 *     click to the firebase.
 */
function getTimestamp(addClick) {
  //   // Reference to location for saving the last click time.
    var ref = firebase.database().ref('last_message/' + data.sender);
  
  //   ref.onDisconnect().remove();  // Delete reference from firebase on disconnect.
  
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