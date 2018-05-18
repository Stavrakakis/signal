import { observable } from "mobx";

class Room {
  @observable id = "";
  @observable name = "";

  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

export default Room;
