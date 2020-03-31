const Finsemble = require("@chartiq/finsemble");
const RouterClient = Finsemble.Clients.RouterClient;
const Logger = Finsemble.Clients.Logger;
const request = require('request')

Logger.start();
Logger.log("useractivitytracker Service starting up");

// Add and initialize any other clients you need to use 
//   (services are initialised by the system, clients are not)
// let StorageClient = Finsemble.Clients.StorageClient;
// StorageClient.initialize();

/**
 * 
 * @constructor
 */
function useractivitytrackerService() {
	const self = this;

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
		RouterClient.addResponder("useractivitytracker functions", function (error, queryMessage) {
			if (!error) {
				Logger.log('useractivitytracker Query: ' + JSON.stringify(queryMessage));

				if (queryMessage.data.query === "myFunction") {
					try {
						queryMessage.sendQueryResponse(null, self.myFunction());
					} catch (err) {
						queryMessage.sendQueryResponse(err);
					}
				} else {
					queryMessage.sendQueryResponse("Unknown useractivitytracker query function: " + queryMessage, null);
					Logger.error("Unknown useractivitytracker query function: ", queryMessage);
				}
			} else {
				Logger.error("Failed to setup useractivitytracker query responder", error);
			}
		});
	};

	return this;
};

useractivitytrackerService.prototype = new Finsemble.baseService({
	startupDependencies: {
		// add any services or clients that should be started before your service
		services: [ /* "dockingService", "authenticationService" */ ],
		clients: [ /* "storageClient" */ ]
	}
});
const serviceInstance = new useractivitytrackerService('useractivitytrackerService');

serviceInstance.onBaseServiceReady(function (callback) {
	serviceInstance.createRouterEndpoints();
	Logger.log("useractivitytracker Service ready");

	Finsemble.Clients.RouterClient.addListener("UserActivity", function (error, response) {
		if (error) {} else {
			console.log(response.data);
			request.post({
					url: "http://127.0.0.1:3375/push_useractivity",
					form: response.data
				},
				function (err, httpResponse, body) {
					if (err)
						console.log(err)
					else
						console.log(body)
				}
			);
		}
	});

	callback();
});

serviceInstance.start();
module.exports = serviceInstance;