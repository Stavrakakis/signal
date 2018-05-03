import { observable } from "mobx";

class ReactionList {
  @observable reactions = [];
  @observable buttons = [];
}

export default ReactionList;
