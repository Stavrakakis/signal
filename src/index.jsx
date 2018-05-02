import * as firebase from "firebase";
import "@firebase/firestore";

// Render the top-level React component
import React from "react";
import ReactDOM from "react-dom";
import AppContainer from "./components/AppContainer/AppContainer.jsx";
import ReactionList from "./ReactionList.js";
import ReactionItem from "./ReactionItem.js";

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

function setup(roomId, reactionList) {
  const roomName = window.location.pathname.substring(1);

  let i = 0;

  // setup listeners on reaction list
  db
    .collection("reactions")
    .where("room", "==", roomId)
    .orderBy("timestamp", "desc")
    .limit(20)
    .onSnapshot(function(querySnapshot) {
      if (i == 0) {
        i++;
        return;
      }

      querySnapshot.docChanges.forEach(function(change) {
        if (change.type === "added") {
          let d = change.doc.data();
          reactionList.reactions.push(
            new ReactionItem(change.doc.id, d.type, d.room, d.active)
          );
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

var reactionList = new ReactionList();
reactionList.reactions = [];

ReactDOM.render(
  <AppContainer reactions={reactionList} />,
  document.getElementById("meeting-plugin")
);

setup("yde-zkhm-yza", reactionList);
