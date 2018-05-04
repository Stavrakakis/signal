import styles from "./signal.css";
import classNames from "classnames";
import React, { Component } from "react";
import { observer } from "mobx-react";
import animations from "animate.css";

const Signal = observer(({ signal }) => (
  <div className={[styles.signal, animations.slideInLeft, animations.animated].join(" ")}>
    <span className={styles.signalIcon}>{signal.type}</span>
    <img className={styles.photo} src={signal.photoUrl} />
  </div>
));

export default Signal;
