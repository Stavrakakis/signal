import React, { Component } from "react";
import Room from "../Room.js";
import { observer } from "mobx-react";

@observer
class RoomList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
          {this.props.rooms.map(room => (
          <div>{room.name} - {room.id}</div>
        ))}
      </div>
    );
  }
}

export default RoomList;
