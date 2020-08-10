import React from "react";
import { Action as SymphonySimpleShareActions } from "../stores/SymphonySimpleShareStore";

export default class SymphonyShareMsgText extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				 <textarea id="shareText" value={this.props.shareMsg} readOnly></textarea>
			</div>
		);
	}
}
