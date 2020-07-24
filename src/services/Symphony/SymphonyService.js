const Finsemble = require("@chartiq/finsemble");

Finsemble.Clients.Logger.start();
Finsemble.Clients.Logger.log("Symphony Service starting up");

// Add and initialize any other clients you need to use (services are initialized by the system, clients are not):
// Finsemble.Clients.AuthenticationClient.initialize();
// Finsemble.Clients.ConfigClient.initialize();
// Finsemble.Clients.DialogManager.initialize();
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
class SymphonyService extends Finsemble.baseService {
	/**
	 * Initializes a new instance of the SymphonyService class.
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
					// "configClient",
					// "dialogManager",
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

		this.symphonyUsername = ''
		this.symphonyUserInfo = {}
		this.symphonyApiSetting = {}
		this.symphonyServiceTopic = 'symphonyService'
		this.finsembleSymphonyAppTokenRootConfigPath = 'finsemble.symphony.appTokenRoot'
		this.finsembleSymphonyDefaultUsernameConfigPath = 'finsemble.symphony.defaultUsername'
		this.symphonyAppRoot = ''
		this.symphonyUserSessionToken = ''
		this.readyHandler = this.readyHandler.bind(this);
		this.onBaseServiceReady(this.readyHandler);
	}

	/**
	 * Fired when the service is ready for initialization
	 * @param {function} callback
	 */
	readyHandler(callback) {
		this.createRouterEndpoints();
		//
		this.retrieveRootConfgi()

		Finsemble.Clients.Logger.log("Symphony Service ready");
		callback();
	}

	retrieveRootConfgi() {
		Finsemble.Clients.ConfigClient.getValues([this.finsembleSymphonyAppTokenRootConfigPath, this.finsembleSymphonyDefaultUsernameConfigPath], (err, configRes) => {
			if (!err) {
				this.symphonyAppRoot = configRes[this.finsembleSymphonyAppTokenRootConfigPath]
				this.symphonyApiSetting = {
					getSymphonyUserSessionToken: {
						path: this.symphonyAppRoot + '/getSymphonyUserSessionToken'
					},
					listUserStreams: {
						path: this.symphonyAppRoot + '/listUserStreams',
					},
					usersLookup: {
						path: this.symphonyAppRoot + '/usersLookup',
					},
					sessionUser: {
						path: this.symphonyAppRoot + '/sessionUser'
					},
					createMessage: {
						path: this.symphonyAppRoot + '/createMessage'
					},
					searchUsers: {
						path: this.symphonyAppRoot + '/searchUsers'
					},
					createIM: {
						path: this.symphonyAppRoot + '/createIM'
					},
					listConnections: {
						path: this.symphonyAppRoot + '/listConnections'
					},
					createRoom: {
						path: this.symphonyAppRoot + '/createRoom'
					},
					addMember: {
						path: this.symphonyAppRoot + '/addMember'
					},
					share: {
						path: this.symphonyAppRoot + '/share'
					}
				}


				// The symphony username should be retireved from your auth system
				// For demo or testing purpose the symphony username is hardcoded below / in manifest
				// For testing, input your testing Symphony username below or in manifest $symphonyDefaultUsername
				Finsemble.Clients.AuthenticationClient.getCurrentCredentials((err, authRes) => {
					if (!err) {
						if (authRes) {
							if (authRes.symphonyUsername) {
								// Retrieve from getCurrentCredentials()
								this.symphonyUsername = authRes.symphonyUsername
								Finsemble.Clients.Logger.log('Getting Symphony Username from CurrentCredentials')
							}
						} else if (configRes[this.finsembleSymphonyDefaultUsernameConfigPath]) {
							// Retrieve from manifest
							this.symphonyUsername = configRes[this.finsembleSymphonyDefaultUsernameConfigPath]
							Finsemble.Clients.Logger.log('Getting Symphony Username from Manifest')

						} else {
							// Hardcoded in service, only for development / testing
							this.symphonyUsername = 'Ethan'
							Finsemble.Clients.Logger.log('Getting Symphony Username from service code')
						}

						// Initial retireve of Symphony User Session Token
						if (this.symphonyUsername != '') {
							this.getSymphonyUserSessionToken()
								.then((token) => {
									this.symphonyUserSessionToken = token.userSessionToken
									// Retrieve session userId 
									this.sessionUser(this.symphonyUserSessionToken)
										.then((userInfo) => {
											this.symphonyUserInfo = userInfo
										})
								})
								.catch((err) => {
									Finsemble.Clients.Logger.error('Failed to retrieve Symphony user session', err)
								})
						}
					}
				})
			}
		})
	}

	/**
	 * Creates a router endpoint for you service.
	 * Add query responders, listeners or pub/sub topic as appropriate.
	 */
	createRouterEndpoints() {
		var self = this;

		// Create router pub/sub responder for symphonyPublish
		Finsemble.Clients.RouterClient.addPubSubResponder("symphonyPublish", {
			"State": "start"
		})

		// Protocol handler example
		fin.desktop.System.addEventListener('protocol-handler-triggered', (data) => {
			if (data.url) {
				let protocolURL = new URL(data.url)
				let params = protocolURL.searchParams;
				let target = ''
				let symbol = ''
				for (let pair of params.entries()) {
					switch (pair[0]) {
						case 'target':
							target = pair[1]
							break;
						case 'symbol':
							symbol = pair[1]
							break
						case 'testData':
							symbol = pair[1]
							break
						default:
							break;
					}
				}
				if (target != '') {
					self.findAnInstance(target)
						.then((windowsIdentifiers) => {
							if (windowsIdentifiers.length > 0) {
								// Target conmponent exist, transmit a message
								Finsemble.Clients.RouterClient.transmit('symphonyTransmit', {
									symbol: symbol
								})
							} else {
								// No target found hence spawn / show 1
								Finsemble.Clients.LauncherClient.showWindow({
									componentType: target
								}, {
									spawnIfNotFound: true,
									addToWorkspace: true,
									position: "available",
									top: "center",
									left: "center",
									data: {
										symbol: symbol
									}
								}, (err, windowIdentifer) => {
									if (!err) {
										console.log(windowIdentifer)
									} else {
										console.log(err)
									}
								})
							}
						})
				}
			}
		})

		// 
		Finsemble.Clients.RouterClient.addResponder(this.symphonyServiceTopic, (err, queryMessage) => {
			if (err) {
				Finsemble.Clients.Logger.error("Failed to receive Symphony Service query", err);
			} else {
				let queryData = queryMessage.data
				let queryFunction = queryData.function
				switch (queryFunction) {
					case 'getSymphonyUserStreamList':
						let streamTypes = queryData.streamTypes
						self.listUserStreams(self.symphonyUserSessionToken, streamTypes)
							.then((userStreamList) => {
								queryMessage.sendQueryResponse(null, {
									userStreamList: userStreamList
								});
							})
							.catch(err => {
								Finsemble.Clients.Logger.error("Failed to list user stream", err);
								queryMessage.sendQueryResponse(err);
							});
						break;
					case 'getSymphonyUserStreamInfo':
						self.getSymphonyUserStreamInfo(self.symphonyUserSessionToken)
							.then((userStreamList) => {
								queryMessage.sendQueryResponse(null, {
									userStreamList: userStreamList
								});
							})
						break;
					case 'usersLookup':
						let userId = queryData.userId
						self.usersLookup(self.symphonyUserSessionToken, userId)
							.then((memberInfo) => {
								queryMessage.sendQueryResponse(null, {
									memberInfo: memberInfo
								});
							})
						break;
					case 'createMessage':
						let sid = queryData.sid
						let msg = queryData.msg
						self.createMessage(self.symphonyUserSessionToken, sid, msg)
							.then((result) => {
								queryMessage.sendQueryResponse(null, {
									result: result
								});
							})
						break;
					case 'searchUsers':
						let query = queryData.query
						let local = queryData.local
						self.searchUsers(self.symphonyUserSessionToken, query, local)
							.then((users) => {
								queryMessage.sendQueryResponse(null, {
									users: users
								});
							})
						break;
					case 'createIM':
						let userIDs = queryData.userIDs
						self.createIM(self.symphonyUserSessionToken, userIDs)
							.then((id) => {
								queryMessage.sendQueryResponse(null, {
									id: id
								});
							})
						break;
					case 'createRoom':
						let roomUserIDs = queryData.userIDs
						let chatroomName = queryData.chatroomName
						self.createRoom(self.symphonyUserSessionToken, chatroomName)
							.then((room) => {
								roomUserIDs.forEach(roomUserID => {
									self.addMember(self.symphonyUserSessionToken, room.room.roomSystemInfo.id, roomUserID)
								})

								queryMessage.sendQueryResponse(null, room);
							})
						break;
					case 'listConnections':
						let status = queryData.status
						let listConnectionsUserIDs = queryData.userIDs
						self.listConnections(self.symphonyUserSessionToken, status, listConnectionsUserIDs)
							.then((connections) => {
								queryMessage.sendQueryResponse(null, {
									connections: connections
								});
							})
						break;
					case 'share':
						let shareSid = queryData.sid
						let content = queryData.content
						self.share(self.symphonyUserSessionToken, shareSid, content)
							.then((result) => {
								queryMessage.sendQueryResponse(null, result);
							})
						break;
					default:
						queryMessage.sendQueryResponse(null, 'Please specify symphony function');
						break;
				}
			}
		});
	}

	// This API must be protected by your server (i.e. userAuth session)
	getSymphonyUserSessionToken() {
		let apiName = 'getSymphonyUserSessionToken'
		let self = this
		return new Promise((resolve, reject) => {
			fetch(self.symphonyApiSetting[apiName].path, {
					method: "POST",
					body: JSON.stringify({
						userName: self.symphonyUsername
					}),
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(res => {
					if (res.status == 200) {
						return res.json()
					} else {
						Finsemble.Clients.Logger.error("Failed to retrieve Symphony User Session Token");
						reject(res.status)
					}
				})
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					Finsemble.Clients.Logger.error("Failed to retrieve Symphony User Session Token", err);
					reject(err)
				});
		})
	}
	// ---------------------------------------------------

	listUserStreams(userSessionToken, streamTypes) {
		let apiName = 'listUserStreams'
		let self = this
		return new Promise((resolve, reject) => {
			fetch(self.symphonyApiSetting[apiName].path, {
					method: "POST",
					body: JSON.stringify({
						userSessionToken: userSessionToken,
						streamTypes: streamTypes
					}),
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(res => {
					if (res.status == 200) {
						return res.json()
					} else if (res.status == 401) {
						Finsemble.Clients.Logger.error("Failed to list user stream - userSession invalid", res);
						self.getSymphonyUserSessionToken()
							.then((token) => {
								self.symphonyUserSessionToken = token.userSessionToken
								self.listUserStreams(token.userSessionToken)
									.then((userStreamList) => {
										resolve(userStreamList);
									})
							})
							.catch(err => {
								console.log(err)
								reject(err)
							});
					} else {
						reject(res.status)
					}
				})
				.then(data => {
					resolve(data.userStreamList);
				})
				.catch(err => {
					console.log(err)
					reject(err)
				});
		})
	}

	usersLookup(userSessionToken, userId) {
		let apiName = 'usersLookup'
		let self = this
		userId = [...new Set(userId)];
		userId.splice(userId.indexOf(this.symphonyUserInfo.id), 1)
		return new Promise((resolve, reject) => {
			fetch(self.symphonyApiSetting[apiName].path, {
					method: "POST",
					body: JSON.stringify({
						userSessionToken: userSessionToken,
						userId: userId.toString()
					}),
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(res => {
					if (res.status == 200) {
						return res.json()
					} else if (res.status == 401) {
						Finsemble.Clients.Logger.error("Failed to list user stream - userSession invalid", res);
						self.getSymphonyUserSessionToken().then((token) => {
							self.symphonyUserSessionToken = token.userSessionToken
							self.usersLookup(token.userSessionToken, userId)
								.then((memberInfo) => {
									resolve(memberInfo);
								})
						})
					} else {
						reject(res.status)
					}
				})
				.then(data => {
					resolve(data.memberInfo);
				})
				.catch(err => {
					reject(err)
				});
		})
	}

	sessionUser(userSessionToken) {
		let apiName = 'sessionUser'
		let self = this
		return new Promise((resolve, reject) => {
			fetch(self.symphonyApiSetting[apiName].path, {
					method: "POST",
					body: JSON.stringify({
						userSessionToken: userSessionToken
					}),
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(res => {
					if (res.status == 200) {
						return res.json()
					} else if (res.status == 401) {
						Finsemble.Clients.Logger.error("Failed to list user stream - userSession invalid", res);
						self.getSymphonyUserSessionToken().then((token) => {
							self.symphonyUserSessionToken = token.userSessionToken
							self.sessionUser(token.userSessionToken)
								.then((userInfo) => {
									resolve(userInfo);
								})
						})
					} else {
						reject(res.status)
					}
				})
				.then(data => {
					resolve(data.userInfo);
				})
				.catch(err => {
					reject(err)
				});
		})
	}

	createMessage(userSessionToken, sid, msg) {
		let apiName = 'createMessage'
		msg = '<messageML>' + msg + '</messageML>'
		let self = this
		return new Promise((resolve, reject) => {
			fetch(self.symphonyApiSetting[apiName].path, {
					method: "POST",
					body: JSON.stringify({
						userSessionToken: userSessionToken,
						sid: sid,
						msg: msg
					}),
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(res => {
					if (res.status == 200) {
						return res.json()
					} else if (res.status == 401) {
						Finsemble.Clients.Logger.error("Failed to list user stream - userSession invalid", res);
						self.getSymphonyUserSessionToken().then((token) => {
							self.symphonyUserSessionToken = token.userSessionToken
							self.createMessage(token.userSessionToken, sid, msg)
								.then((result) => {
									resolve(result);
								})
						})
					} else {
						reject(res.status)
					}
				})
				.then(data => {
					resolve(data.result);
				})
				.catch(err => {
					reject(err)
				});
		})
	}

	searchUsers(userSessionToken, query, local) {
		let apiName = 'searchUsers'
		let self = this
		let body = {
			userSessionToken: userSessionToken,
			query: query
		}
		if (local) {
			body.local = local
		}

		return new Promise((resolve, reject) => {
			fetch(self.symphonyApiSetting[apiName].path, {
					method: "POST",
					body: JSON.stringify(body),
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(res => {
					if (res.status == 200) {
						return res.json()
					} else if (res.status == 401) {
						Finsemble.Clients.Logger.error("Failed to list user stream - userSession invalid", res);
						self.getSymphonyUserSessionToken().then((token) => {
							self.symphonyUserSessionToken = token.userSessionToken
							self.searchUsers(token.userSessionToken, query, local)
								.then((result) => {
									resolve(result);
								})
						})
					} else {
						reject(res.status)
					}
				})
				.then(data => {
					resolve(data.users);
				})
				.catch(err => {
					reject(err)
				});
		})
	}

	createRoom(userSessionToken, chatroomName) {
		let apiName = 'createRoom'
		let self = this
		return new Promise((resolve, reject) => {
			fetch(self.symphonyApiSetting[apiName].path, {
					method: "POST",
					body: JSON.stringify({
						userSessionToken: userSessionToken,
						chatroomName: chatroomName
					}),
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(res => {
					if (res.status == 200) {
						return res.json()
					} else if (res.status == 401) {
						Finsemble.Clients.Logger.error("Failed to list user stream - userSession invalid", res);
						self.getSymphonyUserSessionToken().then((token) => {
							self.symphonyUserSessionToken = token.userSessionToken
							self.createRoom(token.userSessionToken, userIDs, chatroomName)
								.then((result) => {
									resolve(result);
								})
						})
					} else {
						reject(res.status)
					}
				})
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					reject(err)
				});
		})
	}

	addMember(userSessionToken, streamId, userId) {
		let apiName = 'addMember'
		let self = this
		return new Promise((resolve, reject) => {
			fetch(self.symphonyApiSetting[apiName].path, {
					method: "POST",
					body: JSON.stringify({
						userSessionToken: userSessionToken,
						streamId: streamId,
						userId: userId
					}),
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(res => {
					if (res.status == 200) {
						return res.json()
					} else if (res.status == 401) {
						Finsemble.Clients.Logger.error("Failed to list user stream - userSession invalid", res);
						self.getSymphonyUserSessionToken().then((token) => {
							self.symphonyUserSessionToken = token.userSessionToken
							self.createRoom(token.userSessionToken, userIDs, chatroomName)
								.then((result) => {
									resolve(result);
								})
						})
					} else {
						reject(res.status)
					}
				})
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					reject(err)
				});
		})
	}

	createIM(userSessionToken, userIDs) {
		let apiName = 'createIM'
		let self = this
		return new Promise((resolve, reject) => {
			fetch(self.symphonyApiSetting[apiName].path, {
					method: "POST",
					body: JSON.stringify({
						userSessionToken: userSessionToken,
						userIDs: userIDs
					}),
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(res => {
					if (res.status == 200) {
						return res.json()
					} else if (res.status == 401) {
						Finsemble.Clients.Logger.error("Failed to list user stream - userSession invalid", res);
						self.getSymphonyUserSessionToken().then((token) => {
							self.symphonyUserSessionToken = token.userSessionToken
							self.createIM(token.userSessionToken, userIDs)
								.then((result) => {
									resolve(result);
								})
						})
					} else {
						reject(res.status)
					}
				})
				.then(data => {
					resolve(data.id);
				})
				.catch(err => {
					reject(err)
				});
		})
	}

	share(userSessionToken, sid, content) {
		let apiName = 'share'
		let self = this
		return new Promise((resolve, reject) => {
			fetch(self.symphonyApiSetting[apiName].path, {
					method: "POST",
					body: JSON.stringify({
						userSessionToken: userSessionToken,
						sid: sid,
						content: content
					}),
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(res => {
					if (res.status == 200) {
						return res.json()
					} else if (res.status == 401) {
						Finsemble.Clients.Logger.error("Failed to list user stream - userSession invalid", res);
						self.getSymphonyUserSessionToken().then((token) => {
							self.symphonyUserSessionToken = token.userSessionToken
							self.share(token.userSessionToken, sid, content)
								.then((result) => {
									resolve(result);
								})
						})
					} else {
						reject(res.status)
					}
				})
				.then(data => {
					resolve(data);
				})
				.catch(err => {
					reject(err)
				});
		})
	}

	listConnections(userSessionToken, status, userIDs) {
		let apiName = 'listConnections'
		let self = this
		return new Promise((resolve, reject) => {
			fetch(self.symphonyApiSetting[apiName].path, {
					method: "POST",
					body: JSON.stringify({
						userSessionToken: userSessionToken,
						status: status,
						userIDs: userIDs
					}),
					headers: {
						"Content-Type": "application/json"
					}
				})
				.then(res => {
					if (res.status == 200) {
						return res.json()
					} else if (res.status == 401) {
						Finsemble.Clients.Logger.error("Failed to list user stream - userSession invalid", res);
						self.getSymphonyUserSessionToken().then((token) => {
							self.symphonyUserSessionToken = token.userSessionToken
							self.listConnections(token.userSessionToken, userIDs)
								.then((result) => {
									resolve(result);
								})
						})
					} else {
						reject(res.status)
					}
				})
				.then(data => {
					resolve(data.connections);
				})
				.catch(err => {
					reject(err)
				});
		})
	}


	async findAnInstance(componentType) {
		let {
			err,
			data
		} = await Finsemble.Clients.LauncherClient.getActiveDescriptors();
		if (err) {
			console.error(err);
			return Promise.reject(err);
		} else {
			let windowIdentifiers = [];
			Object.keys(data).forEach(windowName => {
				if (data[windowName].componentType == componentType) {
					windowIdentifiers.push({
						componentType: componentType,
						windowName: windowName
					});
				}
			});
			return Promise.resolve(windowIdentifiers);
		}
	}


}

const serviceInstance = new SymphonyService();

serviceInstance.start();
module.exports = serviceInstance;