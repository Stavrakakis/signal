// Render the top-level React component
import React from "react";
import ReactDOM from "react-dom";
import AppContainer from "../components/AppContainer/AppContainer.jsx";
import SignalList from "../SignalList.js";
import SignalButtonList from "../SignalButtonList.js";
import icon48 from "./icon48.png";
import icon128 from "./icon128.png";
import manifest from "./manifest.json";

function createContainer(id) {
  var div = document.createElement("div");
  div.id = id;
  div.style.zIndex = "9999999";
  return div;
}

let signalList = new SignalList();
let buttonList = new SignalButtonList();

function render(room, user, buttonList, signalList, container) {
  document.body.append(container);
  ReactDOM.render(
    <AppContainer
      room={room}
      user={user}
      onSignOut={signOut}
      buttons={buttonList.buttons}
      signalList={signalList}
      onNewSignal={onNewSignal}
      onRemoveSignal={onRemoveSignal}
    />,
    container
  );
}

function signOut() {
  var element = document.getElementById("meeting-plugin");
  console.log("sign out and remove react from page");

  ReactDOM.unmountComponentAtNode(element);
  element.remove();
  chrome.extension.sendMessage({ type: "signout" }, function() {});
}

function onNewSignal(signal) {
  chrome.extension.sendMessage({ type: "newsignal", signal: signal }, function(
    createdSignal
  ) {
    const button = buttonList.buttons.find(it => it.type == createdSignal.type);
    if (button) {
      button.active = true;
      button.disabled = false;
      button.reactionId = createdSignal.reactionId;
    }
  });
}

function onRemoveSignal(signalId) {
  chrome.extension.sendMessage(
    { type: "removeSignal", signalId: signalId },
    function() {
      const button = buttonList.buttons.find(it => it.reactionId == signalId);
      if (button) {
        button.active = false;
        button.disabled = false;
      }
    }
  );
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

  chrome.runtime.onMessage.addListener(function(message, sender, reply) {
    if (message.type == "signalCreated") {
      signalList.signals.push(message.signal);
      reply();
    }

    if (message.type == "signalDeleted") {
      signalList.signals.remove(message.signal);
      reply();
    }

    if (message.type == "signalRemoved") {
      const { signalId } = message;
      var remove = signalList.signals.filter(r => {
        return r.id === signalId;
      });
      remove.forEach(r => {
        signalList.signals.remove(r);
      });
      reply();
    }

    return true;
  });

  chrome.extension.sendMessage({ type: "initialize", roomId: room }, function(
    model
  ) {
    const { user, signalButtons } = model;

    buttonList.buttons = signalButtons;
    render(room, user, buttonList, signalList, container);
  });
})();
