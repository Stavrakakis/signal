import styles from "./reaction.css";
import classNames from "classnames";
import React, { Component } from "react";
import { observer } from "mobx-react";

const Reaction = observer(({ reaction }) => (
  <div className={[styles.reaction].join(" ")}>
    <span className={styles.signal}>{reaction.type}</span>
    <img className={styles.photo} src={reaction.photoUrl} />
  </div>
));

export default Reaction;
