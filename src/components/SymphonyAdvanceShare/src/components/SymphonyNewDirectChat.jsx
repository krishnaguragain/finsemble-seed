import React from "react";
import {
  SymphonyAdvanceShareDispatcher,
  SymphonyAdvanceShareActions,
} from "../stores/SymphonyAdvanceShareStore";
import SymphonyConnectionStatus from "./SymphonyConnectionStatus";
import Select from "react-select";

export default class SymphonyNewDirectChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMembers: [],
      connectionState: {},
      isLoading: false,
    };
    this.createBtnOnClick = this.createBtnOnClick.bind(this);
    this.onMemberValueChange = this.onMemberValueChange.bind(this);
    this.onMemberSearchTextInput = this.onMemberSearchTextInput.bind(this);
  }

  componentDidMount() {
    let _this = this;
    SymphonyAdvanceShareStore.on("searchMemberResultListChange", () => {
      this.setState({ isLoading: false });
      _this.forceUpdate();
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ selectedMembers: [], connectionState: {} });
  }

  onMemberSearchTextInput(newValue) {
    if (newValue.length > 2) {
      this.setState({
        isLoading: true,
        connectionState: {
          status: "",
          user: "",
        },
      });
      SymphonyAdvanceShareDispatcher.dispatch({
        type: SymphonyAdvanceShareActions.SEARCHMEMBER,
        keyword: newValue,
      });
    }
  }

  onMemberValueChange(newValue) {
    if (newValue) {
      if (newValue.length < this.state.selectedMembers) {
        //Remove item
        this.setState({ selectedMembers: newValue });
      } else {
        //Add item
        let newItem = newValue[newValue.length - 1];

        if (newItem.emailAddress) {
          // Connected connections
          this.setState({ selectedMembers: newValue });
        } else {
          // Not connected
          let result = SymphonyAdvanceShareStore.connectionResultList.find(
            (record) => record.userId == newItem.id
          );
          if (result) {
            this.setState({
              connectionState: {
                status: result.status,
                user: newItem,
              },
            });
          } else {
            this.setState({
              connectionState: {
                status: "NOT_CONNECTED",
                user: newItem,
              },
            });
          }
        }
      }
    } else {
      this.setState({ selectedMembers: newValue });
    }
  }
  createBtnOnClick() {
    if (this.state.selectedMembers.length > 0) {
      var userIds = [];
      for (var i = 0; i < this.state.selectedMembers.length; i++) {
        userIds.push(this.state.selectedMembers[i].id);
      }
      SymphonyAdvanceShareDispatcher.dispatch({
        type: SymphonyAdvanceShareActions.CREATEIM,
        userIds: userIds,
      });
    }
  }

  render() {
    return (
      <div
        id="createDirectChatModal"
        className="modal"
        style={{ display: this.props.modalVisible }}
      >
        <div className="modal-content">
          <span
            className="close"
            id="closeCreateDirectChatModalSpan"
            onClick={this.props.close}
          >
            &times;
          </span>
          <h3>Create Direct Chat</h3>
          <label>Members (required)</label>
          <Select
            options={SymphonyAdvanceShareStore.searchMemberResultList}
            onInputChange={this.onMemberSearchTextInput}
            getOptionLabel={({ displayName, company }) => {
              let option = displayName;
              if (company) option += ", " + company;
              if (company != SymphonyAdvanceShareStore.symphonyUserInfo.company)
                option += " " + "(EXT)";

              return option;
            }}
            getOptionValue={({ id }) => id}
            onChange={this.onMemberValueChange}
            value={this.state.selectedMembers}
            isLoading={this.state.isLoading}
            isMulti
            placeholder={"Input your search..."}
            maxMenuHeight={150}
          />
          <SymphonyConnectionStatus
            connectionState={this.state.connectionState.status}
            connectionUser={this.state.connectionState.user}
          />
          <br />
          <button type="button" id="createBtn" onClick={this.createBtnOnClick}>
            Create
          </button>
        </div>
      </div>
    );
  }
}
