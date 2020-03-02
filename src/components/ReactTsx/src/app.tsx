import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Store as ReactTsxStore } from './stores/ReactTsxStore';
import ReactTsxComponent from './components/ReactTsxComponent';

class ReactTsx extends React.Component {
	render() {
		let self = this;
		return (
		<div>
			<ReactTsxComponent title='test' />
		</div>)
	}
};
// for debugging.
window.ReactTsxStore = ReactTsxStore;

// render component when FSBL is ready.
const FSBLReady = () => {
	ReactDOM.render(
		<ReactTsx />
		, document.getElementById('ReactTsx-component-wrapper'));
}

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener('onReady', FSBLReady);
} else {
	window.addEventListener('FSBLReady', FSBLReady);
}
