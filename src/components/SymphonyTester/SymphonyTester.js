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
	createIM: 'createIM'
}

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


		// Register onclick function to oboMsgBtn
		document.getElementById('oboMsgBtn').onclick = sendOboMsg

		// Register onclick function to oboMsgBtn
		document.getElementById('searchUsersBtn').onclick = searchUsers

		// Register onclick function to oboMsgBtn
		document.getElementById('createIMBtn').onclick = createIM
	} catch (e) {
		FSBL.Clients.Logger.error(e);
	}
}

const createIM = () => {
	let selectedUsers = Array(...document.getElementById('searchUsersResult').options).reduce((acc, option) => {
		if (option.selected === true) {
			acc.push(option.value);
		}
		return acc;
	}, []);

	if (selectedUsers.length > 0) {
		FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
			function: symphonyQueryFunctionConfig.createIM,
			userIDs: selectedUsers
		}, (error, queryResponseMessage) => {
			if (!error) {
				setDisplayMsg('New IM Created.', {})
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
		}, function (error, queryResponseMessage) {
			if (!error) {
				let userStreamList = queryResponseMessage.data.userStreamList;
				userStreamList.forEach((userStream, key, arr)=> {
					if (userStream.roomAttributes) {
						// Handle chart room
						addOption('chatsSelect', userStream.roomAttributes.name, userStream.id)
					} else {
						// Handle IM / MIM
						// streamMembers only contains id
						let streamMembers = userStream.streamAttributes.members
						// Retrieve member info by id
						FSBL.Clients.RouterClient.query(symphonyServiceTopic, {
							function: symphonyQueryFunctionConfig.usersLookup,
							userId: streamMembers
						}, (error, queryResponseMessage) => {
							if (!error) {
								let memberInfo = queryResponseMessage.data.memberInfo.users
								let memberDisplayName = []
								memberInfo.forEach(member => {
									memberDisplayName.push(member.displayName)
								})
								addOption('chatsSelect', memberDisplayName.toString(), userStream.id)
								if (key === arr.length - 1){ 
									resolve();
								}
							}
						});
					}
				})
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