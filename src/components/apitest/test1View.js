function renderPage() {
	/* Setup dragevent listener for inputbox */
	document.getElementById('symbolInput').addEventListener('dragstart', function (event) {
		const data = {
			'rsrchx.report': {
				symbol: event.target.value
			},
			'symbol': event.target.value
		};
		FSBL.Clients.DragAndDropClient.dragStartWithData(event, data);
	})

	FSBL.Clients.RouterClient.onReady(function () {
		document.getElementById('displayMsg1').value = 'RouterClient is ready'
	})

	document.getElementById('dsBtn').click()

	/* Global hotkey button */
	const registerGlobalHotKey = $("<registerGlobalHotKey class='functionBtn'>Register Global Ctrl+Q</registerGlobalHotKey><br/>");
	registerGlobalHotKey.click(function () {
		registerGlobalHotkey();
	});
	$("#Hotkeys").append(registerGlobalHotKey);

	const unregisterGlobalHotKey = $("<unregisterGlobalHotKey class='functionBtn'>Unregister Global Ctrl+Q</unregisterGlobalHotKey><br/>");
	unregisterGlobalHotKey.click(function () {
		unregisterGlobalHotkey();
	});
	$("#Hotkeys").append(unregisterGlobalHotKey);

	/* Local hotkey button */
	const registerLocalHotKey = $("<registerLocalHotKey class='functionBtn'>Register Local Ctrl+Q</registerLocalHotKey><br/>");
	registerLocalHotKey.click(function () {
		registerLocalHotkey();
	});
	$("#Hotkeys").append(registerLocalHotKey);

	const unregisterLocalHotKey = $("<unregisterLocalHotKey class='functionBtn'>Unregister Local Ctrl+Q</unregisterLocalHotKey><br/>");
	unregisterLocalHotKey.click(function () {
		unregisterLocalHotkey();
	});
	$("#Hotkeys").append(unregisterLocalHotKey);

	/* Notification buttons */
	const notification = $("<notification class='functionBtn'>Trigger Notification</notification><br/>");
	notification.click(function () {
		triggerNotification();
	});
	$("#Notification").append(notification);

	/* LauncherClient buttons */
	const getActiveDescriptors = $("<getActiveDescriptors class='functionBtn'>Get Active Descriptor</getActiveDescriptors><br/>");
	getActiveDescriptors.click(function () {
		triggerGetActiveDescriptors();
	});
	$("#Launcher").append(getActiveDescriptors);
	const getComponentDefaultConfig = $("<getComponentDefaultConfig class='functionBtn'>Get Component Default Config</getComponentDefaultConfig><br/>");
	getComponentDefaultConfig.click(function () {
		triggerGetComponentDefaultConfig();
	});
	$("#Launcher").append(getComponentDefaultConfig);
	const getComponentList = $("<getComponentList class='functionBtn'>Get Component List</getComponentList><br/>");
	getComponentList.click(function () {
		triggerGetComponentList();
	});
	$("#Launcher").append(getComponentList);
	const getComponentsThatCanReceiveDataTypes = $("<getComponentsThatCanReceiveDataTypes class='functionBtn'>Get Components That Can Receive Data Types</getComponentsThatCanReceiveDataTypes><br/>");
	getComponentsThatCanReceiveDataTypes.click(function () {
		triggerGetComponentsThatCanReceiveDataTypes();
	});
	$("#Launcher").append(getComponentsThatCanReceiveDataTypes);
	const getMonitorInfo = $("<getMonitorInfo class='functionBtn'>Get Monitor Info</getMonitorInfo><br/>");
	getMonitorInfo.click(function () {
		triggerGetMonitorInfo();
	});
	$("#Launcher").append(getMonitorInfo);
	const getMonitorInfoAll = $("<getMonitorInfoAll class='functionBtn'>Get Monitor Info All</getMonitorInfoAll><br/>");
	getMonitorInfoAll.click(function () {
		triggerGetMonitorInfoAll();
	});
	$("#Launcher").append(getMonitorInfoAll);
	const getMyWindowIdentifier = $("<getMyWindowIdentifier class='functionBtn'>Get My Window Identifer</getMyWindowIdentifier><br/>");
	getMyWindowIdentifier.click(function () {
		triggerGetMyWindowIdentifier();
	});
	$("#Launcher").append(getMyWindowIdentifier);
	const registerComponent = $("<registerComponent class='functionBtn'>Register Component</registerComponent><br/>");
	registerComponent.click(function () {
		triggerRegisterComponent();
	});
	$("#Launcher").append(registerComponent);
	const unregisterComponent = $("<unregisterComponent class='functionBtn'>Unregister Component</unregisterComponent><br/>");
	unregisterComponent.click(function () {
		triggerUnregisterComponent();
	});
	$("#Launcher").append(unregisterComponent);
	const spawnComponent = $("<spawnComponent class='functionBtn'>Spawn Component</spawnComponent><br/>");
	spawnComponent.click(function () {
		triggerSpawnComponent();
	});
	$("#Launcher").append(spawnComponent);
	const showWindow = $("<showWindow class='functionBtn'>Show Window</showWindow><br/>");
	showWindow.click(function () {
		triggerShowWindow();
	});
	$("#Launcher").append(showWindow);

	/* Linker Client buttons */
	const getAllChannels = $("<getAllChannels class='functionBtn'>Get All Channels</getAllChannels><br/>");
	getAllChannels.click(function () {
		triggerGetAllChannels();
	});
	$("#Linker").append(getAllChannels);
	const getComLinkedGroup1 = $("<getComLinkedGroup1 class='functionBtn'>Get Components Linked with Group1</getComLinkedGroup1><br/>");
	getComLinkedGroup1.click(function () {
		triggerGetComLinkedGroup1();
	});
	$("#Linker").append(getComLinkedGroup1);
	const getComLinkedCurWindow = $("<getComLinkedCurWindow class='functionBtn'>Get Components Linked with Current window</getComLinkedCurWindow><br/>");
	getComLinkedCurWindow.click(function () {
		triggerGetComLinkedCurWindow();
	});
	$("#Linker").append(getComLinkedCurWindow);
	const getWinLinkedGroup1 = $("<getWinLinkedGroup1 class='functionBtn'>Get Windows Linked with Group1</getWinLinkedGroup1><br/>");
	getWinLinkedGroup1.click(function () {
		triggerGetWinLinkedGroup1();
	});
	$("#Linker").append(getWinLinkedGroup1);
	const getWinLinkedCurWindow = $("<getWinLinkedCurWindow class='functionBtn'>Get Windows Linked with Current window</getWinLinkedCurWindow><br/>");
	getWinLinkedCurWindow.click(function () {
		triggerGetWinLinkedCurWindow();
	});
	$("#Linker").append(getWinLinkedCurWindow);
	const getState = $("<getState class='functionBtn'>Get State of Current window</getState><br/>");
	getState.click(function () {
		triggerGetState();
	});
	$("#Linker").append(getState);
	const linkToGroup1 = $("<linkToGroup1 class='functionBtn'>Link to Group1</linkToGroup1><br/>");
	linkToGroup1.click(function () {
		triggerLinkToGroup1();
	});
	$("#Linker").append(linkToGroup1);
	const linkerPub = $("<linkerPub class='functionBtn'>Linker Publish</linkerPub><br/>");
	linkerPub.click(function () {
		triggerLinkerPub();
	});
	$("#Linker").append(linkerPub);
	
	const startOnStateChange = $("<startOnStateChange class='functionBtn'>Start on state change</startOnStateChange><br/>");
	startOnStateChange.click(function () {
		triggerStartOnStateChange();
	});
	$("#Linker").append(startOnStateChange);
	const openLinkerWindow = $("<openLinkerWindow class='functionBtn'>Open Linker Window</openLinkerWindow><br/>");
	openLinkerWindow.click(function () {
		triggerOpenLinkerWindow();
	});
	$("#Linker").append(openLinkerWindow);
	const unlinkToGroup1 = $("<unlinkToGroup1 class='functionBtn'>Unlink to Group1</unlinkToGroup1><br/>");
	unlinkToGroup1.click(function () {
		triggerUnlinkToGroup1();
	});
	$("#Linker").append(unlinkToGroup1);

	/* Logger Client buttons */
	const debug = $("<debug class='functionBtn'>Debug</debug><br/>");
	debug.click(function () {
		triggerDebug();
	});
	$("#Logger").append(debug);
	const error = $("<error class='functionBtn'>Error</error><br/>");
	error.click(function () {
		triggerError();
	});
	$("#Logger").append(error);
	const info = $("<info class='functionBtn'>Info</info><br/>");
	info.click(function () {
		triggerInfo();
	});
	$("#Logger").append(info);
	const log = $("<log class='functionBtn'>Log</log><br/>");
	log.click(function () {
		triggerLog();
	});
	$("#Logger").append(log);
	const verbose = $("<verbose class='functionBtn'>Verbose</verbose><br/>");
	verbose.click(function () {
		triggerVerbose();
	});
	$("#Logger").append(verbose);
	const warn = $("<warn class='functionBtn'>Warn</warn><br/>");
	warn.click(function () {
		triggerWarn();
	});
	$("#Logger").append(warn);

	/* Router client buttons */
	const addPubSubResponder = $("<addPubSubResponder class='functionBtn'>Add Pub Sub Responder</addPubSubResponder><br/>");
	addPubSubResponder.click(function () {
		triggerAddPubSubResponder();
	});
	$("#Router").append(addPubSubResponder);
	const removePubSubResponder = $("<removePubSubResponder class='functionBtn'>Remove Pub Sub Responder</removePubSubResponder><br/>");
	removePubSubResponder.click(function () {
		triggerRemovePubSubResponder();
	});
	$("#Router").append(removePubSubResponder);
	const publish = $("<publish class='functionBtn'>Publish</publish><p class='instruct'>Subscribe in 'API Testing 2' before publish</p><br/>");
	publish.click(function () {
		triggerPublish();
	});
	$("#Router").append(publish);
	const query = $("<query class='functionBtn'>Query</query><p class='instruct'>Add RESPONDER in 'API Testing 2' before query</p><br/>");
	query.click(function () {
		triggerQuery();
	});
	$("#Router").append(query);
	const transmit = $("<transmit class='functionBtn'>Transmit</transmit><p class='instruct'>Add LISTENER in 'API Testing 2' before publish</p><br/>");
	transmit.click(function () {
		triggerTransmit();
	});
	$("#Router").append(transmit);
	const disconnectAll = $("<disconnectAll class='functionBtn'>Disconnect all</disconnectAll><br/>");
	disconnectAll.click(function () {
		triggerDisconnectAll();
	});
	$("#Router").append(disconnectAll);

	/* Workspace client buttons */
	const autoArrange = $("<autoArrange class='functionBtn'>Auto Arrange</autoArrange><br/>");
	autoArrange.click(function () {
		triggerAutoArrange();
	});
	$("#Workspace").append(autoArrange);
	const bringWinsToFront = $("<bringWinsToFront class='functionBtn'>Bring Windows To Front</bringWinsToFront><br/>");
	bringWinsToFront.click(function () {
		triggerBringWinsToFront();
	});
	$("#Workspace").append(bringWinsToFront);
	const createWorkspace = $("<createWorkspace class='functionBtn'>Create Workspace</createWorkspace><br/>");
	createWorkspace.click(function () {
		triggerCreateWorkspace();
	});
	$("#Workspace").append(createWorkspace);
	const exportWorkspace = $("<exportWorkspace class='functionBtn'>Export Workspace</exportWorkspace><br/>");
	exportWorkspace.click(function () {
		triggerExportWorkspace();
	});
	$("#Workspace").append(exportWorkspace);
	const getActiveWorkspace = $("<getActiveWorkspace class='functionBtn'>Get Active Workspace</getActiveWorkspace><br/>");
	getActiveWorkspace.click(function () {
		triggerGetActiveWorkspace();
	});
	$("#Workspace").append(getActiveWorkspace);
	const getWorkspaces = $("<getWorkspaces class='functionBtn'>Get Workspaces</getWorkspaces><br/>");
	getWorkspaces.click(function () {
		triggerGetWorkspaces();
	});
	$("#Workspace").append(getWorkspaces);
	const importWorkspace = $("<importWorkspace class='functionBtn'>Import Workspace</importWorkspace><br/>");
	importWorkspace.click(function () {
		triggerImportWorkspace();
	});
	$("#Workspace").append(importWorkspace);
	const minimizeAll = $("<minimizeAll class='functionBtn'>Minimize All</minimizeAll><br/>");
	minimizeAll.click(function () {
		triggerMinimizeAll();
	});
	$("#Workspace").append(minimizeAll);
	const removeWorkspace = $("<removeWorkspace class='functionBtn'>Remove Workspace</removeWorkspace><br/>");
	removeWorkspace.click(function () {
		triggerRemoveWorkspace();
	});
	$("#Workspace").append(removeWorkspace);
	const renameWorkspace = $("<renameWorkspace class='functionBtn'>Rename Workspace</renameWorkspace><br/>");
	renameWorkspace.click(function () {
		triggerRenameWorkspace();
	});
	$("#Workspace").append(renameWorkspace);
	const saveWorkspace = $("<saveWorkspace class='functionBtn'>Save Workspace</saveWorkspace><br/>");
	saveWorkspace.click(function () {
		triggerSaveWorkspace();
	});
	$("#Workspace").append(saveWorkspace);
	const saveAsWorkspace = $("<saveAsWorkspace class='functionBtn'>Save As Workspace</saveAsWorkspace><br/>");
	saveAsWorkspace.click(function () {
		triggerSaveAsWorkspace();
	});
	$("#Workspace").append(saveAsWorkspace);
	const switchToWorkspace = $("<switchToWorkspace class='functionBtn'>Switch To Workspace</switchToWorkspace><br/>");
	switchToWorkspace.click(function () {
		triggerSwitchToWorkspace();
	});
	$("#Workspace").append(switchToWorkspace);

	/* Distributed Store Client buttons*/
	const createStore = $("<createStore class='functionBtn'>Create Store</createStore><br/>");
	createStore.click(function () {
		triggerCreateStore();
	});
	$("#DistributedStore").append(createStore);
	const getStore = $("<getStore class='functionBtn'>Get Store</getStore><br/>");
	getStore.click(function () {
		triggerGetStore();
	});
	$("#DistributedStore").append(getStore);


	const getStoreValue = $("<getStoreValue class='functionBtn'>Get Store Value</getStoreValue><br/>");
	getStoreValue.click(function () {
		triggerGetStoreValue();
	});
	$("#DistributedStore").append(getStoreValue);
	const setStoreValue1 = $("<setStoreValue1 class='functionBtn'>Set Store Value field1</setStoreValue1><br/>");
	setStoreValue1.click(function () {
		triggerSetStoreValue('field1');
	});
	$("#DistributedStore").append(setStoreValue1);
	const setStoreValue2 = $("<setStoreValue2 class='functionBtn'>Set Store Value field2</setStoreValue2><br/>");
	setStoreValue2.click(function () {
		triggerSetStoreValue('field2');
	});
	$("#DistributedStore").append(setStoreValue2);
	const removeStore = $("<removeStore class='functionBtn'>Remove Store</removeStore><br/>");
	removeStore.click(function () {
		triggerRemoveStore();
	});
	$("#DistributedStore").append(removeStore);

	/* Storage client buttons */
	const setStorageUser = $("<setStorageUser class='functionBtn'>Set User</setStorageUser><p class='instruct'>please reset in the function menu after validation.</p><br/>");
	setStorageUser.click(function () {
		triggerSetStorageUser();
	});
	$("#Storage").append(setStorageUser);
	const setStorageStore = $("<setStorageStore class='functionBtn'>Set Store</setStorageStore><br/>");
	setStorageStore.click(function () {
		triggerSetStorageStore();
	});
	$("#Storage").append(setStorageStore);
	const saveStorageValue = $("<saveStorageValue class='functionBtn'>Save Value</saveStorageValue><br/>");
	saveStorageValue.click(function () {
		triggerSaveStorageValue();
	});
	$("#Storage").append(saveStorageValue);
	const getStorageValue = $("<getStorageValue class='functionBtn'>Get Storage Value</getStorageValue><br/>");
	getStorageValue.click(function () {
		triggerGetStorageValue();
	});
	$("#Storage").append(getStorageValue);
	const getStorageKeys = $("<getStorageKeys class='functionBtn'>Get Storage Keys</getStorageKeys><br/>");
	getStorageKeys.click(function () {
		triggerGetStorageKeys();
	});
	$("#Storage").append(getStorageKeys);
	const removeStorageValue = $("<removeStorageValue class='functionBtn'>Remove Value</removeStorageValue><br/>");
	removeStorageValue.click(function () {
		triggerRemoveStorageValue();
	});
	$("#Storage").append(removeStorageValue);
	
	/* WindowClient buttons */
	const bringWindowToFront = $("<bringWindowToFront class='functionBtn'>Bring Windows To Front</bringWindowToFront><br/>");
	bringWindowToFront.click(function () {
		triggerBringWindowToFront();
	});
	$("#Windows").append(bringWindowToFront);
	const cancelTilingOrTabbing = $("<cancelTilingOrTabbing class='functionBtn'>Cancel Tiling or Tabbing</cancelTilingOrTabbing><br/>");
	cancelTilingOrTabbing.click(function () {
		triggerCancelTilingOrTabbing();
	});
	$("#Windows").append(cancelTilingOrTabbing);
	const closeWindow = $("<closeWindow class='functionBtn'>Close Window</closeWindow><br/>");
	closeWindow.click(function () {
		triggerCloseWindow();
	});
	$("#Windows").append(closeWindow);
	const fitToDom = $("<fitToDom class='functionBtn'>Fit to Dom</fitToDom><br/>");
	fitToDom.click(function () {
		triggerFitToDom();
	});
	$("#Windows").append(fitToDom);
	const getBounds = $("<getBounds class='functionBtn'>Get Bounds</getBounds><br/>");
	getBounds.click(function () {
		triggerGetBounds();
	});
	$("#Windows").append(getBounds);

	const setComponentState = $("<setComponentState class='functionBtn'>Set Component State</setComponentState><br/>");
	setComponentState.click(function () {
		triggerSetComponentState();
	});
	$("#Windows").append(setComponentState);
	const getComponentState = $("<getComponentState class='functionBtn'>Get Component State</getComponentState><br/>");
	getComponentState.click(function () {
		triggerGetComponentState();
	});
	$("#Windows").append(getComponentState);
	const removeComponentState = $("<removeComponentState class='functionBtn'>Remove Component State</removeComponentState><br/>");
	removeComponentState.click(function () {
		triggerRemoveComponentState();
	});
	$("#Windows").append(removeComponentState);
	const getCurWin = $("<getCurWin class='functionBtn'>Get Current Window</getCurWin><br/>");
	getCurWin.click(function () {
		triggerGetCurWin();
	});
	$("#Windows").append(getCurWin);
	const getSpawnData = $("<getSpawnData class='functionBtn'>Get Spawn Data</getSpawnData><br/>");
	getSpawnData.click(function () {
		triggerGetSpawnData();
	});
	$("#Windows").append(getSpawnData);
	const getStackedWindow = $("<getStackedWindow class='functionBtn'>Get Stacked Window</getStackedWindow><br/>");
	getStackedWindow.click(function () {
		triggerGetStackedWindow();
	});
	$("#Windows").append(getStackedWindow);
	const getWindowsGroup = $("<getWindowsGroup class='functionBtn'>Get Window Groups</getWindowsGroup><p class='instruct'>Group with 'API Testing 2' first</p><br/>");
	getWindowsGroup.click(function () {
		triggerGetWindowsGroup();
	});
	$("#Windows").append(getWindowsGroup);
	const getWindowIdentifier = $("<getWindowIdentifier class='functionBtn'>Get Window Identifier</getWindowIdentifier><br/>");
	getWindowIdentifier.click(function () {
		triggerGetWindowIdentifier();
	});
	$("#Windows").append(getWindowIdentifier);
	const getWindowNameForDocking = $("<getWindowNameForDocking class='functionBtn'>Get Window Name For Docking</getWindowNameForDocking><br/>");
	getWindowNameForDocking.click(function () {
		triggerGetWindowNameForDocking();
	});
	$("#Windows").append(getWindowNameForDocking);
	const getWindowTitle = $("<getWindowTitle class='functionBtn'>Get Window Title</getWindowTitle><br/>");
	getWindowTitle.click(function () {
		triggerGetWindowTitle();
	});
	$("#Windows").append(getWindowTitle);
	const estHeaderCommandChannel = $("<estHeaderCommandChannel class='functionBtn'>Establish Header Command Channel</estHeaderCommandChannel><br/>");
	estHeaderCommandChannel.click(function () {
		triggerEstHeaderCommandChannel();
	});
	$("#Windows").append(estHeaderCommandChannel);
	const injectHeader = $("<injectHeader class='functionBtn'>Inject Header</injectHeader><br/>");
	injectHeader.click(function () {
		triggerInjectHeader();
	});
	$("#Windows").append(injectHeader);
	const maximize = $("<maximize class='functionBtn'>Maximize</maximize><br/>");
	maximize.click(function () {
		triggerMaximize();
	});
	$("#Windows").append(maximize);
	const minimize = $("<minimize class='functionBtn'>Minimize</minimize><br/>");
	minimize.click(function () {
		triggerMinimize();
	});
	$("#Windows").append(minimize);
	const restore = $("<restore class='functionBtn'>Restore</restore><br/>");
	restore.click(function () {
		triggerRestore();
	});
	$("#Windows").append(restore);
	const sendWinIdentifierForTilingOrTabbing = $("<sendWinIdentifierForTilingOrTabbing class='functionBtn'>Send Window Identifier For Tiling or Tabbing</sendWinIdentifierForTilingOrTabbing><br/>");
	sendWinIdentifierForTilingOrTabbing.click(function () {
		triggerSendWinIdentifierForTilingOrTabbing();
	});
	$("#Windows").append(sendWinIdentifierForTilingOrTabbing);
	const setAlwaysOnTop = $("<setAlwaysOnTop class='functionBtn'>Set Always On Top</setAlwaysOnTop><br/>");
	setAlwaysOnTop.click(function () {
		triggerSetAlwaysOnTop();
	});
	$("#Windows").append(setAlwaysOnTop);
	const setWindowTitle = $("<setWindowTitle class='functionBtn'>Set Window Title</setWindowTitle><br/>");
	setWindowTitle.click(function () {
		triggerSetWindowTitle();
	});
	$("#Windows").append(setWindowTitle);
	const showAtMousePos = $("<showAtMousePos class='functionBtn'>Show At Mouse Position</showAtMousePos><br/>");
	showAtMousePos.click(function () {
		triggerShowAtMousePos();
	});
	$("#Windows").append(showAtMousePos);
	const startTilingOrTabbing = $("<startTilingOrTabbing class='functionBtn'>Start Tiling Or Tabbing</startTilingOrTabbing><br/>");
	startTilingOrTabbing.click(function () {
		triggerStartTilingOrTabbing();
	});
	$("#Windows").append(startTilingOrTabbing);
	const stopTilingOrTabbing = $("<stopTilingOrTabbing class='functionBtn'>Stop Tiling Or Tabbing</stopTilingOrTabbing><br/>");
	stopTilingOrTabbing.click(function () {
		triggerStopTilingOrTabbing();
	});
	$("#Windows").append(stopTilingOrTabbing);

	/* Dialog Buttons */
	const openDialog = $("<openDialog class='functionBtn'>Open Dialog</openDialog><br/>");
	openDialog.click(function () {
		triggerOpenDialog();
	});
	$("#Dialog").append(openDialog);

	/* Search Client Buttons */
	const search = $("<search class='functionBtn'>search</search><br/>");
	search.click(function () {
		triggerSearch();
	});
	$("#Search").append(search);
}

