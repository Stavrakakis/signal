import styles from "./appContainer.css";
import classNames from "classnames";
import React, { Component } from "react";
import Reaction from "../Reaction/Reaction.jsx";
import ReactionButton from "../ReactionButton/ReactionButton.jsx";

import * as firebase from "firebase";

import { observer } from "mobx-react";

@observer
class AppContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let panToolActive =
      this.props.reactions.reactions.filter(r => r.type === "pan_tool").length >
      0;

    return (
      <div style={{ position: "fixed" }}>
        <ReactionButton user="" room="yde-zkhm-yza" type="pan_tool" active={panToolActive}/>
        <ReactionButton user="" room="yde-zkhm-yza" type="thumb_up" />
        <ReactionButton user="" room="yde-zkhm-yza" type="schedule" />
        <div style={{ position: "fixed", left: "50vw", bottom: 88 }}>
          {this.props.reactions.reactions.map(reaction => (
            <Reaction key={reaction.id} reaction={reaction} />
          ))}
        </div>
      </div>
    );
  }
}

export default AppContainer;
