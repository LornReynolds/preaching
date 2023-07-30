function signOut() {
    firebase.auth().signOut()
      .then(() => {
        window.location = '../index.html';
        console.log("Signed out successfully.");
      }) 
  }


loginBtn = document.getElementById("logout-button");
loginBtn.addEventListener("click", signOut);