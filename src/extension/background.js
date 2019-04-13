import * as firebase from "firebase";
import "@firebase/firestore";
import User from "../User";
import SignalService from "../SignalService";
import SignalButtonList from "../SignalButtonList.js";

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

let buttonList = new SignalButtonList();
let service = new SignalService(db, onNewSignal, onSignalRemoved);
buttonList.buttons = service.getSignalButtons();

function onNewSignal(signal) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "signalCreated", signal: signal },
      function(response) {}
    );
  });
}

function onSignalRemoved(signalId) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "signalRemoved", signalId: signalId },
      function(response) {}
    );
  });
}

function getUser() {
  if (localStorage.getItem("currentMeetUser")) {
    let user = JSON.parse(localStorage.currentMeetUser);
    return new Promise((resolve, reject) => resolve(user));
  } else {
    return new Promise(function(resolve, reject) {
      return getUserFromGoogle().then(function(result) {
        var user = new User();
        user.email = result.email;
        user.photoUrl = result.photoUrl;
        localStorage.setItem("currentMeetUser", JSON.stringify(user));
        resolve(user);
      });
    });
  }
}

function getUserFromGoogle() {
  return signInWithGoogle().then(function(result) {
    return { email: result.user.email, photoUrl: result.user.photoURL };
  });
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

function newSignal(signal) {
  var dbSignal = {
    ...signal,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  return db
    .collection("reactions")
    .add(dbSignal)
    .then(snap => {
      return { ...signal, reactionId: snap.id };
    })
    .catch(() => {
      console.log("error");
    });
}

function removeSignal(signalId) {
  return db
    .collection("reactions")
    .doc(signalId)
    .delete();
}

chrome.runtime.onMessage.addListener(function(message, sender, reply) {
  if (message.type == "initialize") {
    getUser().then(user => {
      let model = { user: user, signalButtons: service.getSignalButtons() };
      service.deleteUserSignals(user.email, message.roomId);
      service.setup(message.roomId);
      reply(model);
    });
  }
  if (message.type == "signout") {
    localStorage.removeItem("currentMeetUser");
  }
  if (message.type == "newsignal") {
    let signal = message.signal;
    newSignal(signal).then(function(createdSignal) {
      reply(createdSignal);
    });
  }

  if (message.type == "removeSignal") {
    let signalId = message.signalId;
    removeSignal(signalId).then(function() {
      reply();
    });
  }

  return true;
});
