import { observable } from "mobx";

class User {
  @observable email;
  @observable photoUrl;
  @observable signedIn;
}

export default User;
