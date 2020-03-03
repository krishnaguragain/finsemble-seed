import * as React from 'react';

export interface ReactTsxComponentProps { title: string;}

export default class ReactTsxComponent extends React.Component <ReactTsxComponentProps>{
	constructor(props: ReactTsxComponentProps) {
		super(props);
	}
	render() {
		return (
			<div>
				<h1>
					ReactTsx using react
				</h1>
				<h2>
					{this.props.title}
				</h2>
			</div>);
	}
}
