import SignalButton from "./SignalButton";
import UserSignal from "./UserSignal";

class SignalService {
  constructor(db) {
    this.db = db;
  }

  getSignalButtons() {
    return [
      new SignalButton("1", "pan_tool", false),
      new SignalButton("2", "thumb_up", false),
      new SignalButton("3", "thumb_down", false),
      new SignalButton("4", "access_time", false)
    ];
  }

  deleteUserSignals(email, roomId) {
    let batch = this.db.batch();

    return this.db
      .collection("reactions")
      .where("user", "==", email)
      .where("room", "==", roomId)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          batch.delete(doc.ref);
        });
      })
      .then(() => {
        batch.commit();
      });
  }

  setup(email, roomId, signalList) {
    let i = 0;
    signalList.signals = [];

    // setup listeners on reaction list
    this.db
      .collection("reactions")
      .where("room", "==", roomId)
      .orderBy("timestamp", "desc")
      .onSnapshot(function(querySnapshot) {
        querySnapshot.docChanges.forEach(function(change) {
          let doc = change.doc;
          let d = change.doc.data();
          if (change.type === "added") {
            signalList.signals.push(
              new UserSignal(doc.id, d.type, d.room, d.photoUrl, d.email)
            );
          }
          if (change.type === "removed") {
            var remove = signalList.signals.filter(r => {
              return r.id === doc.id;
            });
            remove.forEach(r => {
              signalList.signals.remove(r);
            });
          }
        });
      });
  }
}

export default SignalService;
