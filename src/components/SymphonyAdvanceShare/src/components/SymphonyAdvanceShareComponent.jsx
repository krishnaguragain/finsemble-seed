import React from "react";
import {
  SymphonyAdvanceShareDispatcher,
  SymphonyAdvanceShareActions,
} from "../stores/SymphonyAdvanceShareStore";
import SymphonyShareMsgText from "./SymphonyShareMsgText";
import SymphonyChatList from "./SymphonyChatList";
import SymphonyNewChatroom from "./SymphonyNewChatroom";
import SymphonyNewDirectChat from "./SymphonyNewDirectChat";

export default class SymphonyAdvanceShareComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidList: [],
      sendBtnDisabled: true,
      newDirectChatModalVisible: "block",
      newChatroomModalVisible: "none",
    };
    this.onSelectedSidListChange = this.onSelectedSidListChange.bind(this);
    this.sendBtnOnClick = this.sendBtnOnClick.bind(this);
    this.newDirectChatOnClick = this.newDirectChatOnClick.bind(this);
    this.newChatRoomOnClick = this.newChatRoomOnClick.bind(this);
    this.closeDirectChatOnClick = this.closeDirectChatOnClick.bind(this);
    this.closeChatRoomOnClick = this.closeChatRoomOnClick.bind(this);
  }

  componentDidMount() {
    let _this = this;
    SymphonyAdvanceShareStore.on("change", () => {
      _this.forceUpdate();
      this.setState({
        sendBtnDisabled: false,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {}

  newDirectChatOnClick() {
    this.setState({
      newDirectChatModalVisible: "block",
    });
  }

  closeDirectChatOnClick() {
    this.setState({
      newDirectChatModalVisible: "none",
    });
  }

  newChatRoomOnClick() {
    this.setState({
      newChatroomModalVisible: "block",
    });
  }

  closeChatRoomOnClick() {
    this.setState({
      newChatroomModalVisible: "none",
    });
  }

  sendBtnOnClick() {
    let sidList = this.state.sidList;
    let sids = [];
    sidList.forEach((sid, key, arr) => {
      sids.push(sid);
    });
    SymphonyAdvanceShareDispatcher.dispatch({
      type: SymphonyAdvanceShareActions.SEND,
      sids: sids,
    });
  }

  cancelBtnOnClick() {
    FSBL.Clients.WindowClient.close();
  }

  onSelectedSidListChange(sidList) {
    this.setState({
      sidList: sidList,
    });
  }

  render() {
    return (
      <div>
        <SymphonyShareMsgText shareMsg={SymphonyAdvanceShareStore.shareMsg} />
        <div className="dropdown">
          <button className="dropbtn">+</button>
          <div className="dropdown-content">
            <a id="newDirectChatLink" onClick={this.newDirectChatOnClick}>
              New direct chat
            </a>
            <a id="newChatRoomLink" onClick={this.newChatRoomOnClick}>
              New chat room
            </a>
          </div>
        </div>
        <SymphonyChatList
          chatList={SymphonyAdvanceShareStore.streamList}
          onSidListChange={this.onSelectedSidListChange}
        />
        <button
          type="button"
          id="sendBtn"
          onClick={this.sendBtnOnClick}
          disabled={this.state.sendBtnDisabled}
        >
          Send
        </button>
        <button type="button" id="cancelBtn" onClick={this.cancelBtnOnClick}>
          Cancel
        </button>

        <SymphonyNewDirectChat
          modalVisible={this.state.newDirectChatModalVisible}
          close={this.closeDirectChatOnClick}
        ></SymphonyNewDirectChat>
        <SymphonyNewChatroom
          modalVisible={this.state.newChatroomModalVisible}
          close={this.closeChatRoomOnClick}
        ></SymphonyNewChatroom>
      </div>
    );
  }
}
