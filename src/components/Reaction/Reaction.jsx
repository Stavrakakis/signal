import styles from "./reaction.css";
import classNames from "classnames";
import React, { Component } from "react";
import { observer } from "mobx-react";

const Reaction = observer(({reaction}) => 
    <div className={[styles.fadeOut, styles.reaction].join(' ')}>{reaction.type}</div>
);

export default Reaction;
