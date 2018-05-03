import styles from "./reactionButton.css";
import classNames from "classnames/bind";
import React, { Component } from "react";

import * as firebase from "firebase";
import { observer } from "mobx-react";

@observer
class ReactionButton extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = e => {
    var db = firebase.firestore();
    let button = this.props.button;

    if (button.active && !button.disabled) {
      button.disabled = true;
      button.active = false;

      var doc = db
        .collection("reactions")
        .doc(button.reactionId)
        .delete()
        .then(() => {
          button.active = false;
          button.disabled = false;
        })
        .catch(() => {
          button.active = true;
          button.disabled = false;
        });
    } else if (!button.disabled) {
      button.disabled = true;
      button.active = true;

      var doc = db
        .collection("reactions")
        .add({
          room: this.props.room,
          type: button.type,
          user: this.props.user.email,
          photoUrl: this.props.user.photoUrl,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(snap => {
          button.active = true;
          button.disabled = false;
          button.reactionId = snap.id;
        })
        .catch(() => {
          button.active = false;
          button.disabled = false;
        });
    }
  };

  render() {
    let cx = classNames.bind(styles);

    let className = cx({
      reactionButton: true,
      active: this.props.button.active
    });

    return (
      <div onClick={this.handleClick} className={className}>
        <div className={styles.hoverPanel}></div>
        <span className="material-icons">{this.props.button.type}</span>
      </div>
    );
  }
}

export default ReactionButton;
