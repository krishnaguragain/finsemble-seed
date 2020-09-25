// const axios = require('axios').default;

// Topic / channel name for routerClient 
const routerListenTransmitChannel = 'symphonyTransmit'
const routerPubSubChannel = 'symphonyPublish'
const routerQueryRespondChannel = 'symphonyQuery'
const symphonyServiceTopic = 'symphonyService'
const symphonyQueryFunctionConfig = {
	getUserStreamList: 'getSymphonyUserStreamList',
	usersLookup: 'usersLookup',
	createMessage: 'createMessage',
	searchUsers: 'searchUsers',
	createIM: 'createIM',
	listConnections: 'listConnections',
	createRoom: 'createRoom',
	share: 'share'
}

var selectedMemberList = []

const FSBLReady = () => {
	try {

		var acc = document.getElementsByClassName("accordion");
		for (var i = 0; i < acc.length; i++) {
			acc[i].addEventListener("click", function () {
				this.classList.toggle("active");
				switch (this.id) {
					case 'newDirectChatAcc':
						document.getElementById('createChatBtn').style.display = 'block'
						document.getElementById('createChatroomBtn').style.display = 'none'
						var panel = document.getElementById('newDirectChatPanel')
						if (panel.style.maxHeight) {
							panel.style.maxHeight = null;
							document.getElementById('selectChatPanel').style.display = 'block'
							document.getElementById('tickerPanel').style.display = 'block'
							document.getElementById('messageAcc').style.display = 'block'
							document.getElementById('consoleAcc').style.display = 'block'
							document.getElementById('newChatroomAcc').style.display = 'block'
						} else {
							document.getElementById('selectChatPanel').style.display = 'none'
							document.getElementById('tickerPanel').style.display = 'none'
							document.getElementById('messageAcc').style.display = 'none'
							document.getElementById('consoleAcc').style.display = 'none'
							document.getElementById('newChatroomAcc').style.display = 'none'
							document.getElementById('newDirectChatPanel').style.maxHeight = document.getElementById('newDirectChatPanel').scrollHeight + "px";
							document.getElementById('newChatroomPanel').style.maxHeight = null;
							document.getElementById('messagePanel').style.maxHeight = null;
							document.getElementById('resultPanel').style.maxHeight = null;
						}
						break;
					case 'newChatroomAcc':
						document.getElementById('createChatBtn').style.display = 'none'
						document.getElementById('createChatroomBtn').style.display = 'block'
						var panel = document.getElementById('newDirectChatPanel')
						if (panel.style.maxHeight) {
							panel.style.maxHeight = null;
							document.getElementById('newChatroomPanel').style.maxHeight = null;
							document.getElementById('selectChatPanel').style.display = 'block'
							document.getElementById('tickerPanel').style.display = 'block'
							document.getElementById('messageAcc').style.display = 'block'
							document.getElementById('consoleAcc').style.display = 'block'
							document.getElementById('newDirectChatAcc').style.display = 'block'
						} else {
							document.getElementById('selectChatPanel').style.display = 'none'
							document.getElementById('tickerPanel').style.display = 'none'
							document.getElementById('messageAcc').style.display = 'none'
							document.getElementById('consoleAcc').style.display = 'none'
							document.getElementById('newDirectChatAcc').style.display = 'none'
							document.getElementById('newDirectChatPanel').style.maxHeight = document.getElementById('newDirectChatPanel').scrollHeight + "px";
							document.getElementById('newChatroomPanel').style.maxHeight = document.getElementById('newChatroomPanel').scrollHeight + "px";
							document.getElementById('messagePanel').style.maxHeight = null;
							document.getElementById('resultPanel').style.maxHeight = null;
						}
						break;
					default:
						var panel = this.nextElementSibling;
						if (panel.style.maxHeight) {
							panel.style.maxHeight = null;
						} else {
							panel.style.maxHeight = panel.scrollHeight + "px";
						}
						break;
				}
			});
		}

		// Retrieve spawn data
		getSpawnData()

		// Handle router transmit message from Symphony through fpe-router
		routerListen()

		// Handle router pub/sub message from Symphony through fpe-router
		routerSubscribe()

		// Handle router query message from Symphony through fpe-router
		routerAddQueryResponder()

		// Retrieve existing symphony streams
		retrieveSymphonyStream()

		// Register onclick function to oboMsgBtn
		document.getElementById('oboMsgBtn').onclick = sendOboMsg

		document.getElementById('simpleShareBtn').onclick = symphonyShare
		document.getElementById('advanceShareBtn').onclick = symphonyShare



		// Register onclick function to oboMsgBtn
		document.getElementById('searchContactBtn').onclick = searchUsers

		// Register onclick function to createIMBtn
		document.getElementById('createChatBtn').onclick = createIM
		document.getElementById('createChatroomBtn').onclick = createChatroom


		// Register Tab function
		document.getElementById('internalTab').onclick = searchMembers
		document.getElementById('externalTab').onclick = searchMembers

		// // Register dbClick func to select user result
		document.getElementById('connectionResult').ondblclick = memberSelected
		document.getElementById('memberList').ondblclick = memberUnselected

		// Register click func to shareBtn
		document.getElementById('shareChartBtn').onclick = shareChart
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
}

const symphonyShare = (e) => {
	let target = 'SymphonySimpleShare'
	if (e.target.id == 'advanceShareBtn') {
		target = 'SymphonyAdvanceShare'
	}

	let msg = document.getElementById('oboMsg').value
	if (msg != '') {
		FSBL.Clients.LauncherClient.toggleWindowOnClick(document.getElementById('symphonyShareBtn'), {
			componentType: target
		}, {
			data: {
				shareMsg: msg
			},
			addToWorkspace: false,
			spawnIfNotFound: true,
			top: e.screenY,
			left: e.screenX
		})
	} else {
		setDisplayMsg('Please input a message in the "Send OBO Message" textarea.', {})
	}
}

const memberUnselected = (e) => {
	let memberId = e.srcElement.value
	let index = selectedMemberList.findIndex(el => el.id == memberId);
	selectedMemberList.splice(index, 1)
	let parentElement = e.srcElement.parentElement
	parentElement.remove(parentElement.selectedIndex)
}

const memberSelected = (e) => {
	let memberId = e.srcElement.value
	let memberDisplayValue = e.srcElement.text
	let selectedMember = {
		id: memberId,
		memberDisplayValue: memberDisplayValue
	}
	let alreadySelected = selectedMemberList.find(el => el.id == memberId)
	if (!alreadySelected) {
		selectedMemberList.push(selectedMember)
		addOption('memberList', memberDisplayValue, memberId)
	}
}

const addOption = ((elementId, name, value) => {
	let chatsSelect = document.getElementById(elementId)
	let tmpOption = document.createElement("option");
	tmpOption.text = name;
	tmpOption.value = value;
	chatsSelect.add(tmpOption);
})

const removeAllOptions = ((elementId) => {
	var select = document.getElementById(elementId);
	var length = select.options.length;
	for (i = length - 1; i >= 0; i--) {
		select.options[i] = null;
	}
})

const searchMembers = (e) => {
	removeAllOptions('connectionResult')
	if (e.target.id == 'internalTab') {
		listInternalConnections()
	} else if (e.target.id == 'externalTab') {
		listExternalConnections()
	}
}

// Retrieve all existing Symphony Stream
const retrieveSymphonyStream = () => {
	return new Promise((resolve, reject) => {
		document.getElementById("chatsSelect").options.length = 0;
		FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
			function: symphonyQueryFunctionConfig.getUserStreamList,
			streamTypes: [{
					"type": "IM"
				},
				{
					"type": "MIM"
				},
				{
					"type": "ROOM"
				}
			]
		}, (err, queryResponseMessage) => {
			if (!err) {
				let userStreamList = queryResponseMessage.data.userStreamList;
				let streamMembers = []
				userStreamList.forEach((userStream, key, arr) => {
					if (userStream.roomAttributes) {
						// Handle chart room
						addOption('chatsSelect', userStream.roomAttributes.name, userStream.id)
					} else {
						// Handle IM / MIM
						// streamMembers only contains id
						// Have retrieve their displayName
						userStream.streamAttributes.members.forEach(member => {
							streamMembers.push(member)
						})
					}
				})
				// Retrieve member info by ids
				if (streamMembers.length != 0) {
					FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
						function: symphonyQueryFunctionConfig.usersLookup,
						userId: streamMembers
					}, (err, queryResponseMessage) => {
						if (!err) {
							let memberInfo = queryResponseMessage.data.memberInfo.users
							userStreamList.forEach((userStream, key, arr) => {
								if (!userStream.roomAttributes) {
									// Handle IM / MIM
									// streamMembers only contains id
									let memberDisplayName = []
									userStream.streamAttributes.members.forEach(member => {
										memberFullDetail = memberInfo.find(el => el.id == member)
										if (memberFullDetail) {
											memberDisplayName.push(memberFullDetail.displayName)
										}
									})
									addOption('chatsSelect', memberDisplayName.toString(), userStream.id)
								}
							})
							resolve();
						}
					});
				}
			} else {
				console.log(err)
				document.getElementById('funcContainer').style.visibility = 'hidden'
				setDisplayMsg('Unable to retireve Symhpony Usersession. Please check your Symphony username setting.', {})
			}
		});
	})
}

// List existing external connection
const listExternalConnections = () => {
	let status = 'ACCEPTED'
	FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
		function: symphonyQueryFunctionConfig.listConnections,
		status: status
	}, (error, queryResponseMessage) => {
		if (!error) {
			let connections = queryResponseMessage.data.connections
			let connectionsIds = []
			connections.forEach(connection => {
				connectionsIds.push(connection.userId)
			})
			if (connectionsIds.length != 0) {
				FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
					function: symphonyQueryFunctionConfig.usersLookup,
					userId: connectionsIds
				}, (error, queryResponseMessage) => {
					if (!error) {
						let memberInfo = queryResponseMessage.data.memberInfo.users
						memberInfo.forEach(member => {
							addOption('connectionResult', member.displayName + ', ' + member.company, member.id)
						})

					}
				});
			}
		}
	});
}

const listInternalConnections = () => {
	FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
		function: symphonyQueryFunctionConfig.searchUsers,
		query: 'ChartIQ', // Your firm name in Symphony
		local: true
	}, (error, queryResponseMessage) => {
		if (!error) {
			let users = queryResponseMessage.data.users
			users.forEach(user => {
				let userDisplayName = user.displayName + ', ' + user.company
				let usedId = user.id
				addOption('connectionResult', userDisplayName, usedId)
			})
		}
	});
}

// Search users by keywords
const searchUsers = () => {
	removeAllOptions('connectionResult')
	let query = document.getElementById('memberSearchText').value
	if (query != '') {
		FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
			function: symphonyQueryFunctionConfig.searchUsers,
			query: query
		}, (error, queryResponseMessage) => {
			if (!error) {
				let users = queryResponseMessage.data.users
				users.forEach(user => {
					let userDisplayName = user.displayName + ', ' + user.company
					let usedId = user.id
					addOption('connectionResult', userDisplayName, usedId)
				})
			}
		});
	} else {
		setDisplayMsg('Please input a query in the "Members" textbox.', {})
	}
}

// Create IM with the selected users
const createIM = (e) => {
	let selectedUsers = []
	selectedMemberList.forEach(selectedMember => {
		selectedUsers.push(selectedMember.id)
	})

	if (selectedUsers.length > 0) {
		FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
			function: symphonyQueryFunctionConfig.createIM,
			userIDs: selectedUsers
		}, (error, queryResponseMessage) => {
			if (!error) {
				setDisplayMsg('New IM Created.', {})
				document.getElementById('newDirectChatAcc').click()
				let id = queryResponseMessage.data.id
				selectedMemberList = []
				retrieveSymphonyStream()
					.then(() => {
						document.getElementById('chatsSelect').value = id
						removeAllOptions('connectionResult')
						removeAllOptions('memberList')
					})
			}
		});
	} else {
		setDisplayMsg('Please select at list 1 member.', {})
	}
}

// This share chart function is only an example how to make use of SYmphony share API
// Make sure the receiving end has installed the ExtensionApp
const shareChart = () => {
	let ticker = document.getElementById('tickerText').value
	let sid = document.getElementById('chatsSelect').options[document.getElementById('chatsSelect').selectedIndex].value;
	if (ticker == '') {
		return setDisplayMsg('Please input a ticker.', {})
	}

	// Create content obj for Symphony share api
	// Length of articleId is limited to 100 by Symphony
	let content = {
		title: ticker.toUpperCase() + ' - 1D',
		subTitle: "A chart has been shared with you.",
		summary: "Chart Type: line",
		articleId: JSON.stringify({
			itemType: "AdvancedChart",
			widgetId: "chart",
			data: {
				layout: {
					symbols: [{
						symbol: ticker
					}]
				}
			}
		}),
		author: "ChartIQ",
		publisher: "ChartIQ",
		appId: "ChartIQApp",
		thumbnailUrl: "https://symphony.chartiq.com/ChartIQ/Symphony/img/CIQ_Mark_64x64.png",
		appIconUrl: "https://symphony.chartiq.com/ChartIQ/Symphony/img/CIQ_Mark_64x64.png"
	}

	FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
		function: symphonyQueryFunctionConfig.share,
		sid: sid,
		content: content
	}, (error, queryResponseMessage) => {
		if (!error) {
			console.log(queryResponseMessage.data)
			setDisplayMsg('Chart shared.', {})
		}
	});
}

const createChatroom = () => {
	let selectedUsers = []
	selectedMemberList.forEach(selectedMember => {
		selectedUsers.push(selectedMember.id)
	})
	let chatroomName = document.getElementById('chatroomText').value
	if (chatroomName == '') {
		return setDisplayMsg('Please input a chatroom name.', {})
	}

	if (selectedUsers.length == 0) {
		return setDisplayMsg('Please select at least 1 member.', {})
	}

	FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
		function: symphonyQueryFunctionConfig.createRoom,
		chatroomName: chatroomName,
		userIDs: selectedUsers
	}, (error, queryResponseMessage) => {
		if (!error) {
			setDisplayMsg('New Chartroom created.', queryResponseMessage.data)
			document.getElementById('newChatroomAcc').click()
			let id = queryResponseMessage.data.room.roomSystemInfo.id
			selectedMemberList = []
			retrieveSymphonyStream()
				.then(() => {
					document.getElementById('chatsSelect').value = id
					removeAllOptions('connectionResult')
					removeAllOptions('memberList')
				})
		}
	});
}

const sendOboMsg = () => {
	let msg = document.getElementById('oboMsg').value
	let sid = document.getElementById('chatsSelect').options[document.getElementById('chatsSelect').selectedIndex].value;
	if (msg != '') {
		FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
			function: symphonyQueryFunctionConfig.createMessage,
			sid: sid,
			msg: msg
		}, function (error, queryResponseMessage) {
			if (!error) {
				let result = queryResponseMessage.data.result
				setDisplayMsg('OBO message sent successuflly with following result.', result)
			}
		});
	} else {
		setDisplayMsg('Please input a message in the "Send OBO Message" textarea.', {})
	}
}


// Subscribe to router listen/transmit channel where Symphony ExtensionApp will be transmitted to usoing fpe-router
const routerListen = () => {
	FSBL.Clients.RouterClient.addListener(routerListenTransmitChannel, (err, res) => {
		if (err) {
			setDisplayMsg('Error when receiving router transmit message from Symphony.', err)
		} else {
			let transmitData = res.data;
			setDisplayMsg('Received router transmit message from Symphony.', transmitData)
		}
	});
}

// Subscribe to router query/respond channel where Symphony ExtensionApp will be posted to usoing fpe-router and send a respond to
const routerAddQueryResponder = () => {
	FSBL.Clients.RouterClient.addResponder(routerQueryRespondChannel, (err, queryMessage) => {
		if (err) {
			setDisplayMsg('addResponder failed.', err);
		} else {
			let queryData = queryMessage.data
			setDisplayMsg('Received router query message from Symphony.', queryData)
			var response = {
				data: 'response message from finsemble'
			};
			queryMessage.sendQueryResponse(null, response); // The callback must respond, else a timeout will occur on the querying client.
		}
	});
}

// Subscribe to router pub/sub channel where Symphony ExtensionApp will be posted to usoing fpe-router
const routerSubscribe = () => {
	var subscribeId = FSBL.Clients.RouterClient.subscribe(routerPubSubChannel, (err, notify) => {
		if (err) {
			setDisplayMsg('Error when receiving router pub/sub message from Symphony.', err)
		} else {
			let notificationStateData = notify.data;
			if (!notificationStateData.State)
				setDisplayMsg('Received router pub/sub message from Symphony.', notificationStateData)
		}
	});
}

// Handle spawndata
const getSpawnData = () => {
	var spawnData = FSBL.Clients.WindowClient.getSpawnData();
	if (Object.keys(spawnData).length != 0) {
		setDisplayMsg('Received spawn data.', spawnData)
	}
}

// Helper functionn to display result message in textarea
const setDisplayMsg = (msg, respondObj, append) => {
	if (append)
		document.getElementById('resultMsg').value += '\n\n' + msg + '\n\n'
	else
		document.getElementById('resultMsg').value = msg + '\n\n'
	if (respondObj)
		document.getElementById('resultMsg').value += JSON.stringify(respondObj, null, "\t");
}

if (window.FSBL && FSBL.addEventListener) {
	FSBL.addEventListener("onReady", FSBLReady)
} else {
	window.addEventListener("FSBLReady", FSBLReady)
}