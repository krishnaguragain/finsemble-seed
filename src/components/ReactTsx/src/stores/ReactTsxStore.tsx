let Dispatcher = require('flux').Dispatcher;
Dispatcher = new Dispatcher();

let EventEmitter = require('events').EventEmitter;
let assign = require('object-assign');
let request = require('superagent');
const constants = {};

let reactTsxStore = assign({}, EventEmitter.prototype, {
	initialize () {
		// initialize whatever you want.
		console.log('reactTsxStore initialize')
	},
});

let actions = {

};

// wait for FSBL to be ready before initializing.
const  FSBLReady = () => {
	reactTsxStore.initialize();
};

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener('onReady', FSBLReady);
} else {
	window.addEventListener('FSBLReady', FSBLReady);
}

module.exports.Store = reactTsxStore;
module.exports.Actions = actions;
