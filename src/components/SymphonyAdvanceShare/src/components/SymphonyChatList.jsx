import React from "react";

export default class SymphonyChatList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSid: [],
    };
  }

  handleChange = (event) => {
    let selectedSids = event.target.querySelectorAll(
      "#chatList option:checked"
    );
    let sidList = [];
    selectedSids.forEach((sidNode, key, arr) => {
      sidList.push(sidNode.value);
    });
    this.props.onSidListChange(sidList);
    this.setState({
      selectedSid: sidList,
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.selectSid != "") {
      if (prevProps.selectSid != this.props.selectSid) {
        let sidList = [];
        sidList.push(this.props.selectSid);
        this.setState({
          selectedSid: sidList,
        });
      }
    }
  }

  render() {
    const { chatList } = this.props;
    return (
      <div>
        <label className="chatLabel">Chats</label>
        <select
          id="chatList"
          onChange={this.handleChange}
          value={this.state.selectedSid}
          multiple
        >
          {chatList.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}
