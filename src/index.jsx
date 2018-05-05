import * as firebase from "firebase";
import "@firebase/firestore";

// Render the top-level React component
import React from "react";
import ReactDOM from "react-dom";
import AppContainer from "./components/AppContainer/AppContainer.jsx";
import SignalList from "./SignalList.js";
import SignalButtonList from "./SignalButtonList.js";
import SignalButton from "./SignalButton";
import UserSignal from "./UserSignal.js";
import User from "./User";

var config = {
  apiKey: "AIzaSyBVYw8O4NuxMRz63Jr9jmPyie3JF-x5x6M",
  authDomain: "meet-f3f8c.firebaseapp.com",
  databaseURL: "https://meet-f3f8c.firebaseio.com",
  projectId: "meet-f3f8c",
  storageBucket: "",
  messagingSenderId: "465362118588"
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

var saleIdDiv = document.createElement("div");
saleIdDiv.id = "meeting-plugin";
saleIdDiv.style.fontFamily = "'Open Sans', Sans-serif";
saleIdDiv.style.fontSize = "18px";
saleIdDiv.style.zIndex = "1000";

// debugger;
document.body.append(saleIdDiv);

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

if (localStorage.getItem("currentMeetUser")) {
  let u = JSON.parse(localStorage.currentMeetUser);
  let email = u.email;
  let photoUrl = u.photoUrl;
  deleteUserSignals(email, room).then(() => {
    ReactDOM.render(
      <AppContainer
        room={room}
        user={u}
        buttons={buttonList.buttons}
        signalList={signalList}
      />,
      document.getElementById("meeting-plugin")
    );

    setup(email, room, signalList);
  });
} else {
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function(result) {
          var user = new User();
          user.email = result.user.email;
          user.photoUrl = result.user.photoURL;

          localStorage.setItem("currentMeetUser", JSON.stringify(user));

          deleteUserSignals(user.email, room).then(() => {
            ReactDOM.render(
              <AppContainer
                room={room}
                user={user}
                buttons={buttonList.buttons}
                signalList={signalList}
              />,
              document.getElementById("meeting-plugin")
            );

            setup(user.email, room, signalList);
          });
        })
        .catch(function(error) {
          // Handle Errors here.
          console.log(error);
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    });
}
