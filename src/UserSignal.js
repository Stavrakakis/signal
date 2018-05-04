import { observable } from "mobx";

class UserSignal {
  id = "";
  @observable name = "";
  @observable room = "";
  @observable type = "";
  @observable photoUrl = "";
  @observable email = "";

  constructor(id, type, room, photoUrl, email) {
    this.id = id;
    this.room = room;
    this.type = type;
    this.email = email;
    this.photoUrl = photoUrl;
  }
}

export default UserSignal;
