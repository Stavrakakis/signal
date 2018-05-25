import { observable } from "mobx";

class MeetingRoom {
  @observable id = "";
  @observable name = "";

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

export default MeetingRoom;
