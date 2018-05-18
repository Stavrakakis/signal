import { observable } from "mobx";

class User {
  @observable email;
  @observable photoUrl;
  @observable signedIn;
  @observable accessToken;
}

export default User;
