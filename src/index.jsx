import * as firebase from "firebase";
import "@firebase/firestore";
// Render the top-level React component
import React from "react";
import ReactDOM from "react-dom";
import AppContainer from "./components/AppContainer/AppContainer.jsx";
import SignalList from "./SignalList.js";
import SignalButtonList from "./SignalButtonList.js";
import SignalButton from "./SignalButton";
import SignalButtonService from "./SignalButtonService";
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
  var element = document.getElementById("meeting-plugin");
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

function render(room, user, buttonList, signalList, container) {
  document.body.append(container);
  ReactDOM.render(
    <AppContainer
      room={room}
      user={user}
      onSignOut={signOut}
      buttons={buttonList.buttons}
      signalList={signalList}
    />,
    container
  );
}
function signInWithGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("email");

  return firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
      return firebase.auth().signInWithPopup(provider);
    });
}

function getUser() {
  if (localStorage.getItem("currentMeetUser")) {
    let user = JSON.parse(localStorage.currentMeetUser);
    return new Promise((resolve, reject) => resolve(user));
  } else {
    return signInWithGoogle().then(function(result) {
      var user = new User();
      user.email = result.user.email;
      user.photoUrl = result.user.photoURL;
      localStorage.setItem("currentMeetUser", JSON.stringify(user));
      return user;
    });
  }
}

(function() {

  let host = window.location.host;
  let room =
    host === "meet.google.com"
      ? window.location.pathname.substring(1)
      : host === "hangouts.google.com"
        ? window.location.pathname.split("/").reverse()[0]
        : "general";

  let user = null;

  const id = "meeting-plugin";
  
  let container = createContainer(id);
  
  let signalList = new SignalList();
  let buttonList = new SignalButtonList();
  
  buttonList.buttons = new SignalButtonService().getSignalButtons();

  getUser()
    .then(u => {
      user = u;
      deleteUserSignals(user.email, room);
    })
    .then(() => {
      render(room, user, buttonList, signalList, container);
      setup(user.email, room, signalList);
    });
})();
