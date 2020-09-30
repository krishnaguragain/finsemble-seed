import React from "react";
import {
  SymphonySimpleShareDispatcher,
  SymphonySimpleShareActions,
} from "../stores/SymphonySimpleShareStore";
import SymphonyShareMsgText from "./SymphonyShareMsgText";
import SymphonyChatList from "./SymphonyChatList";

export default class SymphonySimpleShareComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidList: [],
      sendBtnDisabled: true,
    };
    this.onSelectedSidListChange = this.onSelectedSidListChange.bind(this);
    this.sendBtnOnClick = this.sendBtnOnClick.bind(this);
  }

  componentDidMount() {
    let _this = this;
    SymphonySimpleShareStore.on("change", () => {
      _this.forceUpdate();
      this.setState({
        sendBtnDisabled: false,
      });
    });

    window.addEventListener("blur", this.cancelBtnOnClick);
  }

  componentDidUpdate(prevProps, prevState) {}

  sendBtnOnClick() {
    let sidList = this.state.sidList;
    let sids = [];
    sidList.forEach((sid, key, arr) => {
      sids.push(sid);
    });
    SymphonySimpleShareDispatcher.dispatch({
      type: SymphonySimpleShareActions.SEND,
      sids: sids,
    });
  }

  cancelBtnOnClick() {
    finsembleWindow.hide();
  }

  onSelectedSidListChange(sidList) {
    this.setState({
      sidList: sidList,
    });
  }

  render() {
    return (
      <div>
        <SymphonyShareMsgText shareMsg={SymphonySimpleShareStore.shareMsg} />
        <SymphonyChatList
          chatList={SymphonySimpleShareStore.streamList}
          onSidListChange={this.onSelectedSidListChange}
        />
        <button
          type="button"
          id="sendBtn"
          onClick={this.sendBtnOnClick}
          disabled={this.state.sendBtnDisabled}
        >
          Share
        </button>
        <button type="button" id="cancelBtn" onClick={this.cancelBtnOnClick}>
          Cancel
        </button>
      </div>
    );
  }
}
