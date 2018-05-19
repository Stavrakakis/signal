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
  messagingSenderId: "465362118588"
};

firebase.initializeApp(config);

function render(rooms) {
  ReactDOM.render(
    <MobileAppContainer rooms={rooms} />,
    document.getElementById("meeting-app")
  );
}

function getCalendarEvents(accessToken, calendarId) {
  const timeMin = moment()
    .startOf("day")
    .toISOString();
  const timeMax = moment()
    .endOf("month")
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
        return { name: event.summary, id: event.conferenceData.conferenceId };
      });
    });
}

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

      getCalendarEvents(user.accessToken, user.email).then(events =>
        console.log(events)
      );

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
