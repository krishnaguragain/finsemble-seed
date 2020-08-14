import React from "react";
import ReactDOM from "react-dom";
import { Store as SymphonyAdvanceShareStore } from "./stores/SymphonyAdvanceShareStore";
import SymphonyAdvanceShareComponent from "./components/SymphonyAdvanceShareComponent";

class SymphonyAdvanceShare extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {}
	componentDidUpdate(prevProps, prevState) {}
	componentWillUnmount() {}

	render() {
		return (
			<div>
				<SymphonyAdvanceShareComponent />
			</div>
		);
	}
}
//for debugging.
window.SymphonyAdvanceShareStore = SymphonyAdvanceShareStore;

// render component when FSBL is ready.
const FSBLReady = () => {
	ReactDOM.render(
		<SymphonyAdvanceShare />,
		document.getElementById("SymphonyAdvanceShare-component-wrapper")
	);
};

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady);
} else {
	window.addEventListener("FSBLReady", FSBLReady);
}
