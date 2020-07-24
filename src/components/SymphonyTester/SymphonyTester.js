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

		// List user's connection
		listExternalConnections()
		listInternalConnections()


		// Register onclick function to oboMsgBtn
		document.getElementById('oboMsgBtn').onclick = sendOboMsg

		// Register onclick function to oboMsgBtn
		document.getElementById('searchUsersBtn').onclick = searchUsers

		// Register onclick function to createIMBtn
		document.getElementById('createChatBtn').onclick = createIM
		document.getElementById('createChatroomBtn').onclick = createChatroom

		document.getElementById('newDirectChartBtn').onclick = newDirectChart
		document.getElementById('newChatRoomBtn').onclick = newChatRoom
		document.getElementById('backBtn').onclick = back

		// Register Tab function
		document.getElementById('internalTab').onclick = tabcontent
		document.getElementById('externalTab').onclick = tabcontent
		document.getElementById('searchTab').onclick = tabcontent
		document.getElementById('internalTab').click()

		// 
		document.getElementById('externalConnections').ondblclick = memberSelected
		document.getElementById('internalConnections').ondblclick = memberSelected
		document.getElementById('searchUsersResult').ondblclick = memberSelected
		document.getElementById('memberList').ondblclick = memberUnselected

		document.getElementById('shareChartBtn').onclick = shareChart
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
}

const shareChart = () => {
	let ticker = document.getElementById('tickerText').value
	let sid = document.getElementById('chatsSelect').options[document.getElementById('chatsSelect').selectedIndex].value;
	if (ticker == '') {
		return setDisplayMsg('Please input a ticker.', {})
	}

	let content = {
		blurb: 'Chart Type: candle',
		title: ticker.toUpperCase() + ' - 1D',
		shareID: JSON.stringify({})
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

const newDirectChart = (e) => {
	document.getElementById('chatroomNameDiv').style.display = 'none'
	document.getElementById('sendMsgDiv').style.display = 'none'
	document.getElementById('createGroupDiv').style.display = 'flex'

	document.getElementById('internalTabDiv').style.height = '80%';
	document.getElementById('externalTabDiv').style.height = '80%';
	document.getElementById('searchTabDiv').style.height = '80%';

	document.getElementById('createChatBtn').style.display = 'block'
	document.getElementById('createChatroomBtn').style.display = 'none'

	document.getElementById('createHeader').innerHTML = 'New Direct Chat'
	document.getElementById('internalTab').click()
}

const newChatRoom = () => {
	document.getElementById('chatroomNameDiv').style.display = 'block'
	document.getElementById('sendMsgDiv').style.display = 'none'
	document.getElementById('createGroupDiv').style.display = 'flex'

	document.getElementById('internalTabDiv').style.height = '55%';
	document.getElementById('externalTabDiv').style.height = '55%';
	document.getElementById('searchTabDiv').style.height = '55%';

	document.getElementById('createChatBtn').style.display = 'none'
	document.getElementById('createChatroomBtn').style.display = 'block'

	document.getElementById('createHeader').innerHTML = 'New Chat room'
	document.getElementById('internalTab').click()
}

const back = () => {
	document.getElementById('sendMsgDiv').style.display = 'flex'
	document.getElementById('createGroupDiv').style.display = 'none'
	selectedMemberList = []
	document.getElementById('memberList').innerHTML = ''
	document.getElementById('searchUsersResult').innerHTML = ''
	document.getElementById('searchUsersTxt').value = ''
}

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
				back()
				let id = queryResponseMessage.data.id
				retrieveSymphonyStream()
					.then(() => {
						document.getElementById('chatsSelect').value = id
					})
			}
		});
	} else {
		setDisplayMsg('Please select at list 1 member.', {})
	}
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
			back()
			let id = queryResponseMessage.data.room.roomSystemInfo.id
			retrieveSymphonyStream()
				.then(() => {
					document.getElementById('chatsSelect').value = id
				})
		}
	});
}

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
			FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
				function: symphonyQueryFunctionConfig.usersLookup,
				userId: connectionsIds
			}, (error, queryResponseMessage) => {
				if (!error) {
					let memberInfo = queryResponseMessage.data.memberInfo.users
					memberInfo.forEach(member => {
						addOption('externalConnections', member.displayName + ', ' + member.company, member.id)
					})

				}
			});
		}
	});
}

const listInternalConnections = () => {
	FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
		function: symphonyQueryFunctionConfig.searchUsers,
		query: 'ChartIQ',
		local: true
	}, (error, queryResponseMessage) => {
		if (!error) {
			let users = queryResponseMessage.data.users
			users.forEach(user => {
				let userDisplayName = user.displayName + ', ' + user.company
				let usedId = user.id
				addOption('internalConnections', userDisplayName, usedId)
			})
		}
	});
}

const searchUsers = () => {
	let query = document.getElementById('searchUsersTxt').value
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
					addOption('searchUsersResult', userDisplayName, usedId)
				})
			}
		});
	} else {
		setDisplayMsg('Please input a query in the "Members" textbox.', {})
	}
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
						userStream.streamAttributes.members.forEach(member => {
							streamMembers.push(member)
						})
					}
				})
				// Retrieve member info by id
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
			} else {
				console.log(err)
				document.getElementById('funcContainer').style.visibility ='hidden'
				setDisplayMsg('Unable to retireve Symhpony Usersession. Please check your Symphony username setting.', {})
			}
		});
	})
}

const addOption = ((elementId, name, value) => {
	let chatsSelect = document.getElementById(elementId)
	let tmpOption = document.createElement("option");
	tmpOption.text = name;
	tmpOption.value = value;
	chatsSelect.add(tmpOption);
})

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

const getSpawnData = () => {
	var spawnData = FSBL.Clients.WindowClient.getSpawnData();
	if (Object.keys(spawnData).length != 0) {
		setDisplayMsg('Received spawn data.', spawnData)
	}
}

const tabcontent = (e) => {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	document.getElementById(e.srcElement.id + 'Div').style.display = "block";
	e.currentTarget.className += " active";
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