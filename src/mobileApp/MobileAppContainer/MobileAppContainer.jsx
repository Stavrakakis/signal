import styles from "./mobileAppContainer.css";
import classNames from "classnames";
import React, { Component } from "react";
import Signal from "../../components/Signal/Signal.jsx";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon.jsx";
import SignalButton from "../../components/SignalButton/SignalButton.jsx";

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
    return (
      <div style={{ position: "fixed", top: 0, left: 0 }}>
        <RoomList rooms={this.props.rooms} />
      </div>
    );
  }
}

export default MobileAppContainer;
