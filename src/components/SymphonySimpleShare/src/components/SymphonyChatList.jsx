import React from "react";
import { Action as SymphonySimpleShareActions } from "../stores/SymphonySimpleShareStore";

export default class SymphonyChatList extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange = (event) => {
    let selectedSids = event.target.querySelectorAll('#chatList option:checked');
    let sidList = []
    selectedSids.forEach((sidNode, key, arr)=>{
        sidList.push(sidNode.value)
    })
    this.props.onSidListChange(sidList);
  };

  render() {
    const {chatList} = this.props;
    return (
      <div>
        <label>Chats</label>
        <select id="chatList" onChange={this.handleChange} multiple>
          {
            chatList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
