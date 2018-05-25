import styles from "./mobileAppContainer.css";
import classNames from "classnames";
import React, { Component } from "react";
import Signal from "../../components/Signal/Signal.jsx";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon.jsx";
import SignalButton from "../../components/SignalButton/SignalButton.jsx";

import AppContainer from "../../components/AppContainer/AppContainer.jsx";

import RoomList from "../RoomList/RoomList.jsx";
import Room from "../Room.js";
import * as firebase from "firebase";

import { observer } from "mobx-react";

@observer
class MobileAppContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      roomModel,
      onRoomSelection,
      signalList,
      buttonList,
      user,
      signOut
    } = this.props;

    const roomSelected = !!roomModel.selectedRoom;
    const loading = roomModel.rooms.length == 0;

    return (
      <div>
        {loading ? <div>Loading...</div> : ""}
        {!roomSelected ? (
          <RoomList rooms={roomModel.rooms} onRoomClick={onRoomSelection} />
        ) : (
          <AppContainer
            room={roomModel.selectedRoom.id}
            user={user}
            onSignOut={signOut}
            buttons={buttonList.buttons}
            signalList={signalList}
          />
        )}
      </div>
    );
  }
}

export default MobileAppContainer;
