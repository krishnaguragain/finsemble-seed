import React from "react";
import {
  SymphonyAdvanceShareDispatcher,
  SymphonyAdvanceShareActions,
} from "../stores/SymphonyAdvanceShareStore";
import Select from "react-select";

export default class SymphonyNewDirectChat extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let _this = this;
    SymphonyAdvanceShareStore.on("searchMemberResultListChange", () => {
      _this.forceUpdate();
    });

    //window.addEventListener("blur", this.cancelBtnOnClick)
  }

  onMemberSearchTextInput(newValue) {
    if (newValue.length > 2) {
      SymphonyAdvanceShareDispatcher.dispatch({
        type: SymphonyAdvanceShareActions.SEARCHMEMBER,
        keyword: newValue,
      });
    }
  }

  onMemberOptionClick(neValue) {
    console.log(neValue);
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
          <p>Create Direct Chat</p>
          <label> Members (required)</label>
          <Select
            options={SymphonyAdvanceShareStore.searchMemberResultList}
            onInputChange={this.onMemberSearchTextInput}
            getOptionLabel={({ displayName,  company}) => displayName+', '+company}
            getOptionValue={({ id }) => id}
            onChange={this.onMemberOptionClick}
          />
          {/* <input
            type="text"
            id="memberSearchText"
            placeholder="Enter name or emails"
            list="memberSearchResultList"
            onInput={this.onMemberSearchTextInput}
          ></input>
          <datalist id="memberSearchResultList" onClick={this.onMemberOptionClick}>
            {SymphonyAdvanceShareStore.searchMemberResultList.map((item) => (
              <option id={item.id} key={item.id} value={item.displayName} >
                {item.company}
              </option>
            ))}
          </datalist> */}
        </div>
      </div>
    );
  }
}
