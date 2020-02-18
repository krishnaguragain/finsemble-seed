const keyMap = FSBL.Clients.HotkeyClient.keyMap;
var dsStore, test2SpawnResopnse

/* SeachClient Functions*/
function triggerSearch() {
	if (document.getElementById('symbolInput').value != '')
		FSBL.Clients.SearchClient.search({
			text: document.getElementById('symbolInput').value
		}, function (err, response) {
			if (!err) {
				setDisplayMsg('Search success with the following details.', response)
			}
		})
	else
		setDisplayMsg('Input a search value in the textbox at the top.')
}

/* Dialog manager functions */
function triggerOpenDialog() {
	let dialogParams = {
		question: 'Test Question. See response in console.',
		affirmativeResponseText: 'Yes, overwrite',
		negativeResponseText: 'No, cancel',
		includeNegative: true,
		includeCancel: false
	};
	FSBL.Clients.DialogManager.open('yesNo', dialogParams, function (err, response) {
		//choice can be `'affirmative'`, `'negative'`, or `'cancel'`.
		if (!err)
			setDisplayMsg("Response Received: " + response.choice)
	});
}

/* WindowClient functions */
function triggerStopTilingOrTabbing() {
	var windowIdentifier = FSBL.Clients.WindowClient.getWindowIdentifier()
	FSBL.Clients.WindowClient.stopTilingOrTabbing({
		windowIdentifier: windowIdentifier
	}, function (err) {
		if (!err) {
			setDisplayMsg('stopTilingOrTabbing Stopped.')
		}
	})
}

function triggerStartTilingOrTabbing() {
	var windowIdentifier = FSBL.Clients.WindowClient.getWindowIdentifier()
	FSBL.Clients.WindowClient.startTilingOrTabbing({
		mousePosition: {
			x: 100,
			y: 100
		}
	}, function (err) {
		if (!err) {
			setDisplayMsg('startTilingOrTabbing Started.')
		}
	})
}

function triggerShowAtMousePos() {
	FSBL.Clients.WindowClient.showAtMousePosition()
}

function triggerSetWindowTitle() {
	if (document.getElementById('symbolInput').value != ''){
		FSBL.Clients.WindowClient.setWindowTitle(document.getElementById('symbolInput').value)
		setDisplayMsg('setWindowTitle Successed.')
	}else
		setDisplayMsg('Input a title in the textbox at the top.')
}

function triggerSetAlwaysOnTop() {
	FSBL.Clients.WindowClient.setAlwaysOnTop(true, function (err) {
		if (!err) {
			setDisplayMsg('setAlwaysOnTop Successed.')
		}
	})
}

function triggerSendWinIdentifierForTilingOrTabbing() {
	var windowIdentifier = FSBL.Clients.WindowClient.getWindowIdentifier()
	FSBL.Clients.WindowClient.sendIdentifierForTilingOrTabbing({
		windowIdentifier: windowIdentifier
	}, function (err) {
		if (!err) {
			setDisplayMsg('sendIdentifierForTilingOrTabbing Successed.')
		}
	})
}

function triggerRestore() {
	FSBL.Clients.WindowClient.restore(function (err) {
		if (!err) {
			setDisplayMsg('restore Successed.')
		}
	})
}

function triggerRemoveComponentState() {
	FSBL.Clients.WindowClient.removeComponentState({
		fields: [{
			field: 'testField1'
		}, {
			field: 'testField2'
		}]
	}, function (err) {
		if (!err) {
			setDisplayMsg('removeComponentState Successed.')
		}
	})
}

function triggerMinimize() {
	FSBL.Clients.WindowClient.minimize(function (err) {
		if (!err) {
			setDisplayMsg('minimize Successed.')
		}
	})
}

function triggerMaximize() {
	FSBL.Clients.WindowClient.maximize(function (err) {
		if (!err) {
			setDisplayMsg('maximize Successed.')
		}
	})
}

function triggerInjectHeader() {
	FSBL.Clients.WindowClient.injectHeader({}, function (err) {
		setDisplayMsg('injectHeader Successed.')
	})
}

function triggerEstHeaderCommandChannel() {
	FSBL.Clients.WindowClient.headerCommandChannel(function (err, header) {
		setDisplayMsg('triggerHeaderCommandChannel successed.', header, true)
	})
	setDisplayMsg('triggerEstHeaderCommandChannel successed.')
}

function triggerGetWindowTitle() {
	var windowTitle = FSBL.Clients.WindowClient.getWindowTitle()
	if (windowTitle)
		setDisplayMsg('getWindowTitle Successed. Window Title: ' + windowTitle)
}

function triggerGetWindowNameForDocking() {
	var windowName = FSBL.Clients.WindowClient.getWindowNameForDocking()
	if (windowName) {
		setDisplayMsg('getWindowNameForDocking Successed. Window Name: ' + windowName)
	}
}

function triggerGetWindowIdentifier() {
	var windowIdentifier = FSBL.Clients.WindowClient.getWindowIdentifier()
	if (windowIdentifier) {
		setDisplayMsg('getWindowIdentifier Successed.', windowIdentifier)
	}
}

function triggerGetWindowsGroup() {
	var windowGroups = FSBL.Clients.WindowClient.getWindowGroups()
	if (windowGroups) {
		setDisplayMsg('getWindowGroups Successed.', windowGroups)
	}
}

function triggerGetStackedWindow() {
	FSBL.Clients.WindowClient.getStackedWindow({}, function (err, stackedWindow) {
		if (!err) {
			setDisplayMsg('triggerGetStackedWindow Successed. ', stackedWindow)
		}
	})
}

function triggerGetSpawnData() {
	var spawnData = FSBL.Clients.WindowClient.getSpawnData()
	if (spawnData) {
		setDisplayMsg('Successed.', spawnData)
	}
}

function triggerGetCurWin() {
	var currentWindow = FSBL.Clients.WindowClient.getCurrentWindow()
	if (currentWindow) {
		setDisplayMsg('Successed.', currentWindow)
	}
}

function triggerSetComponentState() {
	if (document.getElementById('symbolInput').value != '')
		FSBL.Clients.WindowClient.setComponentState({
				fields: [{
					field: 'testField1',
					value: document.getElementById('symbolInput').value
				}, {
					field: 'testField2',
					value: document.getElementById('symbolInput').value
				}]
			},
			function (err) {
				if (!err) {
					setDisplayMsg('setComponentState Successed.')
				}
			})
	else
		setDisplayMsg('Input a value in the textbox at the top.')
}

function triggerGetComponentState() {
	FSBL.Clients.WindowClient.getComponentState({
		fields: ['testField1', 'testField2']
	}, function (err, state) {
		if (!err) {
			setDisplayMsg('getComponentState Successed.', state)
		}else
			setDisplayMsg('getComponentState err',err)
		
	})
}

function triggerGetBounds() {
	FSBL.Clients.WindowClient.getBounds(function (err, bounds) {
		if (!err) {
			setDisplayMsg('Successed.', bounds)
		}
	})
}

function triggerFitToDom() {
	FSBL.Clients.WindowClient.fitToDOM({
		maxHeight: 300,
		maxWidth: 300,
		padding: {
			height: 100,
			wdith: 100
		}
	}, function (err) {
		if (!err) {
			setDisplayMsg('triggerFitToDom Successed.')
		}
	})
}

function triggerCloseWindow() {
	FSBL.Clients.WindowClient.close(false);
}

function triggerCancelTilingOrTabbing() {
	FSBL.Clients.WindowClient.cancelTilingOrTabbing({
		windowIdentifier: FSBL.Clients.WindowClient.getWindowIdentifier()
	}, function (err) {
		if (!err) {
			setDisplayMsg('cancelTilingOrTabbing Successed.')
		}
	})
}

function triggerBringWindowToFront() {
	FSBL.Clients.WindowClient.bringWindowToFront()
	setDisplayMsg('bringWindowToFront Successed.')
}

/* Storage client functions */
function triggerGetStorageValue() {
	FSBL.Clients.StorageClient.get({
		topic: "finsemble",
		key: "testKey"
	}, function (err, val) {
		if (!err) {
			setDisplayMsg('Topic: finsemble, Key: testKey, value: ' + val)
		}
	})
}

function triggerGetStorageKeys() {
	FSBL.Clients.StorageClient.keys({
		topic: "finsemble"
	}, function (err, keys) {
		if (!err) {
			setDisplayMsg('Successed. Check latest key and value in indexedDB for detail. (Developer Tools->Application->Storage->IndexedDB->fsbl)', keys)
		}
	})
}

function triggerRemoveStorageValue() {
	FSBL.Clients.StorageClient.remove({
		topic: "finsemble",
		key: "testKey"
	}, function (err) {
		if (!err)
			setDisplayMsg('Successed. Check latest key and value in indexedDB for detail. (Developer Tools->Application->Storage->IndexedDB->fsbl)')
	})
}

function triggerSaveStorageValue() {
	if (document.getElementById('symbolInput').value != '')
		FSBL.Clients.StorageClient.save({
			topic: "finsemble",
			key: "testKey",
			value: document.getElementById('symbolInput').value
		}, function (err) {
			if (!err)
				setDisplayMsg('Successed. Check latest key and value in indexedDB for detail. (Developer Tools->Application->Storage->IndexedDB->fsbl)')
		})
	else
		setDisplayMsg('Input a value in the textbox at the top.')
}

function triggerSetStorageStore() {
	FSBL.Clients.StorageClient.setStore({
		topic: "local",
		dataStore: "LocalStorageAdapter"
	}, function (err) {
		if (!err)
			setDisplayMsg('Successed. Check latest key and value in indexedDB for detail. (Developer Tools->Application->Storage->IndexedDB->fsbl)')
	})
}

function triggerSetStorageUser() {
	FSBL.Clients.StorageClient.setUser({
		user: 'testUser'
	}, function (err) {
		if (!err)
			setDisplayMsg('Successed. Check latest key and value in indexedDB for detail. (Developer Tools->Application->Storage->IndexedDB->fsbl) After checking, please reset using "Reset" in the function menu otherwise other functions may not work properly.')
	})
}

/* Distributed store client functions */
function triggerSetStoreValue(field) {
	if (document.getElementById('symbolInput').value != '')
		if (dsStore)
			dsStore.setValue({
				field: field,
				value: document.getElementById('symbolInput').value
			}, function (err) {
				setDisplayMsg('Value set for ' + field)
			})
	else
		setDisplayMsg('Please create distributed store.')
	else
		setDisplayMsg('Input a value in the textbox at the top.')
}

function triggerGetStoreValue() {
	if (dsStore)
		dsStore.getValue({
			field: 'field1'
		}, function (err, value) {
			setDisplayMsg('Field1: ' + value)
		})
	else
		setDisplayMsg('Please create distributed store.')
}

function triggerRemoveStore() {
	FSBL.Clients.DistributedStoreClient.removeStore({
		store: 'testDs1',
	}, function (err) {
		if (!err)
			setDisplayMsg('testDs1 removed.')
		else
			setDisplayMsg('No such store.')
	})
}

function triggerGetStore() {
	FSBL.Clients.DistributedStoreClient.getStore({
		store: 'testDs1',
	}, function (err, store) {
		if (!err) {
			setDisplayMsg('GetStore Successed.', store)
		} else
			setDisplayMsg('No such store.')
	})
}

function triggerCreateStore() {
	FSBL.Clients.DistributedStoreClient.createStore({
		store: 'testDs1',
		global: true,
		values: {
			field1: 'testdata1',
			field2: 'testdata2'
		}
	}, function (err, store) {
		if (!err) {
			dsStore = store
			setDisplayMsg('testDs1 created.', store)
		}
	})
}

/* Workspace client functions */
function triggerSwitchToWorkspace() {
	if (document.getElementById('symbolInput').value != '')
		FSBL.Clients.WorkspaceClient.switchTo({
			name: document.getElementById('symbolInput').value
		}, function (err, response) {
			if (!err) {
				setDisplayMsg('Switched.')
			}
		})
	else
		setDisplayMsg('Input a name in the textbox at the top.')
}

function triggerSaveAsWorkspace() {
	if (document.getElementById('symbolInput').value != '')
		FSBL.Clients.WorkspaceClient.saveAs({
			name: document.getElementById('symbolInput').value
		}, function (err, response) {
			if (!err) {
				setDisplayMsg('Saved.')
			}
		})
	else
		setDisplayMsg('Input a name in the textbox at the top.')
}

function triggerSaveWorkspace() {
	FSBL.Clients.WorkspaceClient.save(function (err, response) {
		if (!err) {
			setDisplayMsg('Saved.')
		}
	})
}

function triggerRenameWorkspace() {
	if (document.getElementById('symbolInput').value != '')
		FSBL.Clients.WorkspaceClient.getActiveWorkspace(function (err, response) {
			if (!err) {
				FSBL.Clients.WorkspaceClient.rename({
					oldName: response.data.name,
					newName: document.getElementById('symbolInput').value
				}, function (err, response) {
					if (!err) {
						setDisplayMsg('rename current workspace Successed.')
					}
				})
			}
		})
	else
		setDisplayMsg('Input a name in the textbox at the top.')
}

function triggerRemoveWorkspace() {
	if (document.getElementById('symbolInput').value != '')
		FSBL.Clients.WorkspaceClient.remove({
			name: document.getElementById('symbolInput').value
		}, function (err, response) {
			if (!err) {
				setDisplayMsg('remove workspace Successed.')
			} else {
				setDisplayMsg('Workspace not found.')
			}
		})
	else
		setDisplayMsg('Input a name in the textbox at the top.')
}

function triggerMinimizeAll() {
	FSBL.Clients.WorkspaceClient.minimizeAll({}, function (err) {
		if (!err) {
			setDisplayMsg('minimizeAll successed.')
		}
	})
}


function triggerImportWorkspace() {
	FSBL.Clients.WorkspaceClient.getActiveWorkspace(function (err, response) {
		if (!err) {
			FSBL.Clients.WorkspaceClient.export({
				workspaceName: response.data.name
			}, function (err, workspaceDefinition) {
				if (!err) {
					FSBL.Clients.WorkspaceClient.import({
						force: false,
						workspaceJSONDefinition: workspaceDefinition
					}, function (err) {
						if (!err)
							setDisplayMsg('import Successed.')
					})
				}
			})
		}
	})
}

function triggerGetWorkspaces() {
	FSBL.Clients.WorkspaceClient.getWorkspaces(function (err, response) {
		if (!err) {
			setDisplayMsg('getWorkspaces Successed.', response)
		}
	})
}

function triggerGetActiveWorkspace() {
	FSBL.Clients.WorkspaceClient.getActiveWorkspace(function (err, response) {
		if (!err) {
			setDisplayMsg('Successed.', response)
		}
	})
}

function triggerExportWorkspace() {
	if (document.getElementById('symbolInput').value != '')
		FSBL.Clients.WorkspaceClient.export({
			workspaceName: document.getElementById('symbolInput').value
		}, function (err, workspaceDefinition) {
			if (!err) {
				setDisplayMsg('Workspace definition exported.', workspaceDefinition)
			}
		})
	else
		setDisplayMsg('Input a name in the textbox at the top.')
}

function triggerCreateWorkspace() {
	if (document.getElementById('symbolInput').value != '')
		FSBL.Clients.WorkspaceClient.createWorkspace(document.getElementById('symbolInput').value, {}, function (err, response) {
			if (!err) {
				setDisplayMsg('createWorkspace successed', response)
			}
		})
	else
		setDisplayMsg('Input a name in the textbox at the top.')
}

function triggerBringWinsToFront() {
	FSBL.Clients.WorkspaceClient.bringWindowsToFront({}, function (err, response) {
		setDisplayMsg('bringWindowsToFront successed', response)
	})
}

function triggerAutoArrange() {
	FSBL.Clients.WorkspaceClient.autoArrange({}, function (err, response) {
		if(!err)
			setDisplayMsg('autoArrange successed',response)
	})
}

/* Router client functions */
function triggerDisconnectAll() {
	FSBL.Clients.RouterClient.disconnectAll()
	setDisplayMsg('Disconnected all.')
}

function triggerTransmit() {
	if (document.getElementById('symbolInput').value != '') {
		FSBL.Clients.RouterClient.transmit('symbol', {
			'data': document.getElementById('symbolInput').value
		})
		setDisplayMsg('Transmitted.')
	} else {
		setDisplayMsg('Input a value in the textbox at the top.')
	}
}

function triggerQuery() {
	FSBL.Clients.RouterClient.query("symbol", {
		queryKey: "abc123"
	}, {
		timeout: 1000
	}, function (error, queryResponseMessage) {
		if (!error) {
			// process income query response message
			setDisplayMsg("Router client query respond: " + queryResponseMessage.data)
		} else {
			setDisplayMsg("Please add a Router Responder in 'API Test 2' component.")
		}
	});
}

function triggerPublish() {
	if (document.getElementById('symbolInput').value != '') {
		FSBL.Clients.RouterClient.publish('symbol', {
			'symbol': document.getElementById('symbolInput').value
		})
		setDisplayMsg('Published.')
	} else {
		setDisplayMsg('Input a value in the textbox at the top.')
	}
}

function triggerRemovePubSubResponder() {
	FSBL.Clients.RouterClient.removePubSubResponder('symbol')
	setDisplayMsg("Pubsub responder removed.")
}

function triggerAddPubSubResponder() {
	FSBL.Clients.RouterClient.addPubSubResponder("symbol", {
		"State": "start"
	}, {
		subscribeCallback: subscribeCallback,
		publishCallback: publishCallback,
		unsubscribeCallback: unsubscribeCallback
	});
	setDisplayMsg("Pubsub responder added.")
}

function subscribeCallback(error, subscribe) {
	if (subscribe) {
		// must make this callback to accept or reject the subscribe (default is to accept). First parm is err and second is the initial state
		setDisplayMsg(subscribe.header.origin + ' subscribed topic ' + subscribe.header.topic, null, true)
		subscribe.sendNotifyToSubscriber(null, {
			"NOTIFICATION-STATE": "One"
		});
	}
}

function publishCallback(error, publish) {
	if (publish) {
		// must make this callback to send notify to all subscribers (if error parameter set then notify will not be sent)
		setDisplayMsg(publish.header.origin + ' published topic ' + publish.header.topic, null, true)
		publish.sendNotifyToAllSubscribers(null, publish.data);
	}
}

function unsubscribeCallback(error, unsubscribe) {
	if (unsubscribe) {
		// must make this callback to acknowledge the unsubscribe
		setDisplayMsg(unsubscribe.header.origin + ' unsubscribed topic ' + unsubscribe.header.topic, null, true)
		unsubscribe.removeSubscriber();
	}
}

/* Logger client functions */
function triggerWarn() {
	FSBL.Clients.Logger.warn('APITEST_LOGGER_MSG, This is a warn message')
}

function triggerVerbose() {
	FSBL.Clients.Logger.verbose('APITEST_LOGGER_MSG, This is a verbose message')
}

function triggerLog() {
	FSBL.Clients.Logger.log('APITEST_LOGGER_MSG, This is a log message')
}

function triggerInfo() {
	FSBL.Clients.Logger.info('APITEST_LOGGER_MSG, This an info message')
}

function triggerError() {
	FSBL.Clients.Logger.error('APITEST_LOGGER_MSG, This is an error message')
}

function triggerDebug() {
	FSBL.Clients.Logger.debug('APITEST_LOGGER_MSG, This is a debug message')
}

/* Linker client functions */
function triggerLinkerPub() {
	if (document.getElementById('symbolInput').value != '')
		FSBL.Clients.LinkerClient.publish({
			dataType: "symbol",
			data: document.getElementById('symbolInput').value
		}, function (err) {
			if (!err) {
				setDisplayMsg('Published.')
			}
		})
	else
		setDisplayMsg('Input a value in the textbox at the top.')
}

function triggerOpenLinkerWindow() {
	FSBL.Clients.LinkerClient.openLinkerWindow(function (err) {
		alert('er')
		if (!err) {
			setDisplayMsg('Opened linker window.')
		}else{
			setDisplayMsg('openLinkerWindow Err', err)
		}
	})
}

function triggerStartOnStateChange() {
	FSBL.Clients.LinkerClient.onStateChange(function (err, response) {
		if (!err) {
			setDisplayMsg("Linker state changed.", response, true)
		}
	})
	setDisplayMsg('Callback function set for onLinkerStateChanged.')
}

function triggerLinkToGroup1() {
	FSBL.Clients.LinkerClient.linkToChannel("group1", null, function (err, channel) {
		if (!err) {
			setDisplayMsg('Linked to group1.', channel)
		}
	})
}

function triggerUnlinkToGroup1() {
	FSBL.Clients.LinkerClient.unlinkFromChannel("group1", null, function (err, channel) {
		if (!err) {
			setDisplayMsg('Unlinked to group1.', channel)
		}
	})
}

function triggerGetState() {
	FSBL.Clients.LinkerClient.getState(FSBL.Clients.WindowClient.getWindowIdentifier, function (err, state) {
		if (!err) {
			setDisplayMsg('Get state succeed.', state)
		}
	})
}

function triggerGetWinLinkedCurWindow() {
	FSBL.Clients.LinkerClient.getLinkedWindows(FSBL.Clients.WindowClient.getWindowIdentifier, function (err, windows) {
		if (!err) {
			setDisplayMsg(windows.length + ' windows linked with current component.', windows)
		}
	})
}

function triggerGetWinLinkedGroup1() {
	FSBL.Clients.LinkerClient.getLinkedWindows({
		channels: ['group1']
	}, function (err, windows) {
		if (!err) {
			setDisplayMsg(windows.length + ' windows linked with Group1.', windows)
		}
	})
}

function triggerGetComLinkedCurWindow() {
	FSBL.Clients.LinkerClient.getLinkedComponents(FSBL.Clients.WindowClient.getWindowIdentifier, function (err, components) {
		if (!err) {
			setDisplayMsg(components.length + ' components linked with current component.', components)
		}
	})
}

function triggerGetComLinkedGroup1() {
	FSBL.Clients.LinkerClient.getLinkedComponents({
		channels: ['group1']
	}, function (err, components) {
		if (!err) {
			setDisplayMsg(components.length + ' components linked with Group1.', components)
		}
	})
}

function triggerGetAllChannels() {
	FSBL.Clients.LinkerClient.getAllChannels(function (err, channels) {
		if (!err) {
			setDisplayMsg(channels.length + ' Linker channels found.', channels)
		}
	})
}


/* Launcher client functions */
function triggerGetActiveDescriptors() {
	FSBL.Clients.LauncherClient.getActiveDescriptors(function (err, desc) {
		if (!err) {
			setDisplayMsg('There are ' + Object.keys(desc).length + ' window descriptors.', desc)
		}
	})
}

function triggerGetComponentDefaultConfig() {
	FSBL.Clients.LauncherClient.getComponentDefaultConfig('API Test 1', function (err, config) {
		if (!err) {
			setDisplayMsg('"API Test 1" component found.', config)
		}
	})
}

function triggerGetComponentList() {
	FSBL.Clients.LauncherClient.getComponentList(function (err, componentList) {
		if (!err) {
			setDisplayMsg('Component list found.', componentList)
		}
	})
}

function triggerGetComponentsThatCanReceiveDataTypes() {
	//This function cooperate with field "advertiseReceivers" in component.json which should be deprecated
	FSBL.Clients.LauncherClient.getComponentsThatCanReceiveDataTypes({
		dataTypes: ['symbol']
	}, function (err, componentList) {
		if (!err) {
			setDisplayMsg('Component list found.', componentList)
		}
	})
}

function triggerGetMonitorInfo() {
	FSBL.Clients.LauncherClient.getMonitorInfo({}, function (err, monitorList) {
		if (!err) {
			setDisplayMsg('Monitor list found.', monitorList)
		}
	})
}

function triggerGetMonitorInfoAll() {
	FSBL.Clients.LauncherClient.getMonitorInfoAll(function (err, monitorList) {
		if (!err) {
			setDisplayMsg('Monitor list found.', monitorList)
		}
	})
}

function triggerGetMyWindowIdentifier() {
	//Should the cb able to return 'err'?
	FSBL.Clients.LauncherClient.getMyWindowIdentifier(function (windowIdentifer) {
		if (windowIdentifer) {
			setDisplayMsg('Window Identifer found.', windowIdentifer)
		}
	})
}

function triggerRegisterComponent() {
	FSBL.Clients.LauncherClient.registerComponent({
		componentType: 'testRegisterComponent',
		manifest: {
			window: {
				url: "https://google.com",
				"width": 800,
				"height": 600
			},
			"foreign": {
				"services": {
					"dockingService": {
						"canGroup": true,
						"isArrangable": true
					}
				},
				"components": {
					"App Launcher": {
						"launchableByUser": true
					},
					"Window Manager": {
						"title": "testRegisterComponent",
						"FSBLHeader": true,
						"persistWindowState": true,
						"showLinker": true
					},
					"Toolbar": {
						"iconClass": "test"
					}
				}
			}
		}
	}, function (err) {
		if (!err) {
			setDisplayMsg("Registered Component.")
		}
	})
}

function triggerUnregisterComponent() {
	FSBL.Clients.LauncherClient.unRegisterComponent({
		componentType: 'testRegisterComponent'
	}, function (err) {
		if (!err) {
			setDisplayMsg("Unregistered Component.")
		}
	})
}

function triggerSpawnComponent() {
	FSBL.Clients.LauncherClient.spawn('API Test 2', {
			addToWorkspace: true,
			left: "adjacent",
			spawnIfNotFound: true,
			data: {}
		},
		function (err, response) {
			if (!err) {
				test2SpawnResopnse = response
			} else
				setDisplayMsg('Spawn error')
		})
}

function triggerShowWindow() {
	var windowIdentifier = {
		componentType: "API Test 2",
		windowName: FSBL.Clients.WindowClient.options.name + ".apitest2"
	};

	FSBL.Clients.LauncherClient.showWindow(
		windowIdentifier, {
			addToWorkspace: true,
			left: "adjacent",
			spawnIfNotFound: true,
			data: {}
		},
		function (err, response) {
			if (!err) {
				test2SpawnResopnse = response
			} else {
				setDisplayMsg("Window can only shown once.")
			}
		}
	);
}




/* Global Hotkey functions*/
function registerGlobalHotkey() {
	const keys = [keyMap.ctrl, keyMap.q];
	FSBL.Clients.HotkeyClient.addGlobalHotkey(keys, onGlobalHotkeyTriggered, onGlobalHotkeyRegistered);
}

function unregisterGlobalHotkey() {
	const keys = [keyMap.ctrl, keyMap.q];
	FSBL.Clients.HotkeyClient.removeGlobalHotkey(keys, onGlobalHotkeyTriggered, onGlobalHotkeyUnregistered);
}

function onGlobalHotkeyTriggered(err, response) {
	if (!err)
		setDisplayMsg("Pressed Global Ctrl + Q");
}

function onGlobalHotkeyRegistered(err, response) {
	if (!err)
		setDisplayMsg("Registered global hotkey Ctrl + Q");
}

function onGlobalHotkeyUnregistered(err, response) {
	if (!err)
		setDisplayMsg("Unregistered global hotkey Ctrl + Q");
}

/* Local Hotkey functions*/
function registerLocalHotkey() {
	const keys = [keyMap.ctrl, keyMap.q];
	FSBL.Clients.HotkeyClient.addLocalHotkey(keys, onLocalHotkeyTriggered, onLocalHotkeyRegistered);
}

function onLocalHotkeyTriggered(err, response) {
	if (!err)
		setDisplayMsg("Pressed local Ctrl + Q");
}

function onLocalHotkeyRegistered(err, response) {
	if (!err)
		setDisplayMsg("Registered local hotkey Ctrl + Q");
}

function unregisterLocalHotkey() {
	const keys = [keyMap.ctrl, keyMap.q];
	FSBL.Clients.HotkeyClient.removeLocalHotkey(keys, onLocalHotkeyTriggered, onLocalHotkeyUnregistered);
}

function onLocalHotkeyUnregistered(err, response) {
	if (!err)
		setDisplayMsg("Unregistered local hotkey Ctrl + Q");
}

/* notification */
function triggerNotification() {
	FSBL.UserNotification.alert("system", "ALWAYS", "TEST1", "Test Notification", {
		"duration": 5000
	});
}


function setupEmitter() {
	FSBL.Clients.DragAndDropClient.setEmitters({
		emitters: [{
			type: "symbol",
			data: getSymbol
		},{
			type: "symbol1",
			data: getSymbol
		}]
	});
}

function getSymbol() {
	return document.getElementById('symbolInput').value
}



function setDisplayMsg(msg, respondObj, append) {
	if (append)
		document.getElementById('displayMsg1').value += '\n\n' + msg + '\n\n'
	else
		document.getElementById('displayMsg1').value = msg + '\n\n'
	if (respondObj)
		document.getElementById('displayMsg1').value += JSON.stringify(respondObj, null, "\t");
}



if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady);
} else {
	window.addEventListener("FSBLReady", FSBLReady);
}

function FSBLReady() {
	renderPage();
	setupEmitter();
}