const Finsemble = require("@chartiq/finsemble");
const RouterClient = Finsemble.Clients.RouterClient;
const Logger = Finsemble.Clients.Logger;
Logger.start();
Logger.log("demo Service starting up");

// Add and initialize any other clients you need to use 
//   (services are initialised by the system, clients are not)
// let StorageClient = Finsemble.Clients.StorageClient;
// StorageClient.initialize();

/**
 * 
 * @constructor
 */
function demoService() {
	const self = this;
	var serviceOn = true
	var interval
	//Implement service functionality
	this.myFunction = function () {
		return "some dummy data";
	}

	/**
	 * Creates a router endpoint for you service. 
	 * Add query responders, listeners or pub/sub topic as appropriate. 
	 * @private
	 */
	this.createRouterEndpoints = function () {
		//Example router integration which uses a single query responder to expose multiple functions
		RouterClient.addResponder("serviceOnOffResponder", function (error, queryMessage) {
			if (!error) {
				if (queryMessage.data.action === 'queryStatus') {
					if (serviceOn) {
						queryMessage.sendQueryResponse(null, {
							service: 'on'
						});
					} else {
						queryMessage.sendQueryResponse(null, {
							service: 'off'
						});
					}
				} else if (queryMessage.data.action === "setServiceOn") {
					try {
						serviceOn = true
						self.startDemoFunction()
						queryMessage.sendQueryResponse(null, {
							service: 'on'
						});
					} catch (err) {
						queryMessage.sendQueryResponse(err);
					}
				} else if (queryMessage.data.action === "setServiceOff") {
					try {
						serviceOn = false
						self.stopDemoFunction()
						queryMessage.sendQueryResponse(null, {
							service: 'off'
						});
					} catch (err) {
						queryMessage.sendQueryResponse(err);
					}
				} else {
					queryMessage.sendQueryResponse("Unknown demo query function: " + queryMessage, null);
					Logger.error("Unknown demo query function: ", queryMessage);
				}
			} else {
				Logger.error("Failed to setup demo query responder", error);
			}
		});
	};

	this.startDemoFunction = function () {
		interval = setInterval(function () {
			RouterClient.transmit("demoChannel", {
				"date": new Date(),
				"message": 'Test Message from demoService'
			});
		}, 1000);
	}

	this.stopDemoFunction = function () {
		clearInterval(interval)
	}

	return this;
};

demoService.prototype = new Finsemble.baseService({
	startupDependencies: {
		// add any services or clients that should be started before your service
		services: [ /* "dockingService", "authenticationService" */ ],
		clients: [ /* "storageClient" */ ]
	}
});
const serviceInstance = new demoService('demoService');

serviceInstance.onBaseServiceReady(function (callback) {
	serviceInstance.createRouterEndpoints();
	serviceInstance.startDemoFunction();
	Logger.log("demo Service ready");
	callback();
});

serviceInstance.start();
module.exports = serviceInstance;