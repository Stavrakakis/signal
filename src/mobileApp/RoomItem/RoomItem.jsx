import React, { Component } from "react";
import Room from "../Room.js";

class RoomItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { room, onRoomClick } = this.props;

    return (
      <div key={room.id} onClick={onRoomClick.bind(this, room)}>
        {room.name}
      </div>
    );
  }
}

export default RoomItem;