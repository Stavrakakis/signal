import React, { Component } from "react";
import Room from "../Room.js";
import { observer } from "mobx-react";
import RoomItem from "../RoomItem/RoomItem.jsx";

@observer
class RoomList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {rooms, onRoomClick} = this.props;

    return (
      <div>
        {rooms.map(room => (
          <RoomItem
            key={room.id}
            room={room}
            onRoomClick={onRoomClick}
          />
        ))}
      </div>
    );
  }
}

export default RoomList;
