import { observable } from "mobx";

class SignalButton {
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

export default SignalButton;
