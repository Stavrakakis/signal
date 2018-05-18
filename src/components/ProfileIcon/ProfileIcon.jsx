import styles from "./profileIcon.css";
import classNames from "classnames";
import React, { Component } from "react";
import animations from "animate.css";

const ProfileIcon = ({ user, onSignOut }) => (
  <div className={styles.profileIcon}>
    <img className={styles.photo} src={user.photoUrl} />
    <div className={styles.userPanel}>
      <span className="material-icons" onClick={onSignOut}>power_settings_new</span>
    </div>
  </div>
);

export default ProfileIcon;
