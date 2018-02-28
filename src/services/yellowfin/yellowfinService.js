//replace with import when ready
var Finsemble = require("@chartiq/finsemble");

var baseService = Finsemble.baseService;
var Logger = Finsemble.Clients.Logger;
var util = Finsemble.Util;
var StorageClient = Finsemble.Clients.StorageClient;
var LauncherClient = Finsemble.Clients.LauncherClient;

/**
 * The yellowfin Service receives calls from the yellowfinClient.
 * @constructor
 */
function yellowfinService() {

	var self = this;
	/**
	 * Creates router endpoints for all of our client APIs. Add servers or listeners for requests coming from your clients.
	 * @private
	 */
	this.createRouterEndpoints = function () {

	};

	return this;
}
yellowfinService.prototype = new baseService({
	startupDependencies: {
		services: ["dockingService", "authenticationService"]
	}
});
var serviceInstance = new yellowfinService('yellowfinService');

serviceInstance.onBaseServiceReady(function (callback) {
	Logger.start();
	Logger.system.log("yellowFin Service ready");
	callback();
});
serviceInstance.start();
module.exports = serviceInstance;