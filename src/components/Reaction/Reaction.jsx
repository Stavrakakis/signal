import styles from "./reaction.css";
import classNames from "classnames";
import React, { Component } from "react";
import { observer } from "mobx-react";

const Reaction = observer(({ reaction }) => (
  <div className={[styles.reaction].join(" ")}>
    <img className={styles.photo} src={reaction.photoUrl} />
    <span className={styles.signal}>{reaction.type}</span>
  </div>
));

export default Reaction;
