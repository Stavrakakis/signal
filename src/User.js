import { observable } from "mobx";

class User {
  @observable email;
  @observable photoUrl;
}

export default User;
