import styles from "./reaction.css";
import classNames from "classnames";
import React, { Component } from "react";
import { observer } from "mobx-react";
import animations from "animate.css";

const Reaction = observer(({ reaction }) => (
  <div className={[styles.reaction, animations.slideInLeft, animations.animated].join(" ")}>
    <span className={styles.signal}>{reaction.type}</span>
    <img className={styles.photo} src={reaction.photoUrl} />
  </div>
));

export default Reaction;
