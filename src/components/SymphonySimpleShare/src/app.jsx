import React from "react";
import ReactDOM from "react-dom";
import { Store as SymphonySimpleShareStore } from "./stores/SymphonySimpleShareStore";
import SymphonySimpleShareComponent from "./components/SymphonySimpleShareComponent";

class SymphonySimpleShare extends React.Component {
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
				<SymphonySimpleShareComponent />
			</div>
		);
	}
}
//for debugging.
window.SymphonySimpleShareStore = SymphonySimpleShareStore;

// render component when FSBL is ready.
const FSBLReady = () => {
	ReactDOM.render(
		<SymphonySimpleShare />,
		document.getElementById("SymphonySimpleShare-component-wrapper")
	);
};

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady);
} else {
	window.addEventListener("FSBLReady", FSBLReady);
}
