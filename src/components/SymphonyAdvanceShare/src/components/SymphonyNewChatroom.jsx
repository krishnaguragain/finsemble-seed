import React from "react";

export default class SymphonyNewChatroom extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="createChatRoomModal" className="modal" style={{display:this.props.modalVisible}}>
        <div className="modal-content">
          <span className="close" id="closeCreateChatRoomModalSpan" onClick={this.props.close}>
            &times;
          </span>
          <p>Create Chat Room</p>
        </div>
      </div>
    );
  }
}
