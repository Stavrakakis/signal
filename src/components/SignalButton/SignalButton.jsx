import styles from "./signalButton.css";
import classNames from "classnames/bind";
import React, { Component } from "react";

import { observer } from "mobx-react";

import animations from "animate.css";

@observer
class SignalButton extends Component {
  constructor(props) {
    super(props);
  }
  handleSignal = e => {
    let button = this.props.button;
    if (button.active && !button.disabled) {
      button.disabled = true;
      button.active = false;

      this.props.onRemoveSignal(button.reactionId);
    } else if (!button.disabled) {
      button.disabled = true;
      button.active = true;
      this.props.onNewSignal({
        room: this.props.room,
        type: button.type,
        user: this.props.user.email,
        photoUrl: this.props.user.photoUrl
      });
    }
  };
  
  render() {
    let cx = classNames.bind(styles);

    let className = cx({
      signalButton: true,
      active: this.props.button.active
    });

    return (
      <div
        onClick={this.handleSignal}
        className={
          className + ` ${animations.slideInLeft} ${animations.animated}`
        }
      >
        <div className={styles.hoverPanel} />
        <span className="material-icons">{this.props.button.type}</span>
      </div>
    );
  }
}

export default SignalButton;
