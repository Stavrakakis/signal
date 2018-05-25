import * as firebase from "firebase";
import "@firebase/firestore";
// Render the top-level React component
import React from "react";
import ReactDOM from "react-dom";
import MobileAppContainer from "./MobileAppContainer/MobileAppContainer.jsx";
import SignalList from "../SignalList.js";
import SignalButtonList from "../SignalButtonList.js";
import SignalButton from "../SignalButton";
import SignalService from "../SignalService.js";
import UserSignal from "../UserSignal.js";
import User from "../User";
import moment from "moment";
import MeetingRoom from "../MeetingRoom";
import MeetingRoomList from "../MeetingRoomList";

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

let roomModel = new MeetingRoomList();
roomModel.rooms = [];

let signalList = new SignalList();
let buttonList = new SignalButtonList();

let service = new SignalService(db);
buttonList.buttons = service.getSignalButtons();

let globalUser = null;

function onRoomSelection(room) {
  roomModel.selectedRoom = room;

  service
    .deleteUserSignals(globalUser.email, room.id)
    .then(() => service.setup(globalUser.email, room.id, signalList));
}

function render(user, roomList) {
  ReactDOM.render(
    <MobileAppContainer
      roomModel={roomModel}
      onRoomSelection={onRoomSelection}
      room={roomModel.selectedRoom}
      user={user}
      onSignOut={null}
      buttonList={buttonList}
      signalList={signalList}
    />,
    document.getElementById("meeting-app")
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
    .then(response => {
      return response.items.filter(event => event.conferenceData).map(event => {
        return new MeetingRoom(
          event.conferenceData.conferenceId,
          event.summary
        );
      });
    });
}

var provider = new firebase.auth.GoogleAuthProvider();

provider.addScope("email");
provider.addScope("https://www.googleapis.com/auth/calendar.readonly");

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

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

      globalUser = user;

      render(user, roomModel);

      getCalendarEvents(user.accessToken, user.email).then(events => {
        let list = removeDuplicates(events, "id");

        roomModel.rooms = list;
      });

      localStorage.setItem("currentMeetUser", JSON.stringify(user));
    } else {
      var provider = new firebase.auth.GoogleAuthProvider();

      provider.addScope("email");
      provider.addScope("https://www.googleapis.com/auth/calendar.readonly");

      firebase.auth().signInWithRedirect(provider);
    }
  });

firebase.auth().onAuthStateChanged(function(userData) {
  if (userData) {
    // User is signed in.
    console.log("signed in");
  } else {
    // User is signed out.
    console.log("signed out");
  }
});
