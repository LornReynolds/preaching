// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js';
// import { getAuth, onAuthStateChanged, getRedirectResult } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmntNR4FrYo0CeTKdFl7Y83BGgi5-EZcc",
  authDomain: "gopreach-a7264.firebaseapp.com",
  databaseURL: "https://gopreach-default-rtdb.firebaseio.com",
  projectId: "gopreach",
  storageBucket: "gopreach.appspot.com",
  messagingSenderId: "580349965059",
  appId: "1:580349965059:web:fa37a39239e5add4f02f36",
  measurementId: "G-7EGHMNXZ2L"
  };
    
const firebaseApp = firebase.initializeApp(firebaseConfig);

// const auth = firebase.getAuth(firebaseApp);
// firebase.onAuthStateChanged(auth, user => { console.log("Authentication: ", auth, user) });


function signInWithEmailPassword() {
  var email = document.getElementById("login-username-input").value;
  var password = document.getElementById("login-password-input").value;
  console.log(`signInWithEmailPassword  email: ${email}  pw: ${password}`);
  // [START auth_signin_password]
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(`Login successful! user: ${user}`);
      window.location = "views/home-page.html";
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(`Login error! errorCode: ${errorCode}  errorMessage: ${errorMessage}`);
    });
  // [END auth_signin_password]
}


// Handle Account Status
// This causes endless looping
// firebase.auth().onAuthStateChanged(user => {
//   if(user) {
//     window.location = 'views/home-page.html'; //After successful login, user will be redirected to home.html
//   } else {
//     window.location = 'index.html'; //After successful login, user will be redirected to home.html
//   }
// });

  
const loginBtn = document.getElementById("login-button");
loginBtn.addEventListener("click", e => {
  e.preventDefault()
  signInWithEmailPassword()
})