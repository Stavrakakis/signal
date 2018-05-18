import * as firebase from "firebase";
import "@firebase/firestore";
// Render the top-level React component
import React from "react";
import ReactDOM from "react-dom";
import MobileAppContainer from "./MobileAppContainer/MobileAppContainer.jsx";
import SignalList from "../SignalList.js";
import SignalButtonList from "../SignalButtonList.js";
import SignalButton from "../SignalButton";
import UserSignal from "../UserSignal.js";
import User from "../User";
import moment from "moment";

var config = {
  apiKey: "AIzaSyBVYw8O4NuxMRz63Jr9jmPyie3JF-x5x6M",
  authDomain: "meet-f3f8c.firebaseapp.com",
  databaseURL: "https://meet-f3f8c.firebaseio.com",
  projectId: "meet-f3f8c",
  storageBucket: "",
  messagingSenderId: "465362118588",

  clientId:
    "992715321827-7grtdl47sd1jp3jk7kqtlhbgj3ohi4l3.apps.googleusercontent.com",
  scopes: ["email", "profile", "https://www.googleapis.com/auth/calendar"],
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  ]
};

firebase.initializeApp(config);

var db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

// window.addEventListener("beforeunload", function (e) {
//   var confirmationMessage = "\o/";

//   (e || window.event).returnValue = confirmationMessage; //Gecko + IE
//   return confirmationMessage;                            //Webkit, Safari, Chrome
// });

function deleteUserSignals(email, roomId) {
  let batch = db.batch();

  return db
    .collection("reactions")
    .where("user", "==", email)
    .where("room", "==", roomId)
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        batch.delete(doc.ref);
      });
    })
    .then(() => {
      batch.commit();
    });
}
function setup(email, roomId, signalList) {
  let i = 0;
  signalList.signals = [];

  // setup listeners on reaction list
  db
    .collection("reactions")
    .where("room", "==", roomId)
    .orderBy("timestamp", "desc")
    .onSnapshot(function(querySnapshot) {
      querySnapshot.docChanges.forEach(function(change) {
        let doc = change.doc;
        let d = change.doc.data();
        if (change.type === "added") {
          signalList.signals.push(
            new UserSignal(doc.id, d.type, d.room, d.photoUrl, d.email)
          );
        }
        if (change.type === "removed") {
          var remove = signalList.signals.filter(r => {
            return r.id === doc.id;
          });
          remove.forEach(r => {
            signalList.signals.remove(r);
          });
        }
      });
    });
}

function signOut() {
  var element = document.getElementById("meeting-app");
  console.log("sign out and remove react from page");
  localStorage.removeItem("currentMeetUser");
  ReactDOM.unmountComponentAtNode(element);
  element.remove();
}

function createContainer(id) {
  var div = document.createElement("div");
  div.id = id;
  div.style.zIndex = "9999999";
  return div;
}

function generateRandomId() {
  return Math.random()
    .toString(36)
    .substring(4);
}

function render(rooms) {
  ReactDOM.render(
    <MobileAppContainer rooms={rooms} />,
    document.getElementById(id)
  );
}

function getCalendarEvents(accessToken, calendarId) {
  const timeMin = moment()
    .startOf("day")
    .toISOString();
  const timeMax = moment()
    .endOf("day")
    .toISOString();

  return fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${timeMin}&timeMax=${timeMax}`,
    {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${accessToken}`
      })
    }
  )
    .then(res => res.json())
    .catch(error => console.error("Error:", error))
    .then(response =>
      response.items.filter(event => event.conferenceData).map(event => {
        return { name: event.summary, id: event.conferenceData.conferenceId };
      })
    );
}

window.signOut = signOut;

var id = "meeting-app";

var container = createContainer(id);

var signalList = new SignalList();
var buttonList = new SignalButtonList();

signalList.signals = [];

buttonList.buttons.push(new SignalButton("1", "pan_tool", false));
buttonList.buttons.push(new SignalButton("2", "thumb_up", false));
buttonList.buttons.push(new SignalButton("3", "thumb_down", false));
buttonList.buttons.push(new SignalButton("4", "access_time", false));

let host = window.location.host;
let room =
  host === "meet.google.com"
    ? window.location.pathname.substring(1)
    : host === "hangouts.google.com"
      ? window.location.pathname.split("/").reverse()[0]
      : "general";

var provider = new firebase.auth.GoogleAuthProvider();

provider.addScope("email");
provider.addScope("https://www.googleapis.com/auth/calendar.readonly");

firebase
  .auth()
  .getRedirectResult()
  .then(function(result) {
    if (result && result.credential) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;

      var user = new User();
      user.email = result.user.email;
      user.photoUrl = result.user.photoURL;
      user.accessToken = result.credential.accessToken;

      localStorage.setItem("currentMeetUser", JSON.stringify(user));

      getCalendarEvents(user.accessToken, user.email).then(rooms =>
        render(rooms)
      );
    }
  })
  .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // [START_EXCLUDE]
    if (errorCode === "auth/account-exists-with-different-credential") {
      alert(
        "You have already signed up with a different auth provider for that email."
      );
      // If you are using multiple auth providers on your app you should handle linking
      // the user's accounts here.
    } else {
      console.error(error);
    }
    // [END_EXCLUDE]
  });

firebase.auth().onAuthStateChanged(function(userData) {
  if (userData) {
    // User is signed in.
  } else {
    // User is signed out.
  }
});

function toggleSignIn() {
  if (!firebase.auth().currentUser) {
    // [START createprovider]
    var provider = new firebase.auth.GoogleAuthProvider();
    // [END createprovider]
    // [START addscopes]

    provider.addScope("email");
    provider.addScope("https://www.googleapis.com/auth/calendar.readonly");
    // [END addscopes]
    // [START signin]
    firebase.auth().signInWithRedirect(provider);
    // [END signin]
  } else {
    // [START signout]
    firebase.auth().signOut();
    // [END signout]
  }
  // [END_EXCLUDE]
}

window.toggleSignIn = toggleSignIn;

// firebase
//   .auth()
//   .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
//   .then(() => {
//     firebase
//       .auth()
//       .signInWithRedirect(provider);
//   firebase.auth().getRedirectResult()
//       .then(function(result) {
//         var user = new User();
//         user.email = result.user.email;
//         user.photoUrl = result.user.photoURL;
//         user.accessToken = result.credential.accessToken;

//         localStorage.setItem("currentMeetUser", JSON.stringify(user));

//         getCalendarEvents(user.accessToken, user.email).then(rooms =>
//           render(rooms)
//         );
//       })
//       .catch(function(error) {
//         // Handle Errors here.
//         console.log(error);
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // The email of the user's account used.
//         var email = error.email;
//         // The firebase.auth.AuthCredential type that was used.
//         var credential = error.credential;
//         // ...
//       });
//   });
