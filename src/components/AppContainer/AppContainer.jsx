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
    return (
      <div style={{ position: "fixed" }}>
        {this.props.reactions.buttons.map(button => (
          <ReactionButton
            key={button.type}
            user={this.props.user}
            room={this.props.room}
            button={button}
          />
        ))}

        <div style={{ position: "fixed", left: "16px", bottom: 88 }}>
          {this.props.reactions.reactions.map(reaction => (
            <Reaction key={reaction.id} reaction={reaction} />
          ))}
        </div>
      </div>
    );
  }
}

export default AppContainer;
