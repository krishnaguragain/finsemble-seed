/*!
* Copyright 2020 by ChartIQ, Inc.
* All rights reserved.
*/
import React from "react";
import { FinsembleHoverDetector } from "@chartiq/finsemble-react-controls";

/**
 * Example action button added to WindowTitleBar button. 
 */
export default class ExtraButtonExample extends React.Component {
	constructor(props) {
		super(props);
		this.exampleAction = this.exampleAction.bind(this);
		this.hoverAction = this.hoverAction.bind(this);
		this.state = { hoverState: false };
	}

	/**
	 * Action function for the button
	 */
	exampleAction() {
		alert("Example windowTitleBar action button clicked");
	}

	componentDidMount() {
		//if any state info is required for your button (for example to highlight it) retrieve it here
	}

	/** 
	 * Receives the "visible" prop from the parent component (see comments in windowTitleBarComponent.jsx)
	 */
	componentWillReceiveProps({ visible }) {
		this.setState({ visible });
	}

	componentWillUnmount() { }
	
	/**
     * When your mouse enters/leaves the hoverDetector, this function is invoked.
     *
     * @param {any} newHoverState
     * @memberof LinkerButton
     */
	hoverAction(newHoverState) {
		this.setState({ hoverState: newHoverState });
	}

	/**
	 * Render method.
	 *
	 * @returns
	 * @memberof AlwaysOnTop
	 */
	render() {
		let iconClasses = "ff-dots-vert";
		let wrapClasses = "fsbl-icon ";
		//if you need to highlight button vai state info do so here, e.g. if there is a state variable such as alwaysOnTop:
		//if (this.state && this.state.alwaysOnTop) wrapClasses += "fsbl-icon-highlighted ";
		let tooltip = "Example button";

		return (
			<div
				className={wrapClasses}
				id="fsbl-window-examplebutton"
				title={tooltip}
				data-hover={this.state.hoverState}
				onClick={this.exampleAction}
				style={this.state.visible ? {} : { display: "none" }}>
				<FinsembleHoverDetector edge="top" hoverAction={this.hoverAction} />
				<i className={iconClasses}></i>
			</div>);
	}
}