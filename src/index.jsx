import * as firebase from "firebase";
import "@firebase/firestore";

// Render the top-level React component
import React from "react";
import ReactDOM from "react-dom";
import AppContainer from "./components/AppContainer/AppContainer.jsx";
import ReactionList from "./ReactionList.js";
import ReactionItem from "./ReactionItem.js";
import ReactionButton from "./ReactionButton";
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
function setup(email, roomId, reactionList) {
  let i = 0;
  reactionList.reactions = [];

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
          reactionList.reactions.push(
            new ReactionItem(doc.id, d.type, d.room, d.photoUrl, d.email)
          );
        }
        if (change.type === "removed") {
          var remove = reactionList.reactions.filter((r) => {
            return r.id === doc.id;
          });
          remove.forEach((r) => {
            reactionList.reactions.remove(r);
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

var reactionList = new ReactionList();
reactionList.reactions = [];
reactionList.buttons.push(new ReactionButton("1", "pan_tool", false));
reactionList.buttons.push(new ReactionButton("2", "thumb_up", false));
reactionList.buttons.push(new ReactionButton("3", "thumb_down", false));
reactionList.buttons.push(new ReactionButton("4", "access_time", false));

var provider = new firebase.auth.GoogleAuthProvider();

provider.addScope("email");

let host = window.location.host;
let room =
  host === "meet.google.com"
    ? window.location.pathname.substring(1)
    : host === "hangouts.google.com"
      ? window.location.pathname.split("/").reverse()[0]
      : "general";

firebase
  .auth()
  .signInWithPopup(provider)
  .then(function(result) {
    var user = new User();

    user.email = result.user.email;
    user.photoUrl = result.user.photoURL;

    deleteUserSignals(user.email, room).then(() => {
      ReactDOM.render(
        <AppContainer room={room} user={user} reactions={reactionList} />,
        document.getElementById("meeting-plugin")
      );

      setup(user.email, room, reactionList);
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
