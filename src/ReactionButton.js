import { observable } from "mobx";

class ReactionButton {
  id = "";
  @observable type = "";
  @observable active = false;
  @observable reactionId;
  disabled = false;

  constructor(id, type, active) {
    this.id = id;
    this.type = type;
    this.active = active;
  }
}

export default ReactionButton;
