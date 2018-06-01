import React, { Component } from "react";
import styles from "./loadingIcon.css";

class LoadingIcon extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.spinnerContainer}>
        <svg
          className={styles.spinner}
          width="65px"
          height="65px"
          viewBox="0 0 66 66"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className={styles.path}
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            cx="33"
            cy="33"
            r="30"
          />
        </svg>
      </div>
    );
  }
}

export default LoadingIcon;
