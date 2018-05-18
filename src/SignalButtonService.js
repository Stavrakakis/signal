import SignalButton from "./SignalButton";

class SignalButtonService {
  getSignalButtons() {
    return [
      new SignalButton("1", "pan_tool", false),
      new SignalButton("2", "thumb_up", false),
      new SignalButton("3", "thumb_down", false),
      new SignalButton("4", "access_time", false)
    ];
  }
}

export default SignalButtonService;
