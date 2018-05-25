import * as firebase from "firebase";
import "@firebase/firestore";
// Render the top-level React component
import React from "react";
import ReactDOM from "react-dom";
import AppContainer from "./components/AppContainer/AppContainer.jsx";
import SignalList from "./SignalList.js";
import SignalButtonList from "./SignalButtonList.js";
import SignalButton from "./SignalButton";
import SignalService from "./SignalService";
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
  
  let service = new SignalService(db);
  buttonList.buttons = service.getSignalButtons();

  getUser()
    .then(u => {
      user = u;
      service.deleteUserSignals(user.email, room);
    })
    .then(() => {
      render(room, user, buttonList, signalList, container);
      service.setup(user.email, room, signalList);
    });
})();
