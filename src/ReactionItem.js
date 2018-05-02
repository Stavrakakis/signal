import { observable } from "mobx";

class ReactionItem {
  id = "";
  @observable name = "";
  @observable room = "";
  @observable type = "";
  @observable active = false;

  constructor(id, type, room, active) {
    this.id = id;
    this.room = room;
    this.type = type;
    this.active = active;
  }
}

export default ReactionItem;
