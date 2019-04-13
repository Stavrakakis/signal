import React, { Component } from "react";
import Signal from "../Signal/Signal.jsx";
import ProfileIcon from "../ProfileIcon/ProfileIcon.jsx";
import SignalButton from "../SignalButton/SignalButton.jsx";

import { observer } from "mobx-react";

@observer
class AppContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ position: "fixed", top: 0, left: 0 }}>
        <ProfileIcon user={this.props.user} onSignOut={this.props.onSignOut} />
        {this.props.buttons.map(button => (
          <SignalButton
            key={button.type}
            user={this.props.user}
            room={this.props.room}
            onNewSignal={this.props.onNewSignal}
            onRemoveSignal={this.props.onRemoveSignal}
            button={button}
          />
        ))}

        <div style={{ position: "fixed", left: "16px", bottom: 88 }}>
          {this.props.signalList.signals.map(signal => (
            <Signal key={signal.id} signal={signal} />
          ))}
        </div>
      </div>
    );
  }
}

export default AppContainer;
