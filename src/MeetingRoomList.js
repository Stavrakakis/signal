import { observable } from "mobx";

class MeetingRoomList {
  @observable rooms = [];
  @observable selectedRoom = null;
}

export default MeetingRoomList;
