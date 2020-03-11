const Finsemble = require("@chartiq/finsemble");

Finsemble.Clients.Logger.start();
Finsemble.Clients.Logger.log("versionCheck Service starting up");

// Add and initialize any other clients you need to use (services are initialized by the system, clients are not):
// Finsemble.Clients.AuthenticationClient.initialize();
Finsemble.Clients.ConfigClient.initialize();
Finsemble.Clients.DialogManager.initialize();
// Finsemble.Clients.DistributedStoreClient.initialize();
// Finsemble.Clients.DragAndDropClient.initialize();
// Finsemble.Clients.LauncherClient.initialize();
// Finsemble.Clients.LinkerClient.initialize();
// Finsemble.Clients.HotkeyClient.initialize();
// Finsemble.Clients.SearchClient.initialize();
// Finsemble.Clients.StorageClient.initialize();
// Finsemble.Clients.WindowClient.initialize();
// Finsemble.Clients.WorkspaceClient.initialize();

// NOTE: When adding the above clients to a service, be sure to add them to the start up dependencies.

/**
 * TODO: Add service description here
 */
class VersionCheckService extends Finsemble.baseService {
	/**
	 * Initializes a new instance of the versionCheckService class.
	 */
	constructor() {
		super({
			// Declare any service or client dependencies that must be available before your service starts up.
			startupDependencies: {
				// If the service is using another service directly via an event listener or a responder, that service
				// should be listed as a service start up dependency.
				services: [
					// "assimilationService",
					// "authenticationService",
					// "configService",
					// "hotkeysService",
					// "loggerService",
					// "linkerService",
					// "searchService",
					// "storageService",
					// "windowService",
					// "workspaceService"
				],
				// When ever you use a client API with in the service, it should be listed as a client startup
				// dependency. Any clients listed as a dependency must be initialized at the top of this file for your
				// service to startup.
				clients: [
					// "authenticationClient",
					"configClient",
					"dialogManager",
					// "distributedStoreClient",
					// "dragAndDropClient",
					// "hotkeyClient",
					// "launcherClient",
					// "linkerClient",
					// "searchClient
					// "storageClient",
					// "windowClient",
					// "workspaceClient",
				]
			}
		});

		// Initialize initialize variables
		this.startUpFSBLVersion = "";
		this.configURL = "";
		this.updatePeriod = Number.MAX_SAFE_INTEGER;

		// Bind functions to this for callbacks
		this.compareVersions.bind(this);
		this.getFinsembleVersion.bind(this);
		this.startVersionCheck.bind(this);
		this.readyHandler = this.readyHandler.bind(this);

		this.onBaseServiceReady(this.readyHandler);
	}

	/**
	 * Fired when the service is ready for initialization
	 * @param {function} callback
	 */
	readyHandler(callback) {
		this.startVersionCheck();
		Finsemble.Clients.Logger.log("Finsemble Version Check Service ready");
		callback();
	}
	/**
			 * Compares Finsemble version with startup version and notifies user if they are different.
			 * 
			 * @param fsblVersionA The first version to compare
			 * @param fsblVersionB The second version to compare
			 */
	compareVersions(fsblVersionA, fsblVersionB) {
		if (fsblVersionA !== fsblVersionB) {
			const dialogHandler = (err, response) => {
				if (err) {
					console.error(err);
					return;
				}

				if (response.choice === "cancel") {
					//
				} else {
					//If we get here, they clicked "Restart Now", so we obey the user.
					Finsemble.Clients.RouterClient.transmit("Application.restart");
				}
			};

			const params = {
				monitor: "primary",
				question: "The application will restart in one minute. Your workspace will be saved.",
				showTimer: true,
				timerDuration: 60000,
				showNegativeButton: false,
				affirmativeDialogManResponseLabel: "Restart Now"
			};

			// Version changed since startup, notify user.
			Finsemble.Clients.DialogManager.open("yesNo", params, dialogHandler);
		}
	}

	/**
	 * Gets the Finsemble version from the server.
	 * 
	 * @param cb Callback function used to return the Finsemble version with it is fetched.
	 */
	getFinsembleVersion(cb) {
		// Version copied here because of this scope
		const fsblVersion = this.startUpFSBLVersion;
		fetch(this.configURL)
			.then((res) => res.json())
			.then(config => cb(config.system.FSBLVersion, fsblVersion));
	}

	/**
	 * Creates a router endpoint for you service. 
	 * Add query responders, listeners or pub/sub topic as appropriate. 
	 */
	startVersionCheck() {
		const processConfig = (err, info) => {
			if (err) {
				Finsemble.Clients.Logger.error(err);
				return;
			}

			// Set default configuration
			this.configURL = `${info.applicationRoot}/finsemble/configs/core/config.json`;
			this.updatePeriod = 60 * 1000;

			if (info.FSBLVersionChecking) {
				// Version checking config exists
				if (info.FSBLVersionChecking.updatePeriod) {
					this.updatePeriod = info.FSBLVersionChecking.updatePeriod;
				}

				if (info.FSBLVersionChecking.configURL) {
					this.configURL = info.FSBLVersionChecking.configURL;
				}
			}

			Finsemble.Clients.Logger.log(
				`Using:\n\tURL:${this.configURL}\n\tUpdate period (ms): ${this.updatePeriod}`);

			// Get version at startup
			this.getFinsembleVersion((fsblVersion) => {
				this.startUpFSBLVersion = fsblVersion;

				const self = this;
				setInterval(() => self.getFinsembleVersion(self.compareVersions), this.updatePeriod);
			});
		};

		Finsemble.Clients.ConfigClient.getValue({ field: "finsemble" }, processConfig);
	}
}

const serviceInstance = new VersionCheckService();

serviceInstance.start();
module.exports = serviceInstance;
