import styles from "./reactionButton.css";
import classNames from "classnames/bind";
import React, { Component } from "react";

import * as firebase from "firebase";

class ReactionButton extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = e => {
    var db = firebase.firestore();

    var doc = db.collection("reactions").add({
      room: this.props.room,
      type: this.props.type,
      active: !this.props.active && true,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  };

  render() {
    let cx = classNames.bind(styles);

    let className = cx({
      reactionButton: true,
      active: this.props.active
    });

    return (
      <div onClick={this.handleClick} className={className}>
        <span className="material-icons">{this.props.type}</span>
      </div>
    );
  }
}

export default ReactionButton;
