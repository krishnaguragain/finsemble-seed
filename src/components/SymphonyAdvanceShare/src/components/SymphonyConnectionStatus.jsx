import React from "react";

export default class SymphonyConnectionStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestVisible: "none",
      pendingIncomingVisible: "none",
      pendingOutingVisible: "none",
      statement: "",
    };
    this.gotItBtnOnClick = this.gotItBtnOnClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.connectionState) {
      switch (nextProps.connectionState) {
        case "NOT_CONNECTED":
          this.setState({
            requestVisible: "block",
            pendingIncomingVisible: "none",
            pendingOutingVisible: "none",
            statement:
              "You aren't connected to " +
              nextProps.connectionUser.displayName +
              ". Send a connection request?",
          });
          break;
        case "PENDING_INCOMING":
          this.setState({
            requestVisible: "none",
            pendingIncomingVisible: "block",
            pendingOutingVisible: "none",
            statement:
              "Waiting for your approval to accept " +
              nextProps.connectionUser.displayName +
              " connection request.",
          });
          break;
        case "PENDING_OUTGOING":
          this.setState({
            requestVisible: "none",
            pendingIncomingVisible: "none",
            pendingOutingVisible: "block",
            statement:
              "Waiting for " +
              nextProps.connectionUser.displayName +
              " to accept your connection request.",
          });
          break;
        default:
          this.setState({
            requestVisible: "none",
            pendingIncomingVisible: "none",
            pendingOutingVisible: "none",
            statement: "",
          });
          break;
      }
    } else {
      this.setState({
        requestVisible: "none",
        pendingIncomingVisible: "none",
        pendingOutingVisible: "none",
        statement: "",
      });
    }

    if (nextProps.connectionState == "NOT_CONNECTED") {
    } else {
    }
  }
  gotItBtnOnClick() {
    this.setState({
      requestVisible: "none",
      pendingIncomingVisible: "none",
      pendingOutingVisible: "none",
      statement: "",
    });
  }

  render() {
    return (
      <div id="symphonyConnectionStatus">
        <div
          className="symphonyConnectionStatus"
          style={{ display: this.state.requestVisible }}
        >
          {this.state.statement}
          <br/>
          <button onClick={this.gotItBtnOnClick}>Send</button>
          <button onClick={this.gotItBtnOnClick}>Cancel</button>
        </div>
        <div
          className="symphonyConnectionStatus"
          style={{ display: this.state.pendingIncomingVisible }}
        >
          {this.state.statement}
          <button onClick={this.gotItBtnOnClick}>Got It</button>
        </div>
        <div
          className="symphonyConnectionStatus"
          style={{ display: this.state.pendingOutingVisible }}
        >
          {this.state.statement}
          <button onClick={this.gotItBtnOnClick}>Got It</button>
        </div>
      </div>
    );
  }
}
